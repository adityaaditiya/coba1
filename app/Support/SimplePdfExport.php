<?php

namespace App\Support;

class SimplePdfExport
{
    /**
     * @param  array<int, string>  $headers
     * @param  array<int, array<int, mixed>>  $rows
     * @param  array<int, array{title?:string,headers?:array<int,string>,rows?:array<int, array<int, mixed>>,footer_lines?:array<int,string>,column_widths?:array<int,float|int>}>  $sections
     */
    public static function make(string $title, string $period, array $headers, array $rows, array $sections = [], string $orientation = 'portrait'): string
    {
        $headers = array_values(array_map(fn ($header) => self::normalizeCell((string) $header), $headers));

        $normalizedSections = count($sections) > 0
            ? array_values(array_map(fn ($section) => self::normalizeSection($section), $sections))
            : [[
                'title' => '',
                'headers' => $headers,
                'rows' => array_map(fn ($row) => self::normalizeRow((array) $row), $rows),
                'footer_lines' => [],
                'column_widths' => [],
            ]];

        return self::buildPdf($title, $period, $headers, $normalizedSections, $orientation);
    }

    /**
     * @param  array{title?:string,rows?:array<int, array<int, mixed>>,footer_lines?:array<int,string>,column_widths?:array<int,float|int>}  $section
     * @return array{title:string,headers:array<int,string>,rows:array<int, array<int, string>>,footer_lines:array<int,string>,column_widths:array<int,float>}
     */
    protected static function normalizeSection(array $section): array
    {
        $headers = array_values(array_map(fn ($header) => self::normalizeCell((string) $header), (array) ($section['headers'] ?? [])));
        $rows = array_map(fn ($row) => self::normalizeRow((array) $row), (array) ($section['rows'] ?? []));
        $footerLines = array_values(array_map(fn ($line) => self::normalizeCell((string) $line), (array) ($section['footer_lines'] ?? [])));
        $columnWidths = array_values(array_map(fn ($width) => max((float) $width, 0.0), (array) ($section['column_widths'] ?? [])));

        return [
            'title' => self::normalizeCell((string) ($section['title'] ?? '')),
            'headers' => $headers,
            'rows' => $rows,
            'footer_lines' => $footerLines,
            'column_widths' => $columnWidths,
            'page_break_before' => ! empty($section['page_break_before']),
        ];
    }

    /**
     * @param  array<int, mixed>  $row
     * @return array<int, string>
     */
    protected static function normalizeRow(array $row): array
    {
        return array_values(array_map(fn ($cell) => self::normalizeCell((string) $cell), $row));
    }

    /**
     * @param  array<int, string>  $headers
     * @param  array<int, array{title:string,headers:array<int,string>,rows:array<int, array<int, string>>,footer_lines:array<int,string>,column_widths:array<int,float>}>  $sections
     */
    protected static function buildPdf(string $title, string $period, array $headers, array $sections, string $orientation): string
    {
        $isLandscape = strtolower($orientation) === 'landscape';
        $pageWidth = $isLandscape ? 842.0 : 612.0;
        $pageHeight = $isLandscape ? 612.0 : 842.0;
        $marginLeft = 40.0;
        $marginRight = 40.0;
        $marginTop = 40.0;
        $marginBottom = 40.0;
        $tableWidth = $pageWidth - $marginLeft - $marginRight;

        $titleGap = 22.0;
        $periodGap = 18.0;
        $sectionGap = 18.0;
        $sectionTitleGap = 16.0;
        $rowHeight = 22.0;
        $footerGap = 14.0;

        $pages = [];
        $content = '';
        $currentY = $pageHeight - $marginTop;

        $appendPageHeader = function () use (&$content, &$currentY, $title, $period, $marginLeft, $titleGap, $periodGap) {
            $content .= self::drawText($marginLeft, $currentY, 14, $title);
            $currentY -= $titleGap;
            $content .= self::drawText($marginLeft, $currentY, 11, $period);
            $currentY -= $periodGap;
        };

        $newPage = function () use (&$pages, &$content, &$currentY, $pageHeight, $marginTop, $appendPageHeader) {
            if ($content !== '') {
                $pages[] = $content;
            }

            $content = '';
            $currentY = $pageHeight - $marginTop;
            $appendPageHeader();
        };

        $ensureSpace = function (float $requiredHeight) use (&$currentY, $marginBottom, $newPage) {
            if (($currentY - $requiredHeight) < $marginBottom) {
                $newPage();
            }
        };

        $drawTableHeader = function (array $tableHeaders, array $columnWidths) use (&$content, &$currentY, $marginLeft, $rowHeight) {
            $x = $marginLeft;
            foreach ($tableHeaders as $index => $header) {
                $width = $columnWidths[$index] ?? ($columnWidths[count($columnWidths) - 1] ?? 0.0);
                $content .= self::drawRect($x, $currentY - $rowHeight, $width, $rowHeight);
                $content .= self::drawText($x + 4, $currentY - 15, 10, self::truncateToWidth($header, $width - 8));
                $x += $width;
            }
            $currentY -= $rowHeight;
        };

        $newPage();

        foreach ($sections as $sectionIndex => $section) {
            if ($sectionIndex > 0) {
                if (! empty($section['page_break_before'])) {
                    $newPage();
                } else {
                    $ensureSpace($sectionGap);
                    $currentY -= $sectionGap;
                }
            }

            if ($section['title'] !== '') {
                $ensureSpace($sectionTitleGap);
                $content .= self::drawText($marginLeft, $currentY, 11, $section['title']);
                $currentY -= $sectionTitleGap;
            }

            $tableHeaders = count($section['headers']) > 0 ? $section['headers'] : $headers;
            $colCount = max(count($tableHeaders), 1);

            $weights = $section['column_widths'];
            if (count($weights) !== $colCount || array_sum($weights) <= 0) {
                $weights = array_fill(0, $colCount, 1.0);
            }
            $weightSum = array_sum($weights);
            $columnWidths = array_map(fn ($weight) => ($tableWidth * $weight) / $weightSum, $weights);

            $ensureSpace($rowHeight);
            $drawTableHeader($tableHeaders, $columnWidths);

            if (count($section['rows']) === 0) {
                $ensureSpace(16.0);
                $content .= self::drawText($marginLeft, $currentY - 16, 10, 'Tidak ada data.');
                $currentY -= 20.0;
            }

            foreach ($section['rows'] as $row) {
                // Determine wrapped lines for each cell
                $rowLines = [];
                $maxLines = 1;
                for ($i = 0; $i < $colCount; $i++) {
                    $cell = $row[$i] ?? '';
                    $width = $columnWidths[$i] ?? ($columnWidths[count($columnWidths) - 1] ?? 0.0);
                    $lines = self::wrapText($cell, $width - 8);
                    $rowLines[$i] = $lines;
                    if (count($lines) > $maxLines) {
                        $maxLines = count($lines);
                    }
                }
                
                $dynamicRowHeight = max($rowHeight, ($maxLines * 12) + 10);
                $ensureSpace($dynamicRowHeight);

                $x = $marginLeft;
                for ($i = 0; $i < $colCount; $i++) {
                    $width = $columnWidths[$i] ?? ($columnWidths[count($columnWidths) - 1] ?? 0.0);
                    $content .= self::drawRect($x, $currentY - $dynamicRowHeight, $width, $dynamicRowHeight);
                    
                    $lineY = $currentY - 15;
                    foreach ($rowLines[$i] as $lineIndex => $line) {
                        $content .= self::drawText($x + 4, $lineY - ($lineIndex * 12), 10, $line);
                    }
                    
                    $x += $width;
                }

                $currentY -= $dynamicRowHeight;
            }

            foreach ($section['footer_lines'] as $lineIndex => $line) {
                $ensureSpace($footerGap);
                $fontSize = $lineIndex === 0 ? 10 : 9;
                $content .= self::drawText($marginLeft, $currentY - 12, $fontSize, $line);
                $currentY -= $footerGap;
            }
        }

        if ($content !== '') {
            $pages[] = $content;
        }

        return self::buildPdfDocument($pages, $pageWidth, $pageHeight);
    }

    /**
     * @param  array<int, string>  $pageContents
     */
    protected static function buildPdfDocument(array $pageContents, float $pageWidth = 612.0, float $pageHeight = 842.0): string
    {
        $objects = [];
        $fontObjectId = 1;
        $pagesObjectId = 2;
        $nextObjectId = 3;

        $objects[$fontObjectId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

        $pageObjectIds = [];

        foreach ($pageContents as $pageContent) {
            $contentObjectId = $nextObjectId++;
            $objects[$contentObjectId] = "<< /Length " . strlen($pageContent) . " >>\nstream\n{$pageContent}\nendstream";

            $pageObjectId = $nextObjectId++;
            $pageObjectIds[] = $pageObjectId;
            $objects[$pageObjectId] = "<< /Type /Page /Parent {$pagesObjectId} 0 R /MediaBox [0 0 {$pageWidth} {$pageHeight}] /Resources << /Font << /F1 {$fontObjectId} 0 R >> >> /Contents {$contentObjectId} 0 R >>";
        }

        $kids = implode(' ', array_map(fn ($id) => "{$id} 0 R", $pageObjectIds));
        $objects[$pagesObjectId] = "<< /Type /Pages /Kids [{$kids}] /Count " . count($pageObjectIds) . ' >>';

        $catalogObjectId = $nextObjectId++;
        $objects[$catalogObjectId] = "<< /Type /Catalog /Pages {$pagesObjectId} 0 R >>";

        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $id => $body) {
            $offsets[$id] = strlen($pdf);
            $pdf .= "{$id} 0 obj\n{$body}\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf('%010d 00000 n ', $offsets[$i]) . "\n";
        }

        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root {$catalogObjectId} 0 R >>\n";
        $pdf .= "startxref\n{$xrefOffset}\n%%EOF";

        return $pdf;
    }

    protected static function drawRect(float $x, float $y, float $w, float $h): string
    {
        return sprintf("%.2f %.2f %.2f %.2f re S\n", $x, $y, $w, $h);
    }

    protected static function drawText(float $x, float $y, int $size, string $text): string
    {
        return sprintf(
            "BT\n/F1 %d Tf\n1 0 0 1 %.2f %.2f Tm\n(%s) Tj\nET\n",
            $size,
            $x,
            $y,
            self::escapePdfText(self::normalizeText($text))
        );
    }

    /**
     * Hitung lebar string teks Helvetica 10pt secara presisi sesuai font metric.
     */
    protected static function getTextWidth(string $text, int $fontSize = 10): float
    {
        static $charWidths = [
            ' ' => 278, '!' => 278, '"' => 355, '#' => 556, '$' => 556, '%' => 889, '&' => 667, '\'' => 191,
            '(' => 333, ')' => 333, '*' => 389, '+' => 584, ',' => 278, '-' => 333, '.' => 278, '/' => 278,
            '0' => 556, '1' => 556, '2' => 556, '3' => 556, '4' => 556, '5' => 556, '6' => 556, '7' => 556,
            '8' => 556, '9' => 556, ':' => 278, ';' => 278, '<' => 584, '=' => 584, '>' => 584, '?' => 556,
            '@' => 1015, 'A' => 667, 'B' => 667, 'C' => 722, 'D' => 722, 'E' => 667, 'F' => 611, 'G' => 778,
            'H' => 722, 'I' => 278, 'J' => 500, 'K' => 667, 'L' => 556, 'M' => 833, 'N' => 722, 'O' => 778,
            'P' => 667, 'Q' => 778, 'R' => 722, 'S' => 667, 'T' => 611, 'U' => 722, 'V' => 667, 'W' => 944,
            'X' => 667, 'Y' => 667, 'Z' => 611, '[' => 278, '\\' => 278, ']' => 278, '^' => 469, '_' => 556,
            '`' => 222, 'a' => 556, 'b' => 556, 'c' => 500, 'd' => 556, 'e' => 556, 'f' => 278, 'g' => 556,
            'h' => 556, 'i' => 222, 'j' => 222, 'k' => 500, 'l' => 222, 'm' => 833, 'n' => 556, 'o' => 556,
            'p' => 556, 'q' => 556, 'r' => 333, 's' => 500, 't' => 278, 'u' => 556, 'v' => 500, 'w' => 722,
            'x' => 500, 'y' => 500, 'z' => 500, '{' => 334, '|' => 260, '}' => 334, '~' => 584
        ];

        $totalUnits = 0;
        $len = strlen($text);
        for ($i = 0; $i < $len; $i++) {
            $char = $text[$i];
            $totalUnits += $charWidths[$char] ?? 556;
        }

        return ($totalUnits / 1000.0) * $fontSize;
    }

    protected static function truncateToWidth(string $value, float $usableWidth): string
    {
        if (self::getTextWidth($value, 10) <= $usableWidth) {
            return $value;
        }

        $dotsWidth = self::getTextWidth('...', 10);
        $result = '';
        $len = mb_strlen($value);

        for ($i = 0; $i < $len; $i++) {
            $char = mb_substr($value, $i, 1);
            if (self::getTextWidth($result . $char, 10) + $dotsWidth > $usableWidth) {
                break;
            }
            $result .= $char;
        }

        return $result . '...';
    }

    protected static function wrapText(string $text, float $usableWidth): array
    {
        $lines = [];
        $explicitLines = explode("\n", str_replace("\r", "", $text));

        foreach ($explicitLines as $explicitLine) {
            if (self::getTextWidth($explicitLine, 10) <= $usableWidth) {
                $lines[] = $explicitLine;
                continue;
            }

            $words = explode(' ', $explicitLine);
            $currentLine = '';

            foreach ($words as $word) {
                $testLine = $currentLine === '' ? $word : $currentLine . ' ' . $word;

                if (self::getTextWidth($testLine, 10) > $usableWidth) {
                    if ($currentLine !== '') {
                        $lines[] = $currentLine;
                        $currentLine = $word;
                    } else {
                        // Jika 1 kata tunggal lebih panjang dari lebar kolom, potong per karakter
                        $chunk = '';
                        $len = mb_strlen($word);
                        for ($i = 0; $i < $len; $i++) {
                            $char = mb_substr($word, $i, 1);
                            if (self::getTextWidth($chunk . $char, 10) > $usableWidth) {
                                if ($chunk !== '') {
                                    $lines[] = $chunk;
                                }
                                $chunk = $char;
                            } else {
                                $chunk .= $char;
                            }
                        }
                        $currentLine = $chunk;
                    }
                } else {
                    $currentLine = $testLine;
                }
            }

            if ($currentLine !== '') {
                $lines[] = $currentLine;
            }
        }

        return $lines;
    }

    protected static function normalizeCell(string $value): string
    {
        return preg_replace('/\s+/', ' ', trim($value)) ?? '';
    }

    protected static function escapePdfText(string $text): string
    {
        return str_replace(
            ['\\', '(', ')'],
            ['\\\\', '\\(', '\\)'],
            $text
        );
    }

    protected static function normalizeText(string $text): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);

        return $ascii !== false ? $ascii : $text;
    }
}
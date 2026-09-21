<?php

namespace App\Support;

use App\Models\Customer;
use App\Models\Question;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class QuestionnairePdfExport
{
    public static function download(Customer $customer): Response
    {
        $customer->loadMissing('user');

        $questions = Question::query()->orderBy('order', 'asc')->orderBy('id', 'asc')->get();
        $existingAnswers = $customer->questionnaireAnswers()
            ->pluck('answer_value', 'question_id')
            ->toArray();

        $typeLabels = [
            'text' => 'Teks',
            'number' => 'Nomor',
            'multiple_choice' => 'Pilihan Ganda',
            'checkbox' => 'Checkbox',
        ];

        $questionRows = [];
        foreach ($questions as $index => $question) {
            $rawAnswer = $existingAnswers[$question->id] ?? null;
            $formattedAnswer = '-';

            if ($question->input_type === 'checkbox' && $rawAnswer) {
                $decoded = json_decode($rawAnswer, true);
                if (is_array($decoded)) {
                    $formattedAnswer = count($decoded) > 0 ? implode(', ', $decoded) : '-';
                } else {
                    $formattedAnswer = (string) $rawAnswer;
                }
            } elseif ($rawAnswer !== null && trim((string) $rawAnswer) !== '') {
                $formattedAnswer = (string) $rawAnswer;
            }

            $questionRows[] = [
                (string) ($index + 1),
                $question->question_text,
                // $typeLabels[$question->input_type] ?? $question->input_type,
                $formattedAnswer,
            ];
        }

        if (count($questionRows) === 0) {
            $questionRows[] = ['-', 'Belum ada data pertanyaan kuesioner.', '-', '-'];
        }

        $sections = [
            [
                'title' => 'DATA PELANGGAN',
                'headers' => ['Informasi', 'Keterangan'],
                'rows' => [
                    ['Nama Pelanggan', $customer->name ?: '-'],
                    ['Email', $customer->user?->email ?: '-'],
                    ['No. Telepon / WhatsApp', $customer->no_telp ?: '-'],
                    ['Jenis Kelamin', $customer->gender ? ucfirst($customer->gender) : '-'],
                    ['Tanggal Lahir', $customer->date_of_birth ? $customer->date_of_birth->format('d/m/Y') : '-'],
                ],
                'column_widths' => [2.5, 7.5],
                'footer_lines' => [],
            ],
            [
                'title' => 'DAFTAR PERTANYAAN & JAWABAN KUESIONER',
                'headers' => ['No', 'Pertanyaan', 'Jawaban'],
                'rows' => $questionRows,
                'column_widths' => [0.6, 6.2, 3.2],
                'footer_lines' => [],
            ],
        ];

        $customerNameUpper = strtoupper($customer->name ?: 'PELANGGAN');
        $title = 'KUESIONER PELANGGAN - ' . $customerNameUpper;
        $period = 'Dicetak pada: ' . now()->timezone('Asia/Jakarta')->format('d/m/Y H:i') . ' WIB';

        $pdfBinary = SimplePdfExport::make(
            $title,
            $period,
            [],
            [],
            $sections,
            'portrait'
        );

        $safeFileName = 'kuesioner-' . Str::slug($customer->name ?: 'pelanggan') . '.pdf';

        return response($pdfBinary, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $safeFileName . '"',
        ]);
    }
}

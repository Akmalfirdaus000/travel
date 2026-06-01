<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body { font-family: sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h1 { margin: 0 0 10px 0; }
        .meta { font-size: 0.9em; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-top: 20px; display: flex; gap: 20px; flex-wrap: wrap; }
        .summary-card { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; min-width: 200px; }
        .summary-title { font-size: 0.85em; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .summary-value { font-size: 1.5em; font-weight: bold; }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Print / Save as PDF</button>
    </div>

    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="meta">
            Dicetak pada: {{ now()->format('d M Y H:i:s') }}
        </div>
    </div>

    @if(isset($summary))
    <div class="summary">
        @foreach($summary as $key => $value)
        <div class="summary-card">
            <div class="summary-title">{{ $key }}</div>
            <div class="summary-value">{{ is_numeric($value) && strpos($key, 'Rp') !== false ? 'Rp ' . number_format($value, 0, ',', '.') : $value }}</div>
        </div>
        @endforeach
    </div>
    @endif

    <br>

    {!! $table !!}

</body>
</html>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan Status Stok</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .danger {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>LAPORAN STATUS STOK SUKU CADANG</h2>
        <p>UPJ Otomotif dan AHASS BLPT DIY</p>
        <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d-m-Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Suku Cadang</th>
                <th>Kategori</th>
                <th>Harga Jual (Rp)</th>
                <th>Batas Minimum</th>
                <th>Stok Saat Ini</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stocks as $i => $st)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ $st->sparePart->kode_suku_cadang }}</td>
                    <td>{{ $st->sparePart->nama_suku_cadang }}</td>
                    <td>{{ $st->sparePart->kategori }}</td>
                    <td class="text-right">{{ number_format($st->sparePart->harga_jual, 0, ',', '.') }}</td>
                    <td class="text-center">{{ $st->stok_minimum }}</td>
                    <td class="text-center {{ $st->stok_sekarang <= $st->stok_minimum ? 'danger' : '' }}">
                        {{ $st->stok_sekarang }}
                    </td>
                    <td class="text-center">
                        @if($st->stok_sekarang <= $st->stok_minimum)
                            <span class="danger">Perlu Restock</span>
                        @else
                            Aman
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
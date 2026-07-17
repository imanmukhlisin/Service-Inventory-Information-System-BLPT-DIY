<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan Jasa Servis</title>
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

        .header {
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>LAPORAN JASA SERVIS DAN PRODUKTIVITAS MEKANIK</h2>
        <p>UPJ Otomotif dan AHASS BLPT DIY</p>
        <p>Periode: {{ $startDate }} s/d {{ $endDate }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal Servis</th>
                <th>No Nota</th>
                <th>Nama Mekanik</th>
                <th>Jenis Jasa</th>
                <th>Keterangan</th>
                <th>Biaya Jasa (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php $total_semua = 0; @endphp
            @foreach($services as $i => $svc)
                @php $total_semua += $svc->biaya_jasa; @endphp
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($svc->transaction->tanggal)->format('d-m-Y H:i') }}</td>
                    <td>{{ $svc->transaction->no_nota }}</td>
                    <td>{{ $svc->mechanic->nama_mekanik }}</td>
                    <td>{{ $svc->nama_jasa }}</td>
                    <td>{{ $svc->keterangan_jasa ?? '-' }}</td>
                    <td class="text-right">{{ number_format($svc->biaya_jasa, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="6" class="text-right">Total Pendapatan Jasa:</th>
                <th class="text-right">{{ number_format($total_semua, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
</body>

</html>
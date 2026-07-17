<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan Suku Cadang</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>LAPORAN PENJUALAN SUKU CADANG</h2>
        <p>UPJ Otomotif dan AHASS BLPT DIY</p>
        <p>Periode: {{ $startDate }} s/d {{ $endDate }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal Transaksi</th>
                <th>No Nota</th>
                <th>Kode - Nama Suku Cadang</th>
                <th>Qty</th>
                <th>Harga Satuan (Rp)</th>
                <th>Total (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $qty = 0; 
                $total_semua = 0; 
            @endphp
            @foreach($sales as $i => $s)
                @php 
                    $qty += $s->jumlah; 
                    $total_semua += $s->total_harga; 
                @endphp
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($s->transaction->tanggal)->format('d-m-Y H:i') }}</td>
                    <td>{{ $s->transaction->no_nota }}</td>
                    <td>{{ $s->sparePart->kode_suku_cadang }} - {{ $s->sparePart->nama_suku_cadang }}</td>
                    <td class="text-right">{{ $s->jumlah }}</td>
                    <td class="text-right">{{ number_format($s->harga_satuan, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($s->total_harga, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="4" class="text-right">Grand Total:</th>
                <th class="text-right">{{ $qty }}</th>
                <th></th>
                <th class="text-right">{{ number_format($total_semua, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
</body>
</html>

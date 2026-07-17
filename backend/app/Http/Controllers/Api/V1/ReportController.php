<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SparePartStock;
use App\Models\TransactionService;
use App\Models\TransactionSparePart;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    private function parseDateRange(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Default to beginning of current month if not provided
        if (! $startDate) {
            $startDate = Carbon::now()->startOfMonth()->format('Y-m-d');
        }
        if (! $endDate) {
            $endDate = Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        return [$startDate, $endDate];
    }

    public function servicesReport(Request $request)
    {
        [$startDate, $endDate] = $this->parseDateRange($request);

        $services = TransactionService::with(['transaction', 'mechanic'])
            ->whereHas('transaction', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
            })
            ->get();

        if ($request->query('export') === 'pdf') {
            $pdf = Pdf::loadView('reports.services_report', compact('services', 'startDate', 'endDate'));

            return $pdf->download('laporan_jasa_servis_'.date('Ymd').'.pdf');
        }

        return response()->json([
            'success' => true,
            'summary' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_jasa_terjual' => $services->count(),
                'total_pendapatan_jasa' => $services->sum('biaya_jasa'),
            ],
            'data' => $services,
        ]);
    }

    public function sparePartSales(Request $request)
    {
        [$startDate, $endDate] = $this->parseDateRange($request);

        $sales = TransactionSparePart::with(['transaction', 'sparePart'])
            ->whereHas('transaction', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
            })
            ->get();

        if ($request->query('export') === 'pdf') {
            $pdf = Pdf::loadView('reports.spare_part_sales_report', compact('sales', 'startDate', 'endDate'));

            return $pdf->download('laporan_penjualan_suku_cadang_'.date('Ymd').'.pdf');
        }

        return response()->json([
            'success' => true,
            'summary' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_item_terjual' => $sales->sum('jumlah'),
                'total_nilai_terjual' => $sales->sum('total_harga'),
            ],
            'data' => $sales,
        ]);
    }

    public function stockStatus(Request $request)
    {
        $query = SparePartStock::with('sparePart');

        if ($request->query('filter') === 'minimum') {
            $query->whereColumn('stok_sekarang', '<=', 'stok_minimum');
        }

        $stocks = $query->get();

        if ($request->query('export') === 'pdf') {
            $pdf = Pdf::loadView('reports.stock_report', compact('stocks'));

            return $pdf->download('laporan_status_stok_'.date('Ymd').'.pdf');
        }

        return response()->json([
            'success' => true,
            'data' => $stocks,
        ]);
    }
}

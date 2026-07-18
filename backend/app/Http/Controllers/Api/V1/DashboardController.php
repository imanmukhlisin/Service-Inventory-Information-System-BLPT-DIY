<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Mechanic;
use App\Models\SparePart;
use App\Models\SparePartStock;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get aggregated statistics for the Admin Dashboard.
     */
    public function adminStats(Request $request)
    {
        try {
            $usersTotal = User::count();
            $mechanicsTotal = Mechanic::count();
            $sparePartsTotal = SparePart::count();
            // Count where current stock is less than or equal to minimum threshold
            $lowStockCount = SparePartStock::whereColumn('stok_sekarang', '<=', 'minimum_stok')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'users_total' => $usersTotal,
                    'mechanics_total' => $mechanicsTotal,
                    'spare_parts_total' => $sparePartsTotal,
                    'low_stock_count' => $lowStockCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

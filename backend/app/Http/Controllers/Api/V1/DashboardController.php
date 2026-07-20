<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Mechanic;
use App\Models\SparePart;
use App\Models\SparePartStock;
use App\Models\Transaction;
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
            $lowStockCount = SparePartStock::whereColumn('stok_sekarang', '<=', 'stok_minimum')->count();

            // Fetch a unified activity log from recent users and transactions
            $activities = collect();

            $recentUsers = User::latest()->take(3)->get()->map(function ($u) {
                return [
                    'time' => $u->created_at->format('H:i'),
                    'activity' => 'Menambahkan pengguna: ' . $u->nama_user,
                    'user' => 'Admin',
                    'timestamp' => $u->created_at->timestamp
                ];
            });

            $recentTransactions = Transaction::latest()->take(3)->with('user')->get()->map(function ($t) {
                return [
                    'time' => $t->created_at->format('H:i'),
                    'activity' => 'Transaksi baru: ' . $t->no_transaksi,
                    'user' => $t->user ? $t->user->nama_user : 'Front Office',
                    'timestamp' => $t->created_at->timestamp
                ];
            });

            $activities = $activities->concat($recentUsers)->concat($recentTransactions)
                ->sortByDesc('timestamp')
                ->take(4)
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'users_total' => $usersTotal,
                    'mechanics_total' => $mechanicsTotal,
                    'spare_parts_total' => $sparePartsTotal,
                    'low_stock_count' => $lowStockCount,
                    'recent_activities' => $activities
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

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Mechanic;
use App\Models\SparePart;
use App\Models\SparePartStock;
use App\Models\Transaction;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    /**
     * Get hourly login activity for the admin dashboard chart.
     */
    public function loginActivity(Request $request)
    {
        try {
            $hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
            $result = [];

            // Try to get today's login activity
            $todayLogs = LoginLog::whereDate('logged_in_at', today())->get();

            // If no activity today, show all historical data
            $logs = $todayLogs->count() > 0 ? $todayLogs : LoginLog::all();

            $hourCounts = array_fill_keys($hours, 0);

            foreach ($logs as $log) {
                $hour = $log->logged_in_at->format('H') . ':00';
                if (isset($hourCounts[$hour])) {
                    $hourCounts[$hour]++;
                }
            }

            foreach ($hours as $h) {
                $result[] = [
                    'name' => $h,
                    'aktivitas' => $hourCounts[$h],
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'period' => $todayLogs->count() > 0 ? 'today' : 'all_time',
                'total_logins' => $logs->count(),
            ]);
        } catch (\Exception $e) {
            // If table doesn't exist yet, return empty data gracefully
            $hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
            $result = array_map(fn($h) => ['name' => $h, 'aktivitas' => 0], $hours);
            return response()->json([
                'success' => true,
                'data' => $result,
                'period' => 'empty',
                'total_logins' => 0,
            ]);
        }
    }
}

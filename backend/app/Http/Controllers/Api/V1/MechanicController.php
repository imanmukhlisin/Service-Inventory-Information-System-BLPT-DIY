<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Mechanic;
use Illuminate\Http\Request;

class MechanicController extends Controller
{
    public function index()
    {
        $mechanics = Mechanic::paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $mechanics->items(),
            'meta' => [
                'current_page' => $mechanics->currentPage(),
                'per_page' => $mechanics->perPage(),
                'total' => $mechanics->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mekanik' => 'required|string|max:150',
        ]);

        $mechanic = Mechanic::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Mekanik berhasil dibuat',
            'data' => $mechanic,
        ], 201);
    }

    public function show(Mechanic $mechanic)
    {
        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $mechanic,
        ]);
    }

    public function update(Request $request, Mechanic $mechanic)
    {
        $validated = $request->validate([
            'nama_mekanik' => 'required|string|max:150',
        ]);

        $mechanic->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Mekanik berhasil diperbarui',
            'data' => $mechanic,
        ]);
    }

    public function destroy(Mechanic $mechanic)
    {
        // Safe delete validation can be added here or rely on restrict DB error
        $mechanic->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mekanik berhasil dihapus',
        ]);
    }
}

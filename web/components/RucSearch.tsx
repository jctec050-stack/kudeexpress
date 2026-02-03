"use client";

import { useState } from 'react';

interface Contribuyente {
    doc: number;
    razonSocial: string;
    dv: number;
    ruc: string;
    estado: string;
    esPersonaJuridica: boolean;
    esEntidadPublica: boolean;
}

export default function RucSearch() {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState<Contribuyente | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/ruc?ruc=${search}`);
            const data = await res.json();

            if (res.ok && data.data) {
                setResult(data.data);
            } else {
                setError(data.message || 'No se encontraron datos para este RUC.');
                setResult(null); // Asegurar que se limpie si falla
            }
        } catch (err) {
            setError('Error de conexión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">Consulta de RUC</h3>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ingrese RUC o CI (ej: 80000001)"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? '...' : 'Buscar'}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fade-in">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Razón Social</span>
                            <span className="font-bold text-gray-900 text-right">{result.razonSocial}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">RUC</span>
                            <span className="font-mono font-bold text-gray-900">{result.ruc}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Estado</span>
                            <span className={`font-bold px-2 py-0.5 rounded text-xs ${result.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {result.estado}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

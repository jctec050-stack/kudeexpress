"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceData } from '@/types/factura';
import InvoiceDisplay from '@/components/InvoiceDisplay';

export default function InvoiceViewer() {
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const idParam = searchParams.get('id');

    if (idParam || dataParam) {
      setLoading(true);

      if (idParam) {
        fetch(`/api/invoices?id=${idParam}`)
          .then(res => {
            if (!res.ok) throw new Error("Factura no encontrada");
            return res.json();
          })
          .then(data => setInvoiceData(data))
          .catch(err => {
            console.error(err);
            setError("No se pudo cargar la factura. Puede que el enlace haya expirado.");
          })
          .finally(() => setLoading(false));
      } else if (dataParam) {
        try {
          const jsonString = decodeURIComponent(escape(window.atob(dataParam)));
          const parsedData = JSON.parse(jsonString);
          setInvoiceData(parsedData);
        } catch (e) {
          console.error("Error parsing invoice data:", e);
          try {
            const simpleParse = JSON.parse(atob(dataParam));
            setInvoiceData(simpleParse);
          } catch (e2) {
            setError("Error al procesar los datos de la factura.");
          }
        }
        setLoading(false);
      }
    }
  }, [searchParams]);

  // Si no hay datos ni estamos cargando, no renderizamos nada (para mostrar la landing page)
  if (!invoiceData && !loading && !error) return null;

  return (
    <section className="bg-gray-100 py-12 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:p-0">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {invoiceData && (
          <div className="flex flex-col lg:flex-row gap-8 print:block">
            {/* Main Invoice Area */}
            <div className="flex-grow print:w-full">
              <div className="mb-6 flex justify-between items-center print:hidden">
                <h2 className="text-2xl font-bold text-gray-800">Tu Factura Electrónica</h2>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow-md"
                >
                  <span>🖨️</span> Imprimir / Descargar PDF
                </button>
              </div>

              <InvoiceDisplay data={invoiceData} />
            </div>

            {/* Sidebar Marketing (Ads) - Hidden on print */}
            <div className="lg:w-80 flex-shrink-0 space-y-6 print:hidden">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center h-64">
                <p className="text-gray-400 font-semibold text-center">Panel para publicidad</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

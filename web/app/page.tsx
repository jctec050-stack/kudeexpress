"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceData } from '@/types/factura';
import InvoiceDisplay from '@/components/InvoiceDisplay';
import RucSearch from '@/components/RucSearch';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar - Hidden on print */}
      <nav className="border-b border-gray-200 print:hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-40 items-center">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="KuDE Express Logo"
                  width={400}
                  height={160}
                  className="h-36 w-auto object-contain bg-transparent cursor-pointer"
                  priority
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Características</a>
              <Link href="/como-funciona" className="text-gray-600 hover:text-blue-600 transition">Cómo funciona</Link>
              <Link href="/contactos" className="text-gray-600 hover:text-blue-600 transition">Contacto</Link>
              <Link
                href="https://ekuatia.set.gov.py/consultas"
                target="_blank"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Nueva Consulta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Invoice Viewer Mode */}
      {(invoiceData || loading || error) && (
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
      )}

      {/* Standard Landing Page Content (Hero) - Only show if NO invoice is present to avoid clutter, or keep it below? */}
      {/* Let's keep it below but maybe simpler header if invoice is present */}
      {!invoiceData && !loading && (
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🚀 Nueva Versión 1.0 Disponible
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Visualiza tus facturas de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                e-Kuatia al instante
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Una extensión de navegador que transforma la experiencia de consultar facturas electrónicas en el portal de la SET. Rápido, limpio y profesional.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Descargar Extensión
              </button>

            </div>
          </div>

          {/* Background Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        </section>
      )}

      {/* RUC Search Section (New) */}
      {!invoiceData && (
        <section className="py-12 bg-white print:hidden border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RucSearch />
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Por qué usar KuDE Express?</h2>
            <p className="text-gray-600">Diseñado para contadores y administrativos que valoran su tiempo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="Integración Directa"
              desc="Se inyecta directamente en el portal e-Kuatia. Sin copiar y pegar enlaces o XMLs."
            />
            <FeatureCard
              icon="📄"
              title="Formato A4 Limpio"
              desc="Genera una vista previa perfecta para imprimir o guardar como PDF, eliminando el desorden visual."
            />
            <FeatureCard
              icon="🔒"
              title="100% Privado"
              desc="Tus datos no se guardan en nuestros servidores. Todo el procesamiento ocurre en tu navegador."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">
            © 2026 KuDE Express. Derechos reservados. Creado por{' '}
            <a
              href="https://nexabyte-portafolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Nexabyte
            </a>
          </p>
          <div className="flex gap-6">
            <Link href="/contactos" className="text-gray-400 hover:text-gray-600">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from 'react';
import RucSearch from '@/components/RucSearch';
import InvoiceViewer from '@/components/InvoiceViewer';

function LandingContent() {
  return (
    <>
      {/* Standard Landing Page Content (Hero) */}
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

      {/* RUC Search Section */}
      <section className="py-12 bg-white print:hidden border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RucSearch />
        </div>
      </section>

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
    </>
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

// Wrapper para manejar la lógica de mostrar Landing o Invoice
function MainContentWrapper() {
  // Nota: Esto es un truco visual. InvoiceViewer usa useSearchParams.
  // Si hay params, renderizará la factura. Si no, renderizará null.
  // Pero necesitamos ocultar la landing si hay factura.
  // La mejor forma limpia en Next 13+ client side es manejar estado global o condicional simple.
  
  // Para simplificar y evitar hydration mismatch, InvoiceViewer se encarga de su renderizado.
  // Y aquí usaremos CSS o lógica simple para ocultar el landing si InvoiceViewer está activo.
  // Pero como InvoiceViewer es hijo, no puede decirle al padre que se oculte fácilmente sin contexto.
  
  // Vamos a usar un enfoque más simple:
  // InvoiceViewer siempre se renderiza. Si tiene datos, ocupa toda la pantalla (overlay) o desplaza el contenido.
  // O mejor: Movemos la logica de "Si hay factura, no mostrar landing" dentro de un componente cliente unificado
  // que use useSearchParams.
  
  return (
    <>
       {/* El visor de facturas se mostrará si hay parámetros en la URL */}
       <InvoiceViewer />
       
       {/* El contenido de la landing page.
           NOTA: Idealmente deberíamos ocultarlo si hay factura.
           Como InvoiceViewer es Client Component, podemos hacer que LandingContent también
           verifique useSearchParams para ocultarse.
       */}
       <LandingToggle />
    </>
  );
}

import { useSearchParams } from 'next/navigation';

function LandingToggle() {
  const searchParams = useSearchParams();
  const hasInvoice = searchParams.has('data') || searchParams.has('id');
  
  if (hasInvoice) return null;
  
  return <LandingContent />;
}

export default function Home() {
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

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
        <MainContentWrapper />
      </Suspense>

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

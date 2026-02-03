import Link from "next/link";

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <nav className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
                            ← Volver al Inicio
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                        Cómo funciona KuDE Express
                    </h1>
                    <p className="text-xl text-gray-600">
                        Aprende a sacar el máximo provecho de nuestra herramienta en menos de 2 minutos.
                    </p>
                </div>

                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
                    {/* Placeholder for Video */}
                    <div className="absolute inset-0 flex items-center justify-center text-white flex-col">
                        <svg
                            className="w-20 h-20 mb-4 opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold text-lg">Video Demostrativo</p>
                        <p className="text-sm text-gray-400 mt-2">Próximamente disponible</p>
                    </div>
                    {/* 
            To embed a YouTube video, replace the above div with:
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          */}
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    <Step
                        number="1"
                        title="Instala la Extensión"
                        description="Descarga e instala nuestra extensión desde la tienda de Chrome."
                    />
                    <Step
                        number="2"
                        title="Ingresa a e-Kuatia"
                        description="Navega al portal de la SET y busca tus facturas como siempre."
                    />
                    <Step
                        number="3"
                        title="Visualiza al Instante"
                        description="Haz clic en el icono de KuDE y verás tu factura en formato limpio."
                    />
                </div>
            </main>
        </div>
    );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {number}
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

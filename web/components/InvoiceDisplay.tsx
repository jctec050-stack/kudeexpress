import React from 'react';
import { InvoiceData, InvoiceItem } from '@/types/factura';

interface InvoiceDisplayProps {
    data: InvoiceData;
}

export default function InvoiceDisplay({ data }: InvoiceDisplayProps) {
    // Cálculos de Totales Locales
    const items = data.items || [];

    // Función auxiliar para parsear números
    const parseNum = (str: string | number | undefined) => {
        if (!str) return 0;
        if (typeof str === 'number') return str;
        const clean = str.toString().replace(/\./g, '').replace(',', '.');
        const val = parseFloat(clean);
        return isNaN(val) ? 0 : val;
    };

    // Función formateadora inversa
    const formatNum = (num: number) => num.toLocaleString('es-PY');

    const subtotalExenta = items.reduce((acc: number, item: InvoiceItem) => acc + parseNum(item.exenta), 0);
    const subtotal5 = items.reduce((acc: number, item: InvoiceItem) => acc + parseNum(item.iva5), 0);
    const subtotal10 = items.reduce((acc: number, item: InvoiceItem) => acc + parseNum(item.iva10), 0);

    // Total General
    const totalGeneral = subtotalExenta + subtotal5 + subtotal10;

    // Calculo de IVA
    const totalIva5 = Math.round(subtotal5 / 21);
    const totalIva10 = Math.round(subtotal10 / 11);
    const totalIva = totalIva5 + totalIva10;

    return (
        <div className="bg-white text-black p-8 shadow-2xl relative flex flex-col w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:w-full print:m-0 print:p-4 print-full-width print:min-h-0 print:h-auto">
            {/* Header KUDE */}
            <div className="border-t-2 border-b-2 border-gray-400 py-2 mb-4">
                <h1 className="text-center text-2xl font-normal text-gray-700 uppercase tracking-widest">
                    KUDE {data.tipo || "Factura Electrónica"}
                </h1>
            </div>

            {/* Sección Superior: Dos Columnas */}
            <div className="grid grid-cols-2 gap-4 mb-2">
                {/* Columna Izquierda: Datos Factura */}
                <div className="border border-gray-400 p-2 text-xs space-y-1">
                    <h3 className="font-bold underline mb-1">Datos del documento</h3>
                    <div className="flex"><span className="w-32 font-bold">Fecha Inicio Vigencia:</span> <span>-</span></div>
                    <div className="flex"><span className="w-32 font-bold">Timbrado Nro:</span> <span>{data.timbrado || "---"}</span></div>
                    <div className="flex"><span className="w-32 font-bold">Tipo Documento:</span> <span>{data.tipo || "Factura Electrónica"}</span></div>
                    <div className="flex"><span className="w-32 font-bold">Nro Documento:</span> <span>{data.numero || "---"}</span></div>
                </div>

                {/* Columna Derecha: Datos Empresa */}
                <div className="border border-gray-400 p-2 text-xs space-y-1">
                    <h3 className="font-bold underline mb-1">Datos de la empresa</h3>
                    <div className="font-bold text-sm uppercase">{data.emisor}</div>
                    <div className="flex"><span className="font-bold mr-2">RUC:</span> <span>{data.ruc}</span></div>
                    <div className="flex"><span className="font-bold mr-2">Dirección:</span> <span className="break-all">{data.direccion_emisor || "---"}</span></div>
                    <div className="flex"><span className="font-bold mr-2">Teléfono:</span> <span>{data.telefono_emisor || "---"}</span></div>
                    <div className="flex"><span className="font-bold mr-2">Correo:</span> <span className="break-all">{data.correo_emisor || "---"}</span></div>
                </div>
            </div>

            {/* Sección Medio: Receptor */}
            <div className="border border-gray-400 p-2 text-xs space-y-1 mb-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex"><span className="w-32 font-bold flex-shrink-0">Fecha Emisión:</span> <span>{data.fecha}</span></div>
                        <div className="flex"><span className="w-32 font-bold flex-shrink-0">Condición:</span> <span>{data.condicion}</span></div>
                        <div className="flex"><span className="w-32 font-bold flex-shrink-0">RUC:</span> <span>{data.ruc_receptor}</span></div>
                        <div className="flex"><span className="w-32 font-bold flex-shrink-0">Nombre/Razón:</span> <span className="uppercase">{data.receptor}</span></div>
                    </div>
                    <div>
                        <div className="flex"><span className="w-24 font-bold flex-shrink-0">Dirección:</span> <span className="break-all">{data.direccion_receptor || "---"}</span></div>
                        <div className="flex"><span className="w-24 font-bold flex-shrink-0">Teléfono:</span> <span>{data.telefono_receptor || "---"}</span></div>
                        <div className="flex"><span className="w-24 font-bold flex-shrink-0">Correo:</span> <span className="break-all">{data.correo_receptor || "---"}</span></div>
                    </div>
                </div>
            </div>

            {/* Tabla de Items */}
            <div className="flex-grow">
                <table className="w-full border-collapse border border-gray-400 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-1 text-left w-16">Código</th>
                            <th className="border border-gray-400 p-1 text-center w-16">Cantidad</th>
                            <th className="border border-gray-400 p-1 text-left">Descripción</th>
                            <th className="border border-gray-400 p-1 text-right w-24">Pre Unidad</th>
                            <th className="border border-gray-400 p-1 text-right w-20">Exentas</th>
                            <th className="border border-gray-400 p-1 text-right w-20">5%</th>
                            <th className="border border-gray-400 p-1 text-right w-20">10%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Items Reales */}
                        {(data.items && data.items.length > 0 ? data.items : [1, 2, 3]).map((item: InvoiceItem | number, i: number) => {
                            const isPlaceholder = typeof item === 'number';
                            const realItem = !isPlaceholder ? (item as InvoiceItem) : null;
                            return (
                                <tr key={i} className="h-6">
                                    <td className="border-l border-r border-gray-400 px-1 text-center">{realItem ? realItem.codigo : ""}</td>
                                    <td className="border-l border-r border-gray-400 px-1 text-center">{realItem ? realItem.cantidad : ""}</td>
                                    <td className="border-l border-r border-gray-400 px-2 text-left truncate max-w-[200px]">
                                        {realItem ? realItem.descripcion : (i === 0 ? "(Sin productos detectados)" : "")}
                                    </td>
                                    <td className="border-l border-r border-gray-400 px-1 text-right">{realItem ? realItem.precio : ""}</td>
                                    <td className="border-l border-r border-gray-400 px-1 text-right">{realItem ? realItem.exenta : ""}</td>
                                    <td className="border-l border-r border-gray-400 px-1 text-right">{realItem ? realItem.iva5 : ""}</td>
                                    <td className="border-l border-r border-gray-400 px-1 text-right">{realItem ? realItem.iva10 : ""}</td>
                                </tr>
                            );
                        })}

                        {/* Relleno para mantener altura si hay pocos items */}
                        {(!data.items || data.items.length < 15) && (
                            <tr className="h-full"><td colSpan={7} className="border-t border-gray-400"></td></tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} className="border border-gray-400 p-1 text-left font-bold">TOTAL PARCIAL</td>
                            <td className="border border-gray-400 p-1 text-right">{formatNum(subtotalExenta)}</td>
                            <td className="border border-gray-400 p-1 text-right">{formatNum(subtotal5)}</td>
                            <td className="border border-gray-400 p-1 text-right">{formatNum(subtotal10)}</td>
                        </tr>
                        <tr>
                            <td colSpan={6} className="border border-gray-400 p-2 text-left font-bold">Total de la Factura</td>
                            <td className="border border-gray-400 p-2 text-right font-bold text-sm">
                                {formatNum(totalGeneral)} {data.moneda}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={1} className="border border-gray-400 p-1">TOTAL PARCIAL</td>
                            <td colSpan={2} className="border border-gray-400 p-1 text-center">5% {formatNum(totalIva5)}</td>
                            <td colSpan={2} className="border border-gray-400 p-1 text-center">10% {formatNum(totalIva10)}</td>
                            <td colSpan={2} className="border border-gray-400 p-1 text-right font-bold">Total IVA {formatNum(totalIva)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer: QR y CDC */}
            <div className="mt-2 border border-gray-400 p-2 flex gap-4 items-center break-inside-avoid">
                {/* QR Code Real genera el link a SIFEN */}
                <div className="w-24 h-24 flex-shrink-0">
                    {data.cdc ? (
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ekuatia.set.gov.py/consultas/qr?Id=${data.cdc}`}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-center">
                            Sin CDC
                        </div>
                    )}
                </div>

                <div className="text-[10px] space-y-2">
                    <p>Consulte la validez de esta Factura Electrónica con el número de CDC impreso abajo en <a href="https://ekuatia.set.gov.py/consultas" className="underline">https://ekuatia.set.gov.py/consultas</a></p>
                    <p className="font-mono text-xs font-bold break-all">CDC: {data.cdc}</p>
                    <p className="font-bold">ESTE ES UNA COPIA DEL DOCUMENTO ELECTRÓNICO (XML)</p>
                    <p>Información de interés para saber los datos de la factura.</p>
                </div>
            </div>
        </div>
    );
}

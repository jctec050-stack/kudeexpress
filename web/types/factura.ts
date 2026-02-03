export interface InvoiceItem {
  codigo: string;
  cantidad: string | number;
  descripcion: string;
  precio: string | number;
  exenta: string | number;
  iva5: string | number;
  iva10: string | number;
}

export interface InvoiceData {
  // Metadatos
  cdc: string;
  timbrado: string;
  numero: string;
  tipo: string;
  fecha: string;
  condicion: string;
  moneda: string;

  // Emisor
  emisor: string;
  ruc: string;
  direccion_emisor?: string;
  correo_emisor?: string;
  telefono_emisor?: string;

  // Receptor
  receptor: string;
  ruc_receptor: string;
  direccion_receptor?: string;
  telefono_receptor?: string;
  correo_receptor?: string;

  // Totales
  total: string | number;
  iva_total: string | number;

  // Detalle
  items: InvoiceItem[];
}

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializar cliente Supabase (usamos las mismas vars que en el cliente)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar mínimamente que haya datos
    if (!body || !body.items) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert([{ data: body }])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('data')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
  }

  return NextResponse.json(data.data);
}

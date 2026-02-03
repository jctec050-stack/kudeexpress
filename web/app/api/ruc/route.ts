import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ruc = searchParams.get('ruc');

  if (!ruc) {
    return NextResponse.json({ message: 'RUC requerido' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://turuc.com.py/api/contribuyente?ruc=${ruc}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KudeExpress/1.0'
      }
    });

    if (!response.ok) {
        return NextResponse.json({ message: 'Error al consultar TuRuc' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

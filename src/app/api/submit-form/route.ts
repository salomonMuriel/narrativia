import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, whatsapp } = body;

    // TODO: Add actual logic here (save to database, send email, etc.)
    console.log('Form submission:', { nombre, whatsapp });

    return NextResponse.json({
      success: true,
      message: 'Gracias por unirte al movimiento'
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function GET(request: Request) {
  try {
    // @ts-expect-error: Suppression de l'erreur liée à 'cookies'
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return new NextResponse(JSON.stringify({ error: "Refresh token non trouvé" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!REFRESH_SECRET || !JWT_SECRET) {
      throw new Error("Les clés secrètes pour JWT ne sont pas définies.");
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { email: string };

    const newToken = jwt.sign({ email: decoded.email }, JWT_SECRET, { expiresIn: '1h' });

    const response = new NextResponse(JSON.stringify({ message: "Token rafraîchi avec succès" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token :", error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return new NextResponse(JSON.stringify({ error: "Refresh token expiré" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
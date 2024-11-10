import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface UserPayload {
    id: string;
    email: string;
}

const JWT_SECRET = process.env.AUTH_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export function verifyAccessToken(token: string | undefined): UserPayload | null {
    try {
        return token ? (jwt.verify(token, JWT_SECRET) as UserPayload) : null;
    } catch  {
        return null;
    }
}
export function generateAccessToken(user: UserPayload): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  }
  
  // Rafraîchir le token d'accès
  export function refreshAccessToken(refreshToken: string): NextResponse | null {
    try {
      // Vérifier et décoder le refresh token
      const user = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;
  
      // Générer un nouveau token d'accès
      const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
  
      // Créer la réponse avec le nouveau token d'accès
      const response = new NextResponse(
        JSON.stringify({ email: user.email, message: 'Token régénéré avec succès' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      // Définir le cookie avec le nouveau token d'accès
      response.cookies.set('token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 heure
        sameSite: 'strict',
        path: '/',
      });
  
      return response;
    } catch (error) {
      // En cas d'erreur (token invalide ou expiré), renvoyer une erreur appropriée
      console.error("Erreur lors du rafraîchissement du token :", error);
      return new NextResponse(
        JSON.stringify({ error: "Token de rafraîchissement invalide ou expiré" }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
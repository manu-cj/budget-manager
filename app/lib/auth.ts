import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface UserPayload {
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

export function refreshAccessToken(refreshToken: string): NextResponse | null {
    try {
        const user = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;

        const newAccessToken = generateAccessToken({ email: user.email });

        const response = new NextResponse(JSON.stringify({ email: user.email, message: 'Token régénéré avec succès' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

        response.cookies.set('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600, // 1 heure
            sameSite: 'strict',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        return null;
    }
}

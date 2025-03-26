import { NextResponse } from 'next/server';
import { verifyAccessToken, refreshAccessToken } from './../../../lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const token = req.cookies.get('token')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    const user = verifyAccessToken(token);

    if (user) {
        
        
        return NextResponse.json({ email: user.email, username: user.username, message: `Bienvenue, ${user.username}!` });
    }

    if (refreshToken) {
        // Rafraîchir le token avec le refreshToken
        const refreshedResponse =  refreshAccessToken(refreshToken);

        if (refreshedResponse) {
            // Mettre à jour le cookie avec le nouveau token
            const response = NextResponse.json({ message: 'Token refreshed', token: refreshedResponse.newAccessToken });
            response.headers.set('Set-Cookie', `token=${refreshedResponse.newAccessToken}; HttpOnly; Secure; Max-Age=3600; SameSite=Strict; Path=/`);
            return response;
        }
    }

    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
}

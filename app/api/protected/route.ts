import { NextResponse } from 'next/server';
import { verifyAccessToken, refreshAccessToken } from '@/app/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const token = req.cookies.get('token')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    const user = verifyAccessToken(token);

    if (user) {
        return NextResponse.json({ email: user.email, message: `Bienvenue, ${user.email}!` });
    }

    if (refreshToken) {
        const refreshedResponse = refreshAccessToken(refreshToken);

        if (refreshedResponse) {
            return refreshedResponse;
        }
    }

    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
}

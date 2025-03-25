import { authenticateUser, getUserByEmail } from '../../../controllers/userController';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET;  // Assurez-vous que vous avez bien configuré les clés secrètes dans vos variables d'environnement
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(request: Request) {
    try {
        await connectTo
        const { email, password } = await request.json();
        const isAuthenticated = await authenticateUser(email, password);  // Appel à la fonction du contrôleur

        if (isAuthenticated) {
            if (!JWT_SECRET || !REFRESH_SECRET) {
                throw new Error("Les clés secrètes pour JWT ne sont pas définies.");
            }

            const user = await getUserByEmail(email);  // Récupération de l'utilisateur depuis MongoDB

            if (!user || !user.id) {
                throw new Error("Utilisateur introuvable.");
            }
            console.log("user : ", user);

            // Générer le token d'accès
            const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            // Générer le refresh token
            const refreshToken = jwt.sign({ id: user.id, email: user.email, username: user.username }, REFRESH_SECRET, { expiresIn: '14d' });

            const response = new NextResponse(JSON.stringify({ message: "Authentification réussie" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });

            // Configurer les cookies
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600, // 1 heure
                sameSite: 'strict',
                path: '/',
            });

            response.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 172800, // 2 jours
                sameSite: 'strict',
                path: '/',
            });

            return response;
        } else {
            return new NextResponse(JSON.stringify({ error: "Email ou mot de passe incorrect" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);
        return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

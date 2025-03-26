import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { changePasswordWithMail } from './../../../controllers/userController';
import { connectToDatabase } from './../../../lib/DbConnect';

const JWT_SECRET = process.env.FORGOT_PASSWORD_SECRET as string;

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { token, password, confirmPassword }: { token: string, password: string, confirmPassword: string } = await request.json();

        if (!token) {
            return NextResponse.json({ error: "Token manquant." }, { status: 400 });
        }

        if (!password || !confirmPassword) {
            return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Les mots de passe ne correspondent pas." }, { status: 400 });
        }

        if (!JWT_SECRET) {
            throw new Error("La clé secrète pour le mot de passe oublié n'est pas définie.");
        }

        // 🔹 Vérification du token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        } catch {
            return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 400 });
        }

        console.log("Email extrait du token :", decoded.email);

        await changePasswordWithMail(decoded.email, password);
        
        return NextResponse.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("Erreur dans le handler de réinitialisation du mot de passe :", error);
        return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }
}

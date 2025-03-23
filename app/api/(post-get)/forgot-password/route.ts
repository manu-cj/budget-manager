import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendMail } from "./../../../lib/sendMail";

const JWT_SECRET = process.env.FORGOT_PASSWORD_SECRET as string;

export async function POST(request: Request) {
    try {
        const { email }: { email: string } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        if (!JWT_SECRET) {
            throw new Error("La clé secrète pour le mot de passe oublié n'est pas définie.");
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "30min" });

        
        await sendMail(email, "Réinitialisation du mot de passe", `
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour procéder :</p>
            <p><a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}">Réinitialiser mon mot de passe</a></p>
            <p>Ce lien expirera dans 30 minutes.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            <p>Merci,</p>
            <p>L'équipe de support</p>
        `);

        return NextResponse.json({ message: "Email de réinitialisation envoyé." });
    } catch (error) {
        console.error("Error in forgot password handler:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}

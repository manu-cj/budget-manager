import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { changePassword, verifyPassword } from "./../../../controllers/userController";
import { sendMail } from "@/app/lib/sendMail";
const JWT_SECRET = process.env.AUTH_SECRET as string;


export async function PUT(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const { oldPassword, newPassword, confirmPassword } = data;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return new NextResponse(JSON.stringify({ error: "Veuillez fournir les données nécessaires" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = decoded.id;
    const isPasswordValid = await verifyPassword(userId, oldPassword);
    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ error: "Ancien mot de passe incorrect" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (newPassword !== confirmPassword) {
      return new NextResponse(JSON.stringify({ error: "Les nouveaux mots de passe ne correspondent pas" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await changePassword(userId, newPassword);
    await sendMail(
      decoded.email,
      "Modification du mot de passe",
      "Votre mot de passe a été modifié si vous n'êtes pas à l'origine de cette action, veuillez contacter le support."
    );

    return NextResponse.json({ message: "Mot de passe modifié avec succès." });

  } catch (error) {
    console.error('Erreur lors de la modification du mot de passe :', error);
    return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

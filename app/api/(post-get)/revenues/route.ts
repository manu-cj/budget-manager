import { NextResponse } from "next/server";
import { createRevenue, deleteRevenue, getRevenues } from "./../../../controllers/incomeController";
import jwt from "jsonwebtoken";
import { IRevenue } from "@/app/models/Revenue";

const JWT_SECRET = process.env.AUTH_SECRET as string;

export async function POST(request: Request) {
  try {
    // Récupérer le cookie du token
    const cookies = request.headers.get("cookie");
    const token = cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: `Token invalide ou expiré, ${error}` }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = decoded.id;
    const revenue: IRevenue = await request.json();
    await createRevenue(revenue, userId);
    console.log("Decoded JWT:", decoded);
    return NextResponse.json({
      message: `revenu créée avec succès. ${revenue}`,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Assurez-vous que votre clé secrète est définie dans les variables d'environnement

export async function GET(request: Request) {
  try {
    // Récupérer le cookie du token
    const cookies = request.headers.get("cookie");
    const token = cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: `Token invalide ou expiré, ${error}` }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = decoded.id;

    // Récupérer les dépenses pour l'utilisateur
    const income = await getRevenues(userId);

    return new NextResponse(JSON.stringify({ expense: income }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}



export async function DELETE(request: Request) {
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

    const transactionId = await request.json();
    const userId = decoded.id;
    
    // Call function to delete expense here
    await deleteRevenue(transactionId.transactionId, userId)

    return NextResponse.json({ message: `Revenue supprimé avec succès.` });

  } catch (error) {
    console.error('Erreur lors de la suppression du revenue :', error);
    return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


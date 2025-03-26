import { NextResponse } from 'next/server';
import { getExpensesByOffset  } from './../../../controllers/expenseController';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './../../../lib/DbConnect';

const JWT_SECRET = process.env.AUTH_SECRET as string;

export async function GET(request: Request) {
    try {
      await connectToDatabase();
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
        decoded = jwt.verify(token, JWT_SECRET) as {id: string, email: string };
      } catch (error) {
        return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const userId = decoded.id;
        // Récupérer les paramètres d'URL de la requête (limit et offset)
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '15', 10); // Valeur par défaut 15
        const offset = parseInt(url.searchParams.get('offset') || '0', 10); // Valeur par défaut 0

        // Appeler la fonction pour récupérer les dépenses avec pagination
        const expenses = await getExpensesByOffset(userId, limit, offset);
  
  
      return new NextResponse(JSON.stringify({expense: expenses}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses :', error);
      return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  
import { NextResponse } from 'next/server';
;
import { getBudget } from '@/app/controllers/budgetController';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET as string;

export async function GET(request: Request) {
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
        decoded = jwt.verify(token, JWT_SECRET) as {id: string, email: string };
      } catch (error) {
        return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const userId = decoded.id;
  
      // Récupérer le budget pour l'utilisateur
      
      const budget = await getBudget(userId);
      
      return new NextResponse(JSON.stringify({budget: budget}), {
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
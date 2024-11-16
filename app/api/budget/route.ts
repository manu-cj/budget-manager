import { NextResponse } from 'next/server';
;
import { getBudget, updateBudget } from '@/app/controllers/budgetController';
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

  export async function PATCH(request: Request) {
    try {
      // Récupérer le cookie contenant le token
      // Récupérer le cookie du token
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))
      ?.split('=')[1];
  
      if (!token) {
        return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
   
      // Vérifier et décoder le token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      } catch (error) {
        return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const userId = decoded.id;
  
      // Lire les données du corps de la requête
      const body = await request.json();
      const budget = body;
      console.log(budget);
      
      if (!budget) {
        return new NextResponse(JSON.stringify({ error: "Données manquantes pour la mise à jour" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Mettre à jour le budget
      const updatedBudget = await updateBudget(userId, budget);
  
      if (!updatedBudget) {
        return new NextResponse(JSON.stringify({ error: "Échec de la mise à jour du budget" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      return new NextResponse(JSON.stringify({ message: "Budget mis à jour avec succès", budget: updatedBudget }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du budget :', error);
      return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
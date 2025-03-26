import { NextResponse } from 'next/server';
import { getBudget, updateBudget } from '../../../controllers/budgetController';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './../../../lib/DbConnect';

const JWT_SECRET = process.env.AUTH_SECRET as string;

export async function GET(request: Request) {
    try {
      await connectToDatabase();
        // Extraire le cookie du token

        const cookies = request.headers.get('cookie');
        const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];
  
        if (!token) {
            return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let decoded;
        try {
            // Vérifier le token JWT
            decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userId = decoded.id;

        // Récupérer le budget depuis MongoDB
        const budget = await getBudget(userId);

        return new NextResponse(JSON.stringify({ budget: budget }), {
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
    await connectToDatabase();
      // Extraire le cookie du token
      const cookies = request.headers.get('cookie');
      const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

      if (!token) {
          return new NextResponse(JSON.stringify({ error: "Token manquant" }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
          });
      }

      let decoded;
      try {
          // Vérifier et décoder le token
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
      const budget = body;  // Assure-toi que ces champs sont envoyés dans la requête
      
      // 
      if (!budget ) {
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
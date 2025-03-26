import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IExpense }  from './../../../models/Expense'; // Assurez-vous que ce modèle existe
import { createExpense, deleteExpense, getExpenses } from './../../../controllers/expenseController'; // Si vous avez un service pour gérer les dépenses
import { connectToDatabase } from './../../../lib/DbConnect';

const JWT_SECRET = process.env.AUTH_SECRET as string; // Assurez-vous que la clé est dans vos variables d'environnement

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    // Récupérer le cookie du token
    const cookies = request.headers.get('cookie');
    const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

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

    const userId = decoded.id;  // On récupère l'id de l'utilisateur du token
    const expense: IExpense = await request.json();  // Récupérer la dépense envoyée dans le corps de la requête

    // Créer la dépense dans MongoDB
    // const newExpense = new Expense({
    //   id: expense.id,  // Si vous générez un ID de manière manuelle, sinon laissez Mongoose le gérer
    //   amount: expense.amount,
    //   description: expense.description,
    //   date: expense.date,
    //   user_id: userId,  // L'utilisateur actuel
    //   category_id: expense.category_id,
    // });

    // await newExpense.save();  // Sauvegarder dans la base de données MongoDB

    // console.log("Dépense créée:", newExpense);
    createExpense(expense, userId);

    return NextResponse.json({ message: `Dépense créée avec succès.` });

  } catch (error) {
    console.error('Erreur lors de la création de la dépense:', error);
    return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


  // Assurez-vous que votre clé secrète est définie dans les variables d'environnement

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
          console.log("error : " + error);
          
            return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userId = decoded.id;
  
      // Récupérer les dépenses pour l'utilisateur
        const expenses = await getExpenses(userId);
      return new NextResponse(JSON.stringify({ expense: expenses }), {
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
  export async function DELETE(request: Request) {
    try {
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
        decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
      } catch (error) {
        return new NextResponse(JSON.stringify({ error: `Token invalide ou expiré, ${error}` }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const data = await request.json();
      const userId = decoded.id;
  
      console.log("Transaction ID: " + data.transactionId);
      console.log("id :" + data.transactionId);
      
      // Supprimer la dépense de la base de données
      deleteExpense(data.transactionId, userId);
  
  
      return NextResponse.json({ message: `Dépense supprimée avec succès.` });
  
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense :', error);
      return new NextResponse(JSON.stringify({ error: "Erreur interne du serveur" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
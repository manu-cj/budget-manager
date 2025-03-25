// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "./../../../lib/DbConnect";
import User from "../../../models/Users";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();
        const newUser = new User(data);
        await newUser.save();
        return NextResponse.json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (error) {
        return NextResponse.json({ message: "Erreur", error }, { status: 500 });
    }
}

"use client";

import React, { useState } from 'react';
import Signup from '@/app/components/auth/Signup';
import Login from '@/app/components/auth/Login';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const toggleForm = () => {
        setIsLogin(!isLogin); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-4xl font-bold text-white mb-6">{isLogin ? "Se connecter" : "Créer un compte"}</h1>
            {isLogin ? <Login /> : <Signup />}
            <button
                onClick={toggleForm}
                className="mt-4 text-indigo-400 hover:underline"
            >
                {isLogin ? "Vous n'avez pas de compte ? Inscrivez-vous" : "Déjà inscrit ? Connectez-vous"}
            </button>
        </div>
    );
};

export default Auth;

"use client";

import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const toggleForm = () => {
        setIsLogin(!isLogin); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-primary-light text-center">
            {/* Titre */}
            <h1 className="text-4xl font-bold text-accent">
              {isLogin ? "Se connecter" : "Créer un compte"}
            </h1>
            
            {/* Formulaire */}
            {isLogin ? <Login /> : <Signup />}
            
            {/* Bouton de bascule */}
            <button
              onClick={toggleForm}
              className="text-accent hover:underline hover:text-accent-dark transition duration-200"
            >
              {isLogin
          ? "Vous n'avez pas de compte ? Inscrivez-vous"
          : "Déjà inscrit ? Connectez-vous"}
            </button>
          </div>
        </div>
      );
      
};

export default Auth;

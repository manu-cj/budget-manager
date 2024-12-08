import React, { useState } from 'react';
import axios from 'axios';


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth', {
                email,
                password
            });
            console.log("Connexion réussi :", response.data);
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la connection :", error);
        }
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="flex items-center justify-center bg-background">
          <div className="w-full max-w-md p-8 space-y-6 bg-primary-light">
            {/* Titre */}
            <h2 className="text-2xl font-bold text-center text-text-light">
              Login
            </h2>
      
            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-dark"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Entrez votre email"
                />
              </div>
      
              {/* Champ mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-secondary-dark"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Votre mot de passe"
                />
              </div>
      
              {/* Bouton */}
              <button
                type="submit"
                className="w-full px-4 py-2 text-text-light bg-accent rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );  
};

export default Login;
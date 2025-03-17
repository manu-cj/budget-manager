'use client';
import React, { useState } from 'react';
import { validateFormInput } from '@/app/lib/verifForm';
import api from '@/app/lib/api';

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setErrorMessage('Veuillez entrer une adresse email valide.');
            return;
        }
        console.log(validateFormInput(email));
        
        try {
            const response = await api.post('/api/forgot-password', { email });
            console.log('Réinitialisation du mot de passe :', response.data);
            setSuccessMessage('Un email de réinitialisation a été envoyé si l\'adresse est valide.');

        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error);
            setErrorMessage('Erreur lors de la réinitialisation du mot de passe.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-text-light">Réinitialiser le mot de passe</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email :</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-secondary-dark sm:text-sm text-gray-700"
            />
            <button type="submit" className="mt-4 w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                Envoyer
            </button>
            </form>
            {errorMessage && <p className="mt-4 text-orange-600">{errorMessage}</p>}
            {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
        </div>
    );
};

export default ResetPasswordPage;
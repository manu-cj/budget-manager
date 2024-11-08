import React, { useState } from 'react';
import { User } from '@/app/types/user';
import axios from 'axios';

type SignupUser = Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_active'> & {
    passwordRepeat: string; // Ajout du champ pour la répétition du mot de passe
};

const Signup: React.FC = () => {
    const [user, setUser] = useState<SignupUser>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        passwordRepeat: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(user);
        
        e.preventDefault();
        if (user.password !== user.passwordRepeat) {
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }
        
        try {
            const response = await axios.post('/api/users', {
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                },
                passwordRepeat: user.passwordRepeat
            });
            console.log("Compte créé avec succès :", response.data);
        } catch (error) {
            console.error("Erreur lors de la création du compte :", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-gray-800">
                <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={user.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Choose a username"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Create a password"
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordRepeat" className="block text-sm font-medium text-gray-300">Repeat Password</label>
                        <input
                            type="password"
                            id="passwordRepeat"
                            name="passwordRepeat"
                            value={user.passwordRepeat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Repeat your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

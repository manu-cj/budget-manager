"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from './../../lib/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState<string>(""); 
    const [confirmPassword, setConfirmPassword] = useState<string>(""); 
    const [showPassword, setShowPassword] = useState<boolean>(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const response = await api.post("/api/reset-password", {
                token,
                password,
                confirmPassword
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch {
            setError("Erreur lors de la réinitialisation du mot de passe");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center text-text-light">Réinitialiser le mot de passe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-accent focus:border-secondary-dark sm:text-sm text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-accent focus:border-secondary-dark sm:text-sm text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-accent rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                        Réinitialiser le mot de passe
                    </button>
                </form>
                    {error && <p className="mt-4 text-center text-green-500">{error}</p>}
                    {success && <p className="mt-4 text-center text-green-500">{success}</p>}
            </div>
        </div>
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}

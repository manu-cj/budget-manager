import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth", {
        email,
        password,
      });
      console.log("Connexion réussi :", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la connection :", error);
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary-light">
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-light"
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
          <div className="relative w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-light"
            >
              Mot de passe
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent pr-10"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-secondary-dark focus:outline-none"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <FaEye className="w-6 h-6 text-accent" />
                ) : (
                  <FaEyeSlash className="w-6 h-6 text-accent" />
                )}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full px-4 py-2  bg-accent rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
          >
            Login
          </button>
        </form>
        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-accent hover:underline">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

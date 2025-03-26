import React, { useState } from "react";
import { User } from "./../../types/user";
import axios from "axios";

type SignupUser = Omit<
  User,
  "id" | "created_at" | "updated_at" | "is_active"
> & {
  passwordRepeat: string;
};

const Signup: React.FC = () => {
  const [user, setUser] = useState<SignupUser>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (user.password !== user.passwordRepeat) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post("/api/users", {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          password: user.password,
        },
        passwordRepeat: user.passwordRepeat,
      });
      setSuccess("Compte créé avec succès !");
    } catch (error)  {
      setError(`Erreur lors de la création du compte : ${error}`);
    }
  };

  return (
    <div className="flex items-center justify-center bg-primary">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary-light">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-text-light"
              >
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Prénom"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-text-light"
              >
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Nom"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-light"
            >
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Choisissez un nom d'utilisateur"
              required
            />
          </div>
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
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-light"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="passwordRepeat"
              className="block text-sm font-medium text-text-light"
            >
              Répéter le mot de passe
            </label>
            <input
              type="password"
              id="passwordRepeat"
              name="passwordRepeat"
              value={user.passwordRepeat}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Répéter le mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-accent rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
          >
            Inscription
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

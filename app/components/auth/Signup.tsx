import React, { useState } from "react";
import { User } from "@/app/types/user";
import axios from "axios";

type SignupUser = Omit<
  User,
  "id" | "created_at" | "updated_at" | "is_active"
> & {
  passwordRepeat: string; // Ajout du champ pour la répétition du mot de passe
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
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
      const response = await axios.post("/api/users", {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          password: user.password,
        },
        passwordRepeat: user.passwordRepeat,
      });
      console.log("Compte créé avec succès :", response.data);
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-primary">
      <div className="w-full max-w-md p-8 space-y-6 bg-primary-light ">
        <h2 className="text-2xl font-bold text-center text-text-light">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prénom et nom */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-secondary-dark"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="First name"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-secondary-dark"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Last name"
              />
            </div>
          </div>
  
          {/* Nom d'utilisateur */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-secondary-dark"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Choose a username"
            />
          </div>
  
          {/* Email */}
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
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your email"
            />
          </div>
  
          {/* Mot de passe */}
          <div className="flex space-x-4">
            <div className="w-1/2">
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
                value={user.password}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Password"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="passwordRepeat"
                className="block text-sm font-medium text-secondary-dark"
              >
                Repeat Password
              </label>
              <input
                type="password"
                id="passwordRepeat"
                name="passwordRepeat"
                value={user.passwordRepeat}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-secondary-light border border-secondary-dark rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Repeat password"
              />
            </div>
          </div>
  
          {/* Bouton */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-text-light bg-accent rounded-lg hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );  
  
};

export default Signup;

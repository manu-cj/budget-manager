import { User } from './../types/user';

export const validateUser = (user: User, passwordRepeat: string): string | null => {
  if (!user.first_name || typeof user.first_name !== 'string') {
    return 'Le prénom est requis et doit être une chaîne de caractères.';
  }
  if (!user.last_name || typeof user.last_name !== 'string') {
    return 'Le nom est requis et doit être une chaîne de caractères.';
  }
  if (!user.username || typeof user.username !== 'string') {
    return 'Le nom d’utilisateur est requis et doit être une chaîne de caractères.';
  }
  if (!user.email || typeof user.email !== 'string' || !validateEmail(user.email)) {
    return 'L\'email est requis et doit être une adresse email valide.';
  }
  if (!user.password || typeof user.password !== 'string' || user.password.length < 6) {
    return 'Le mot de passe est requis et doit contenir au moins 6 caractères.';
  }
  if (user.password !== passwordRepeat) {
    return 'Les mots de passe ne correspondent pas.';
  }
  return null; 
};


const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
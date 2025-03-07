import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
    username: string;
}

const JWT_SECRET = process.env.AUTH_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export function verifyAccessToken(token: string | undefined): UserPayload | null {
    try {
        return token ? (jwt.verify(token, JWT_SECRET) as UserPayload) : null;
    } catch  {
        return null;
    }
}
export function generateAccessToken(user: UserPayload): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  }
  
  // Rafraîchir le token d'accès

  export function refreshAccessToken(refreshToken: string): { newAccessToken: string; email: string, username: string } | null {
    try {
      // Vérifier et décoder le refresh token
      const user = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;
      console.log(user);
      
      // Générer un nouveau token d'accès
      const newAccessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
  
      return { newAccessToken, email: user.email, username: user.username }; // Retourner juste le token et l'email
  
    } catch (error) {
      // En cas d'erreur (token invalide ou expiré), renvoyer une erreur appropriée
      console.error("Erreur lors du rafraîchissement du token :", error);
      return null;
    }
  }
  
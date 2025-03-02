import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true, // Nécessaire si les tokens sont stockés dans des cookies
});

// Rafraîchir le token si expiré
let isRefreshing = false;
let failedRequestsQueue: ((newToken: string | null) => void)[] = [];


api.interceptors.response.use(
  response => response, // Tout va bien ? On retourne la réponse normalement.
  async error => {
    const originalRequest = error.config;

    // Si erreur 401 et que ce n'était pas une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // On marque cette requête comme "déjà réessayée"

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axios.post("http://localhost:3000/api/refresh-token", {}, { withCredentials: true });
          localStorage.setItem("token", data.accessToken); // Stocker le nouveau token

          // Réessayer toutes les requêtes qui avaient échoué
          failedRequestsQueue.forEach(callback => callback(data.accessToken));
          failedRequestsQueue = [];
        } catch (refreshError) {
          console.error("Refresh token invalide, utilisateur déconnecté.");
          failedRequestsQueue.forEach(callback => callback(null));
          failedRequestsQueue = [];
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Attendre que le refresh soit terminé avant de renvoyer la requête
      return new Promise(resolve => {
        failedRequestsQueue.push((newToken: string | null) => {
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(originalRequest)); // On renvoie la requête avec le nouveau token
          } else {
            resolve(Promise.reject(error)); // Si pas de token, on rejette
          }
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;

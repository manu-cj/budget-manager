import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true, // Nécessaire si les tokens sont stockés dans des cookies
});

// Rafraîchissement du token si expiré
let isRefreshing = false;
let failedRequestsQueue: Array<Promise<any>> = [];

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
                    // Tenter de rafraîchir le token
                    const { data } = await axios.get("http://localhost:3000/api/protected", { withCredentials: true });

                    // Mise à jour des en-têtes avec le nouveau token pour toutes les requêtes échouées
                    api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

                    // Relancer toutes les requêtes échouées automatiquement
                    await Promise.all(failedRequestsQueue);

                    // Vider la file d'attente après avoir relancé toutes les requêtes échouées
                    failedRequestsQueue = [];
                } catch (refreshError) {
                    console.error("Refresh token invalide, utilisateur déconnecté.");
                    failedRequestsQueue = []; // Vider la file d'attente après échec du refresh
                    return Promise.reject(refreshError); // Propager l'erreur
                } finally {
                    isRefreshing = false;
                }
            }

            // Ajouter la requête échouée à la file d'attente et la relancer lorsque le refresh est terminé
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push(
                    api(originalRequest)
                        .then(resolve)
                        .catch(reject)
                );
            });
        }

        return Promise.reject(error); // Retourner l'erreur si ce n'est pas une erreur 401
    }
);

export default api;

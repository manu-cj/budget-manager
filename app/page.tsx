"use client";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable"; // Gestion des swipes
import { motion, AnimatePresence } from "framer-motion"; // Animation
import axios from "axios";
import Auth from "./components/auth/Auth";
import HomePage from "./components/home/HomePage";
import Budget from "./components/graphiques/Budget";
import GraphiquePage from "./components/graphiques/GraphiquePage";
import Header from "./components/shared/header";

export default function ProtectedPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; username: string; email: string }>({ id: "", username: "", email: "" });
  const [page, setPage] = useState<string>("home");
  const [direction, setDirection] = useState<number>(0); // Direction pour l'animation
  const [showCookieMessage, setShowCookieMessage] = useState<boolean>(true);

  const renderPage = (page: string) => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "transaction":
        return <Budget />;
      case "graphique":
        return <GraphiquePage />;
      default:
        return <h2>404</h2>;
    }
  };

  const handleSwipeRight = () => {
    setDirection(1); // Animation vers la droite
    if (page === "home") setPage("transaction");
    else if (page === "transaction") setPage("graphique");
    else if (page === "graphique") setPage("home");
    console.log("swipe right  + page : ", page);
    
  };

  const handleSwipeLeft = () => {
    setDirection(-1); // Animation vers la gauche
    if (page === "graphique") setPage("transaction");
    else if (page === "transaction") setPage("home");
    else if (page === "home") setPage("graphique");
    console.log("swipe left  + page : ", page);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    delta: 75, // Nombre de pixels pour déclencher le swipe

    trackTouch: true, // Suivre les mouvements du doigt
    trackMouse: false, // Suivre les mouvements de la souris
  });

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("/api/protected");

        if (response.status === 200) {
          setIsLogin(true);
          setUser(response.data);
          
        } else if (response.status === 401) {
          setError(response.data.error);
        } else {
          setError(response.data.error || "Erreur inconnue");
        }
      } catch (error) {
        setError(`Erreur lors de la requête, ${error}`);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);
  console.log(user);
  
  return (
    <>
    {user.id !== ""  && <Header user={user} />}
    
      {loading ? (
        <p className="text-text-muted text-center">Chargement...</p>
      ) : isLogin ? (
        <div
          {...swipeHandlers}
          className="flex flex-col items-center w-full  min-h-screen bg-background text-primary"
        >
          {/* Barre de navigation */}
            <div className="flex justify-center items-center w-full md:w-3/4 px-4">
            <ul className="flex flex-wrap justify-center space-x-2 md:space-x-4 bg-secondary rounded-lg shadow-md px-4 md:px-8 py-2">
              <li className="mb-2 md:mb-0">
              <h2
                onClick={() => setPage("transaction")}
                className={`cursor-pointer text-base md:text-lg font-semibold px-2 py-2 transition duration-200 ease-in-out 
                ${
                  page === "transaction"
                  ? "text-accent-dark font-bold border-b-2 border-accent"
                  : "text-text-muted hover:text-accent-dark"
                }`}
              >
                Transactions
              </h2>
              </li>
              <li className="mb-2 md:mb-0">
              <h1
                onClick={() => setPage("home")}
                className={`cursor-pointer text-base md:text-lg font-semibold px-2 py-2 transition duration-200 ease-in-out 
                ${
                  page === "home"
                  ? "text-accent-dark font-bold border-b-2 border-accent"
                  : "text-text-muted hover:text-accent-dark"
                }`}
              >
                Résumé
              </h1>
              </li>
              <li className="mb-2 md:mb-0">
              <h2
                onClick={() => setPage("graphique")}
                className={`cursor-pointer text-base md:text-lg font-semibold px-2 py-2 transition duration-200 ease-in-out 
                ${
                  page === "graphique"
                  ? "text-accent-dark font-bold border-b-2 border-accent"
                  : "text-text-muted hover:text-accent-dark"
                }`}
              >
                Graphique
              </h2>
              </li>
            </ul>
            </div>

          {/* Contenu avec animation */}
          <div className="relative flex-grow mt-8 overflow-y-scroll w-full">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                key={page} // Clé unique pour chaque page
                custom={direction}
                initial={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute w-full h-full"
                >
                {renderPage(page)}
              </motion.div>
            </AnimatePresence>
            {showCookieMessage && (
              <div className="w-full fixed bottom-0 left-0 right-0 p-4 bg-gray-800 text-white text-center">
                <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre utilisation des cookies.</p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => setShowCookieMessage(false)}
                >
                  J&apos;ai compris
                </button>
              </div>
            )}
          </div>


          {/* Affichage des erreurs */}
          {error && <p className="text-center text-danger mt-4">{error}</p>}
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}

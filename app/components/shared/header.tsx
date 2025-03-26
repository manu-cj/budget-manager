import { useState } from 'react';
import Profile from '../profile/Profile';
import api from './../../lib/api';

interface HeaderProps {
    user: {
        id: string;
        username: string;
        email: string;
    };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const logout = async () => {
        try {
            await api.get("/api/logout");
            
            window.location.reload();
            
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            
        }
    }

    return (
        <>
        <header className="bg-orange-400 p-4 flex justify-between items-center position-fixed top-0 left-0">
            <h1 className="text-white text-2xl m-0 font-bold">Lubu</h1>
            <nav className="flex items-center">
                <div className="relative">
                    <button 
                        className="text-white mr-4 focus:outline-none flex items-center"
                        onClick={toggleMenu}
                    >
                        <span className="mr-2">{user.username}</span>
                        <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg py-1 z-20">
                            <button className="w-full block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setShowProfile(true)}>
                                Profil
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={logout}>
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
        
            
            <Profile 
                show={showProfile} 
                handleClose={() => setShowProfile(false)} 
                user= {user}
            />
        
        </>
    );
};

export default Header;

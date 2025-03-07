import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
    username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-orange-400 p-4 flex justify-between items-center">
            <h1 className="text-white text-2xl m-0">Budget Manager</h1>
            <nav className="flex items-center">
                <div className="relative">
                    <button 
                        className="text-white mr-4 focus:outline-none flex items-center"
                        onClick={toggleMenu}
                    >
                        <span className="mr-2">{username}</span>
                        <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg py-1 z-20">
                            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Profil
                            </Link>
                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;

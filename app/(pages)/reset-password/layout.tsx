import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ResetPasswordLayoutProps {
    children: ReactNode;
}

const ResetPasswordLayout: React.FC<ResetPasswordLayoutProps> = ({ children }) => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-orange-500 text-white p-4">
                <Link href="/" className="text-white font-bold text-xl">
                    Lubu
                </Link>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; {currentYear} Lubu</p>
            </footer>
        </div>
    );
};

export default ResetPasswordLayout;
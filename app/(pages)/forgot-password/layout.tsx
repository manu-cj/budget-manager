import React, { ReactNode } from 'react';

interface ForgotPasswordLayoutProps {
    children: ReactNode;
}

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({ children }) => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-orange-500 text-white p-4">
                <h1 className="text-1xl font-bold">Forgot Password</h1>
            </header>
            <main className="flex-grow ">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; {currentYear} Lubu</p>
            </footer>
        </div>
    );
};

export default ForgotPasswordLayout;
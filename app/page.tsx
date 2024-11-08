'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshTokenPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  const refreshToken = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
      
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rafraîchissement du Token</h1>
      
      {status === 'loading' && (
        <p className="text-blue-500">Rafraîchissement en cours...</p>
      )}
      
      {status === 'success' && (
        <p className="text-green-500">{message}</p>
      )}
      
      {status === 'error' && (
        <p className="text-red-500">
          {message}. Vous allez être redirigé vers la page de connexion.
        </p>
      )}
      
      <button 
        onClick={refreshToken} 
        disabled={status === 'loading'}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Rafraîchir manuellement
      </button>
    </div>
  );
}
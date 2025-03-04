'use client';

import React from 'react';
import api from '@/app/lib/api';

const DeleteTransaction: React.FC<{ onClose: () => void; transactionId: string; route: string; title: string; price:string }> = ({ onClose, transactionId, route, title, price }) => {
    const handleDelete = async () => {
        try {
             await api.delete(`/api/${route}`, {
                data: { transactionId : transactionId },
                withCredentials: true,
              });
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la suppression de la dépense :", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-3/4  max-w-none overflow-y-auto relative flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Supprimer la dépense</h2>
            <p className="mb-4 text-gray-700">Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.</p>
            <div className="mb-4 p-4 border rounded-lg bg-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600">Montant: {price} €</p>
            </div>
            <div className="flex justify-end space-x-4 mt-auto">
                <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Annuler
                </button>
                <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Supprimer
                </button>
            </div>
            </div>
        </div>
        
    );
};

export default DeleteTransaction;

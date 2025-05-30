import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TransporterList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTransporters = async () => {
    try {
      const usersRes = await api.getUsersByRole('Transporter');
      setUsers(usersRes);
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporters();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Transporteurs</h2>

      {isLoading ? (
        <div className="text-center text-blue-600 font-semibold text-lg">Chargement...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow text-center">{error}</div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Aucun transporteur trouvé.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl px-6 py-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                  className="w-14 h-14 rounded-full"
                  alt="Avatar"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-400">Rôle : {user.role}</p>
                  <p className="text-sm mt-1">
                    Statut :
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                  title="Modifier"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
                  title="Supprimer"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransporterList;

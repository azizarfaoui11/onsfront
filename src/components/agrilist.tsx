import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AgriculteurList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAgriculteurs = async () => {
    try {
      const usersRes = await api.getUsersByRole('Farmer');
      setUsers(usersRes);
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    await api.updateUserById(selectedUser._id, selectedUser);
    setIsEditModalOpen(false);
    fetchAgriculteurs();
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    await api.deleteUserById(selectedUser._id);
    setIsDeleteModalOpen(false);
    fetchAgriculteurs();
  };

  useEffect(() => {
    fetchAgriculteurs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Agriculteurs</h2>

      {isLoading ? (
        <div className="text-center text-blue-600 font-semibold text-lg">Chargement...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow text-center">{error}</div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Aucun agriculteur trouvé.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl px-6 py-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.role)}&background=3B82F6&color=fff`}
                  className="w-14 h-14 rounded-full"
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
                  onClick={() => handleEdit(user._id)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                  title="Modifier"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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

      {/* Modal de modification */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Modifier l'agriculteur</h3>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleUpdateUser}
              >
                Sauvegarder
              </button>
              <button
                className="text-gray-500 hover:underline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Supprimer l'agriculteur</h3>
            <p className="mb-6 text-gray-600">
              Êtes-vous sûr de vouloir supprimer <strong>{selectedUser.name}</strong> ?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                onClick={handleConfirmDelete}
              >
                Supprimer
              </button>
              <button
                className="text-gray-500 hover:underline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriculteurList;

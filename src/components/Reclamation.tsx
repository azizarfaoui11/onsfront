import React, { useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface ReclamationFormProps {
  userId: string;
}

const ReclamationForm: React.FC<ReclamationFormProps> = ({ userId }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReclamation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createReclamation(
        // { description, user: userId }
      );
      toast.success('Réclamation envoyée 📩');
      setDescription('');
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar image en haut */}
      <header className="w-full h-40 overflow-hidden">
        <img
          src="/raclamm.png"
          alt="Navbar background"
          className="w-full h-full object-cover"
        />
      </header>

      {/* Ligne animée décalée en bas, fond blanc, texte rouge */}
      <div className="w-full bg-white py-4 mt-14">
        <p className="text-red-700 font-semibold text-center text-lg animate-pulse">
          Vos réclamations sont notre priorité
        </p>
      </div>

      {/* Zone formulaire centrée */}
      <main className="flex flex-grow items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 text-center">
            N’hésitez surtout pas à les faire ❗
          </h2>
          <form onSubmit={handleReclamation}>
            <textarea
              className="w-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-700"
              rows={6}
              placeholder="Décrivez votre problème..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-md transition disabled:opacity-50 w-full text-lg font-medium"
            >
              {loading ? 'Envoi...' : 'Soumettre'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReclamationForm;

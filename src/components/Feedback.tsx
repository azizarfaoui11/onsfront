import React, { useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface FeedbackFormProps {
  produitId: string;
  userId: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ produitId, userId }) => {
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createFeedback(
        //{
        //commentaire,
        //user: userId,
        //produit: produitId,
      //}
    );
      toast.success('Feedback envoyé ✅');
      setCommentaire('');
    } catch (error) {
      toast.error("Erreur lors de l'envoi du feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
  {/* Image de fond à gauche */}
  <div
    className="absolute inset-0 bg-no-repeat bg-left bg-contain pointer-events-none"
    style={{
      backgroundImage: "url('/feedback.jpg')",
      backgroundPosition: 'left center',
    }}
  ></div>

  {/* Formulaire légèrement décalé à droite */}
  <div className="relative z-10 w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl ml-40">
    <h2 className="text-2xl font-semibold text-blue-900 mb-4">
      Donner un avis 💬
    </h2>
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-900"
        rows={5}
        placeholder="Écrivez votre commentaire..."
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-900 hover:bg-blue-950 text-white px-6 py-3 rounded-md transition disabled:opacity-50 w-full"
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  </div>
</div>


  );
};

export default FeedbackForm;

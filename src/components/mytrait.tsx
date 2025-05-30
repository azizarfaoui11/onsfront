import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaShieldAlt } from 'react-icons/fa';

interface Traitement {
  _id: string;
  nomPesticide: string;
  quantitePesticide: string;
  waterUsage:string;
}

const FaShieldAltIcon = FaShieldAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const MyTraitements: React.FC = () => {
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
       .fetchMyTraitements(token)
      .then((data) => setTraitements(data))
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🌾 Mes Traitements
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : traitements.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune Traitements trouvée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {traitements.map((traitement) => (
            <div
              key={traitement._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg"
            >
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {traitement.nomPesticide}
              </h3>
              

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {traitement.quantitePesticide}
              </h3>

               <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {traitement.waterUsage}
              </h3>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTraitements;

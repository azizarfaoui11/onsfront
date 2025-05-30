import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FaShieldAlt } from 'react-icons/fa';

interface Culture {
  _id: string;
  nom:string;
   variete: {
      _id: string;
      name: string;
  };
  datePlantation: string;
  dateRecolte: string;
  typeIrrigation:string;
}

const FaShieldAltIcon = FaShieldAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const MyCultures: React.FC = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
       .fetchMyParcels(token)
      .then((data) => setCultures(data))
      .catch((err) => console.error('Erreur:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🌾 Mes Cultures
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : cultures.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune Culture trouvée.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cultures.map((culture) => (
            <div
              key={culture._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg"
            >
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {culture.nom}
              </h3>
              <p className="text-sm text-gray-700">
                <FaShieldAltIcon className="inline mr-2 text-green-600" />
                Date de Plantation : <strong>{culture.datePlantation}</strong>
              </p>

              <p className="text-sm text-gray-700">
                <FaShieldAltIcon className="inline mr-2 text-green-600" />
                Date de Recolte : <strong>{culture.dateRecolte}</strong>
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {culture.typeIrrigation}
              </h3>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {culture.variete?.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCultures;

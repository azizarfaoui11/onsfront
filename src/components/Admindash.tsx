import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  CubeIcon,
  MapIcon,
  GlobeAltIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const [lots, setLots] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsRes, parcelsRes, varietiesRes, envDataRes] = await Promise.all([
          api.getLots(),
          api.getParcels(),
          api.getVarieties(),
          api.getEnvironmentalData(),
        ]);

        setLots(lotsRes);
        setParcels(parcelsRes);
        setVarieties(varietiesRes);
        setEnvironmentalData(envDataRes);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Tableau de bord Admin
      </h2>

      {isLoading ? (
        <div className="text-center text-blue-600 font-medium animate-pulse">
          Chargement des données...
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md shadow mb-6 text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-14">

          {/* LOTS */}
          <section>
            <div className="flex items-center mb-4">
              <CubeIcon className="h-7 w-7 text-blue-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Lots</h3>
            </div>
            {lots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lots.map((lot) => (
                  <div key={lot.id} className="bg-white shadow rounded-lg p-4 border hover:shadow-lg transition">
                    <h4 className="text-lg font-bold text-gray-700 mb-2">{lot.name}</h4>
                    <p className="text-sm text-gray-600">Méthode : {lot.producerMethod}</p>
                    <p className="text-sm text-gray-600">Récolte : {formatDate(lot.harvestDate)}</p>
                    <p className="text-sm text-gray-600">Parcelle : {lot.parcel?.nom ?? 'N/A'}</p>
                    <p className="text-sm text-gray-600">Impact : {lot.environmentImpact?.nom ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun lot disponible.</p>
            )}
          </section>

          {/* PARCELLES */}
          <section>
            <div className="flex items-center mb-4">
              <MapIcon className="h-7 w-7 text-green-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Parcelles</h3>
            </div>
            {parcels.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Localisation</th>
                    <th className="px-4 py-3 text-left">Surface (ha)</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel) => (
                    <tr key={parcel._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{parcel.nom}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {parcel.parcelLocation ?? 'Non défini'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {parcel.area ?? 'Non défini'} ha
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Aucune parcelle trouvée.</p>
            )}
          </section>

          {/* VARIÉTÉS */}
          <section>
            <div className="flex items-center mb-4">
              <BeakerIcon className="h-7 w-7 text-emerald-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Variétés</h3>
            </div>
            {varieties.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {varieties.map((variety) => (
                  <li
                    key={variety._id}
                    className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
                  >
                    <span className="font-medium text-gray-800">{variety.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Aucune variété disponible.</p>
            )}
          </section>

          {/* DONNÉES ENVIRONNEMENTALES */}
          <section>
            <div className="flex items-center mb-4">
              <GlobeAltIcon className="h-7 w-7 text-indigo-600 mr-3" />
              <h3 className="text-3xl font-semibold text-gray-800">Données Environnementales</h3>
            </div>
            {environmentalData.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Eau (m³)</th>
                    <th className="px-4 py-3 text-left">Énergie (kWh)</th>
                    <th className="px-4 py-3 text-left">CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {environmentalData.map((env) => (
                    <tr key={env._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{env.waterUsage}</td>
                      <td className="px-4 py-3">{env.energy}</td>
                      <td className="px-4 py-3">{env.co2Emission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Aucune donnée environnementale disponible.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

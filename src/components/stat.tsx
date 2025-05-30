import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalLots: number;
  totalParcels: number;
  totalFarmers: number;
}

interface MonthlyStat {
  month: string;
  lots: number;
  parcels: number;
  farmers: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainRes, monthlyRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stat'),
          axios.get('http://localhost:5000/api/admin/lots-per-month'),
        ]);
        setStats(mainRes.data);
        setMonthlyStats(monthlyRes.data.stats);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) return <div className="text-center p-4">Chargement des statistiques...</div>;

  const lastMonth = monthlyStats[monthlyStats.length - 1]?.lots || 0;
  const prevMonth = monthlyStats[monthlyStats.length - 2]?.lots || 0;
  const variation = prevMonth ? parseFloat((((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1)) : 0;

  const cards = [
    {
      label: 'Lots créés,',
      value: stats.totalLots,
      color: 'from-indigo-500 to-indigo-700',
      icon: '📦',
    },
    {
      label: 'Parcelles actives,',
      value: stats.totalParcels,
      color: 'from-green-400 to-green-600',
      icon: '🌱',
    },
    {
      label: 'Agriculteurs inscrits,',
      value: stats.totalFarmers,
      color: 'from-yellow-400 to-yellow-600',
      icon: '👩‍🌾',
    },
  ];

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center">📊 Tableau de bord Administrateur</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${card.color} text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300`}
          >
            <div className="text-2xl font-semibold mb-1">#{index + 1}</div>
            <div className="text-5xl mb-2">{card.icon}</div>
            <h3 className="text-lg font-medium">{card.label}</h3>
            <p className="text-4xl font-bold mt-1">
              <CountUp end={card.value} duration={1.5} separator=" " />
            </p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          📈 Évolution mensuelle des entités
        </h3>

        {monthlyStats.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune donnée disponible.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lots" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="parcels" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="farmers" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        <p className="mt-6 text-sm text-gray-600 text-center">
          Tendance de création de lots :{' '}
          <span className={variation >= 0 ? 'text-green-600' : 'text-red-600'}>
            {variation >= 0 ? '+' : ''}
            {variation}%
          </span>{' '}
          par rapport au mois précédent.
        </p>
      </div>
    </div>
  );
};

export default AdminStats;

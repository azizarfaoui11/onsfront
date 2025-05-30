import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Farmer {
  nom: string;
  email: string;
}

interface Transporter {
  nom: string;
  email: string;
}

interface Seller {
  nom: string;
  email: string;
}

export interface CreateProduitData {
  libelle: string;
  quantite: number;
  parcel: string;
  qrCode: string;
  etat: string;
}

interface Order {
  _id: string;
  deliveryDate: string;
  farmer: Farmer;
  transporter?: Transporter;
  products: CreateProduitData[];
  status: string;
  seller: Seller;
}

const OrdersPageAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/order/mine');
        setOrders(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-400';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Commandes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">📅 Livraison</th>
              <th className="py-3 px-4 text-left">🚚 Transporteur</th>
              <th className="py-3 px-4 text-left">🛒 Produits</th>
              <th className="py-3 px-4 text-left">📍 Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                  Aucune commande pour le moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.transporter ? (
                      <>
                        <div className="font-medium text-gray-900">{order.transporter.nom}</div>
                        <div className="text-xs text-gray-500">{order.transporter.email}</div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <ul className="space-y-0.5">
                      {Array.isArray(order.products) &&
                        order.products.map((product, index) => (
                          <li key={index}>
                            <span className="font-semibold">{product.libelle}</span> – {product.quantite} unités
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPageAdmin;

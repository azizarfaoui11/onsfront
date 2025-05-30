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
  //user:User;
}

interface Order {
  _id: string;
  deliveryDate: string;
  farmer: Farmer;
  transporter?: Transporter;
  products: CreateProduitData[];
  status: string;
  seller:Seller;
}

const OrdersPageAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/order/all');
      setOrders(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Transit':
        return 'bg-blue-500';
      case 'Delivered':
        return 'bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  function acceptOrder(_id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📦 Commandes</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-5 text-left">📅 Livraison</th>
              <th className="py-3 px-5 text-left">👨‍🌾 Vendeur</th>
              <th className="py-3 px-5 text-left">🚚 Transporteur</th>
              <th className="py-3 px-5 text-left">🛒 Produits</th>
              <th className="py-3 px-5 text-left">📍 Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 px-5">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td className="py-3 px-5">{order.seller?.email || '—'}</td>
                <td className="py-3 px-5">{order.transporter?.email || '—'}</td>
                  <td className="py-3 px-5">
  <ul className="list-disc ml-4">
    {(order.products ?? []).map((product, index) => (
      <li key={index}>
        {product.libelle} (Quantité : {product.quantite}) 
      </li>
    ))}
  </ul>
</td>

                            <td className="py-3 px-5">{order.status}</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPageAdmin;

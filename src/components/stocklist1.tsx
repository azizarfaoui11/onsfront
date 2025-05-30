import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import StockFormModal from "./StockFormModal1";

import {
  Pencil,
  Trash2,
  PackageCheck,
  Thermometer,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StockCardList1 = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const data = await api.getStockZoneB();
    setStocks(data);
  };

  const handleEditClick = (stock: any) => {
    setEditingStock(stock);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStock) return;
    await api.updateStock(editingStock._id, editingStock);
    setEditModalOpen(false);
    fetchStocks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await api.deleteStock(id);
      fetchStocks();
    }
  };

  const handleAddStock = async () => {
    setAddModalOpen(false);
    await fetchStocks(); // refresh après ajout
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-center text-yellow-700 mb-8 drop-shadow">
        📦 Gestion des Stocks
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="🔍 Rechercher un stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 rounded-full border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition"
        >
          ➕ Ajouter un stock
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStocks.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">Aucun stock trouvé.</p>
        ) : (
          filteredStocks.map((stock) => (
            <motion.div
              key={stock._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 p-6 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-yellow-500" />
                {stock.nom}
              </h2>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Produit :</strong> {stock.produit?.libelle || <em className="text-red-400">Inconnu</em>}</p>
                <p><strong>Entrée :</strong> {formatDate(stock.dateEntree)}</p>
                <p><strong>Sortie :</strong> {stock.dateSortie ? formatDate(stock.dateSortie) : "Non définie"}</p>
                <p className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-yellow-400" />
                  <span>Température : {stock.temperature}°C</span>
                </p>
              </div>

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleEditClick(stock)}
                  className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 p-1 rounded-full"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">Modifier le stock</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editingStock?.nom}
                onChange={(e) =>
                  setEditingStock({ ...editingStock, nom: e.target.value })
                }
                placeholder="Nom du stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={editingStock?.temperature}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    temperature: parseFloat(e.target.value),
                  })
                }
                placeholder="Température"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                onClick={handleUpdate}
                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <StockFormModal
          onClose={() => setAddModalOpen(false)}
          onStockAdded={handleAddStock}
        />
      )}
    </div>
  );
};

export default StockCardList1;

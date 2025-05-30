
  import {
    HomeIcon,
    MapIcon,
    CubeIcon,
    BeakerIcon,
    ShoppingCartIcon,
    Cog6ToothIcon,
    GlobeAltIcon,
    ArrowLeftOnRectangleIcon 
  } from '@heroicons/react/24/outline'
  import React from 'react'
  import { useNavigate } from 'react-router-dom'
  
  interface SidebarProps {
    onLogout: () => void
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/stat', icon: HomeIcon },
    //{ name: 'Parcelles', href: '/parcelles', icon: MapIcon },
    { name: 'Tables', href: '/admindash', icon: CubeIcon },
    //{ name: 'Variétés', href: '/varieties', icon: BeakerIcon },
    { name: 'Commandes', href: '/orderlistadmin', icon: ShoppingCartIcon },
    //{ name: 'Données Environnementales', href: '/donnees-environnementales', icon: GlobeAltIcon },
    { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },

  ]

  
  const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const navigate = useNavigate()
  
    return (
      <div className="h-screen w-64 bg-gray-800 text-white flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-center h-16 text-xl font-bold border-b border-gray-700">
            🌱 TraceAgri
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-left rounded-lg hover:bg-red-600 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    )
  }
  
  export default Sidebar
  
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaWrench,
  FaTag,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaList,
  FaBox,
  FaShoppingBag,
  FaImage,
  FaVideo,
  FaWindowRestore, // icon for popup banners
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarAlt },
    { path: '/admin/services', label: 'Services', icon: FaWrench },
    { path: '/admin/brands', label: 'Brands', icon: FaTag },
    { path: '/admin/banners', label: 'Banners', icon: FaImage },
    { path: '/admin/videos', label: 'Videos', icon: FaVideo },
    { path: '/admin/popup-banners', label: 'Popup Banners', icon: FaWindowRestore }, // ✅ NEW
    { path: '/admin/categories', label: 'Product Categories', icon: FaList },
    { path: '/admin/products', label: 'Products', icon: FaBox },
    { path: '/admin/orders', label: 'Orders', icon: FaShoppingBag },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white z-40 transition-transform duration-300 flex flex-col lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-shrink-0">
          <div className="p-5 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">Spedy Service</h1>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs text-white/70">{user?.email || 'admin@homeappliance.com'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-white/20 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <FaHome size={18} />
              <span className="font-medium text-sm">Visit Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
            >
              <FaSignOutAlt size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaBars size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>

      <main className="lg:ml-64 min-h-screen">
        <div className="pt-14 lg:pt-0">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
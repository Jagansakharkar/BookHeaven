import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBook, 
  FaClipboardList, 
  FaBoxes, 
  FaUsers, 
  FaCog,
  FaSignOutAlt 
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth/authSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/');
  };

  const navItems = [
    { path: "/admin/dashboard/analytics", icon: <FaChartLine />, label: "Analytics" },
    { path: "/all-books", icon: <FaBook />, label: "All Books" },
    { path: "/admin/dashboard/orders", icon: <FaClipboardList />, label: "Orders" },
    { path: "/admin/dashboard/inventory", icon: <FaBoxes />, label: "Inventory" },
    { path: "/admin/dashboard/customers", icon: <FaUsers />, label: "Customers" },
    { path: "/admin/dashboard/settings", icon: <FaCog />, label: "Settings" }
  ];

  return (
    <div className='bg-zinc-800 text-white flex flex-col p-4 h-full w-full gap-1'>
      <div className="mb-8 px-2 py-4 border-b border-zinc-700">
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-zinc-400 text-sm">Management Console</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              hover:bg-blue-600/50 hover:text-white
              ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={`
          mt-auto flex items-center gap-3 px-4 py-3 rounded-lg
          text-red-400 hover:bg-red-600/20 hover:text-red-300
          transition-colors
        `}
      >
        <FaSignOutAlt className="text-lg" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
export default AdminSidebar
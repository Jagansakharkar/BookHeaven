import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { authActions } from '../../store/auth/authSlice';
import { IoMdNotifications } from "react-icons/io";
import { fetchAlertBooks } from '../../store/books/booksAlertThunks';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lowStockBooks = [], outofStockBooks = [] } = useSelector(state => state.bookAlert);
  const { isLoggedIn, role } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItemCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
  const alertCount = (lowStockBooks?.length || 0) + (outofStockBooks?.length || 0);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    navigate("/logIn");
    closeMobileMenu();
  };

  // Links configuration
  const guestLinks = [
    { title: "Home", link: "/" },
    { title: "Contact", link: "/contact" },
    { title: "All Books", link: "/all-books" },
  ];

  const userLinks = [
    ...guestLinks,
    {
      title: "Cart",
      link: "/cart",
      icon: (
        <div className='relative'>
          <FaShoppingCart className='h-6 w-6' />
          {cartItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>
              {cartItemCount}
            </span>
          )}
        </div>
      )
    },
    { title: "Profile", link: "/profile", icon: <FaUserCircle className='h-6 w-6' /> }
  ];

  const adminLinks = [
    { title: "All Books", link: "/all-books" },
    { title: "Dashboard", link: "/admin/dashboard" },
    {
      title: "Alerts",
      link: "/admin-notification",
      icon: (
        <div className='relative'>
          <IoMdNotifications className='h-6 w-6' />
          {alertCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>
              {alertCount}
            </span>
          )}
        </div>
      )
    }
  ];

  const Links = !isLoggedIn
    ? guestLinks
    : role === "user"
      ? userLinks
      : adminLinks;

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
                  alt="BookHeaven Logo"
                  className="h-8 w-8 transition-transform group-hover:rotate-12"
                />
                <span className="text-xl font-bold text-white">
                  <span className="text-blue-400">Book</span>Heaven
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {Links.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.link}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1
                    ${isActive ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`
                  }
                >
                  {/* {item.icon} */}
                  {item.icon || item.title}
                </NavLink>
              ))}

              {/* Auth Buttons */}
              <div className="ml-4 flex items-center space-x-2">
                {!isLoggedIn ? (
                  <>
                    <NavLink
                      to="/logIn"
                      className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-white hover:bg-blue-600/20 rounded-md transition-colors"
                    >
                      Log In
                    </NavLink>
                    <NavLink
                      to="/signUp"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Sign Up
                    </NavLink>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-1"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none"
                aria-expanded="false"
              >
                {mobileOpen ? (
                  <IoMdClose className="block h-6 w-6" />
                ) : (
                  <IoMdMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 w-64 z-50 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4 mb-8">
              <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
                  alt="BookHeaven Logo"
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-white">
                  <span className="text-blue-400">Book</span>Heaven
                </span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="text-zinc-400 hover:text-white"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-2 space-y-1">
              {Links.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  onClick={closeMobileMenu}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.title}
                </Link>
              ))}

              <div className="pt-4 border-t border-zinc-800 mt-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/logIn"
                      onClick={closeMobileMenu}
                      className="block px-3 py-3 text-sm font-medium rounded-md text-blue-400 hover:bg-blue-900/20"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signUp"
                      onClick={closeMobileMenu}
                      className="block px-3 py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-3 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity"
            onClick={closeMobileMenu}
          />
        )}
      </header>
    </>
  );
};
export default Header
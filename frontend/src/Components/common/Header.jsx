import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { FaCartShopping } from "react-icons/fa6";
import { authActions } from '../../store/auth/authSlice';
import { IoMdNotifications } from "react-icons/io";
import { fetchAlertBooks } from '../../store/books/booksAlertThunks'


export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { lowStockBooks, outofStockBooks } = useSelector(state => state.bookAlert)

  const { token, user, isLoggedIn, role } = useSelector(state => state.auth)
  const { cartItems } = useSelector(state => state.cart)

  const cartItemCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0)
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    navigate("/logIn");
  };

  // Links
  const guestLinks = [
    { title: "Home", link: "/" },
    { title: "Contact", link: "/contact" },
    { title: "All Books", link: "/all-books" },
  ];



  const userLinks = [
    ...guestLinks,
    {
      title:
        <div className='relative'>
          <FaCartShopping className='h-8 w-8' />
          {cartItemCount > 0 && (
            <span className='absolute -top-4 -right-4 bg-red-500 text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full'>
              {cartItemCount}
            </span>
          )}
        </div>,
      link: "/cart"
    }
    ,
    { title: "Profile", link: "/profile" },
  ];

  const adminLinks = [
    { title: "All Books", link: "/all-books" },
    { title: "Dashboard", link: "/admin/dashboard" },

  ];

  let Links = !isLoggedIn
    ? guestLinks
    : role === "user"
      ? userLinks
      : adminLinks;

  // const lowStockBooks = books.filter(book => book.stock > 0 && book.stock < 15)
  // const outofStockBooks = books.filter(book => book.stock === 0)


  return (
    <>
      {/* Top Navbar */}
      <nav className='sticky top-0 z-50 bg-zinc-800 text-white px-6 py-4 flex justify-between items-center shadow-md'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <img
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
            className='h-10 w-10'
          />
          <Link to="/" className='text-2xl font-bold text-white'>
            <span className="text-blue-400">Book</span>Heaven
          </Link>
        </div>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-6 text-lg'>
          {Links.map((item, i) => (
            <NavLink
              key={i}
              to={item.link}
              className='relative hover:text-blue-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-400 after:transition-all'
            >
              {item.title}
            </NavLink>
          ))}
          <div className="relative">
            {(lowStockBooks.length > 0 || outofStockBooks.length > 0) && (
              <span className="bg-red-800 -top-2 -right-2 absolute text-white rounded-full text-xs px-1">
                {lowStockBooks.length + outofStockBooks.length}
              </span>
            )}

            {role === "admin" && (
              <Link to="/admin-notification">
                <IoMdNotifications className="h-8 w-8 cursor-pointer" />
              </Link>
            )}
          </div>
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/logIn"
                className='px-3 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800'
              >
                LogIn
              </NavLink>
              <NavLink
                to="/signUp"
                className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-white hover:text-zinc-800'
              >
                SignUp
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className='md:hidden text-3xl text-white'
        >
          <IoMdMenu />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-zinc-900 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className='flex flex-col gap-6 p-6 text-xl font-semibold text-white'>
          {Links.map((item, i) => (
            <Link key={i} to={item.link} onClick={toggleMobileMenu}>
              {item.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <NavLink to="/logIn" onClick={toggleMobileMenu}>
                LogIn
              </NavLink>
              <NavLink to="/signUp" onClick={toggleMobileMenu}>
                SignUp
              </NavLink>
            </>
          ) : (
            <button onClick={() => { handleLogout(); toggleMobileMenu(); }}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Optional Background Blur */}
      {mobileOpen && (
        <div
          className='fixed top-0 left-0 w-full h-full z-30 bg-black bg-opacity-50'
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

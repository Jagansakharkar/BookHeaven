import './App.css'

import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, lazy } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const withDebug = (Component, name) => (props) => {
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    throw error;
  }
};

// Modify your lazy imports:
// const Login = lazy(() => import("../src/auth/Login").then(module => ({
//   default: withDebug(module.default, 'Login')
// })));
// Auth Pages
const Login = lazy(() => import("../src/auth/Login").then(module => ({
  default: withDebug(module.default, 'Login')
})));
const SignUp = lazy(() => import("../src/auth/SignUp").then(module => ({
  default: withDebug(module.default, 'SignUp')
})));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword').then(module => ({
  default: withDebug(module.default, 'ForgotPassword')
})));
const ResetPassword = lazy(() => import('./auth/ResetPassword').then(module => ({
  default: withDebug(module.default, 'ResetPassword')
})));

// Common Components
const Footer = lazy(() => import('./Components/common/Footer').then(module => ({
  default: withDebug(module.default, 'Footer')
})));
const Header = lazy(() => import('./Components/common/Header').then(module => ({
  default: withDebug(module.default, 'Header')
})));
const AddressConfirmation = lazy(() => import('./Components/User/AddressConfirmation').then(module => ({
  default: withDebug(module.default, 'AddressConfirmation')
})));

// User Pages
const Home = lazy(() => import('./Pages/User/Home').then(module => ({
  default: withDebug(module.default, 'Home')
})));
const AllBooks = lazy(() => import('./Pages/User/AllBooks').then(module => ({
  default: withDebug(module.default, 'AllBooks')
})));
const Cart = lazy(() => import('./Pages/User/Cart').then(module => ({
  default: withDebug(module.default, 'Cart')
})));
const Profile = lazy(() => import('./Pages/User/Profile').then(module => ({
  default: withDebug(module.default, 'Profile')
})));
const BookDetails = lazy(() => import('./Pages/User/BookDetails').then(module => ({
  default: withDebug(module.default, 'BookDetails')
})));
const Favourites = lazy(() => import('./Pages/User/Favourites').then(module => ({
  default: withDebug(module.default, 'Favourites')
})));
const UserOrderHistory = lazy(() => import('./Pages/User/UserOrderHistory').then(module => ({
  default: withDebug(module.default, 'UserOrderHistory')
})));
const Setting = lazy(() => import('./Pages/User/Setting').then(module => ({
  default: withDebug(module.default, 'Setting')
})));
const TrackOrder = lazy(() => import('./Pages/User/TrackOrder').then(module => ({
  default: withDebug(module.default, 'TrackOrder')
})));
const Contact = lazy(() => import('./Pages/User/Contact').then(module => ({
  default: withDebug(module.default, 'Contact')
})));
const PersonalInformation = lazy(() => import('./Pages/User/PersonalInformation').then(module => ({
  default: withDebug(module.default, 'PersonalInformation')
})));
const AddressContact = lazy(() => import('./Pages/User/AddressContact').then(module => ({
  default: withDebug(module.default, 'AddressContact')
})));
const Payment = lazy(() => import('./Pages/User/Payment').then(module => ({
  default: withDebug(module.default, 'Payment')
})));
const OrderSummary = lazy(() => import('./Pages/User/OrderSummary').then(module => ({
  default: withDebug(module.default, 'OrderSummary')
})));
const Notification = lazy(() => import('./Pages/User/Notification').then(module => ({
  default: withDebug(module.default, 'Notification')
})));
const AccountSecurity = lazy(() => import('./Pages/User/AccountSecurity').then(module => ({
  default: withDebug(module.default, 'AccountSecurity')
})));

// Admin Pages
const UpdateBook = lazy(() => import('./Pages/Admin/UpdateBook').then(module => ({
  default: withDebug(module.default, 'UpdateBook')
})));
const AddBook = lazy(() => import('./Pages/Admin/AddBook').then(module => ({
  default: withDebug(module.default, 'AddBook')
})));
const Dashboard = lazy(() => import('./Pages/Admin/Dashboard').then(module => ({
  default: withDebug(module.default, 'Dashboard')
})));
const Analytics = lazy(() => import('./Pages/Admin/Analytics').then(module => ({
  default: withDebug(module.default, 'Analytics')
})));
const Orders = lazy(() => import('./Pages/Admin/Orders').then(module => ({
  default: withDebug(module.default, 'Orders')
})));
const Customers = lazy(() => import('./Pages/Admin/Customers').then(module => ({
  default: withDebug(module.default, 'Customers')
})));
const Inventory = lazy(() => import('./Pages/Admin/Inventory').then(module => ({
  default: withDebug(module.default, 'Inventory')
})));
const Settings = lazy(() => import('./Pages/Admin/Settings').then(module => ({
  default: withDebug(module.default, 'Settings')
})));
const EditOrder = lazy(() => import('./Pages/Admin/EditOrder').then(module => ({
  default: withDebug(module.default, 'EditOrder')
})));
const EditBook = lazy(() => import('./Pages/Admin/EditBook').then(module => ({
  default: withDebug(module.default, 'EditBook')
})));
const EditCustomer = lazy(() => import('./Pages/Admin/EditCustomer').then(module => ({
  default: withDebug(module.default, 'EditCustomer')
})));
const AdminNotification = lazy(() => import('./Pages/Admin/AdminNotification').then(module => ({
  default: withDebug(module.default, 'AdminNotification')
})));
const AddCategory = lazy(() => import('./Pages/Admin/AddCategory').then(module => ({
  default: withDebug(module.default, 'AddCategory')
})));
import { ProtectedRoute } from './auth/ProtectedRoute'
import { fetchBooks } from './store/books/authBooks';
import { fetchCart } from './store/Cart/cartThunks';
import { fetchAlertBooks } from './store/books/booksAlertThunks';
import { fetchCategories } from './store/categories/categoryThunks';
import { getMe } from './store/auth/authThunks';
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    // if (token) {
    dispatch(getMe()); // fetch user on page refresh
    dispatch(fetchBooks({ page: 1, limit: 12 }));
    dispatch(fetchCart());
    dispatch(fetchAlertBooks())
    dispatch(fetchCategories());
    // }
  }, [dispatch]);

  const { role, isLoggedIn } = useSelector(state => state.auth)

  return (
    <>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/all-books' element={<AllBooks />} />
        <Route path='/logIn' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/payment' element={
          <ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path='/order-summary/:orderId' element={
          <ProtectedRoute><OrderSummary /></ProtectedRoute>} />

        <Route path='/cart' element={
          <ProtectedRoute><Cart /></ProtectedRoute>} />

        {/* <Route path='/all-orders' element={<AllOrders />} /> */}
        <Route path='/view-book-details/:bookId' element={<BookDetails />} />
        <Route path='/address-confirmation' element={<ProtectedRoute><AddressConfirmation /></ProtectedRoute>} />

        {role === 'user' &&

          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} >
            <Route index element={<Favourites />} />


            <Route path='orderHistory' element={<UserOrderHistory />} />
            <Route path="settings" element={<Setting />} >
              <Route path='personal-info' element={<PersonalInformation />} />
              <Route path='account-security' element={<AccountSecurity />} />
              <Route path='address-contact' element={<AddressContact />} />
              <Route path='notification-setting' element={<Notification />} />
            </Route>
            <Route path="trackOrder/:orderId/:bookId" element={<TrackOrder />} />
          </Route>
        }
        {/* admin routes */}
        <Route path='/updateBook/:bookId' element={<UpdateBook />} />
        <Route path='/admin-notification' element={<AdminNotification />} />
        <Route path='/admin/dashboard' element={<Dashboard />} >
          <Route path='analytics' element={<Analytics />} />
          <Route path='orders' element={<Orders />} />
          <Route path='inventory' element={<Inventory />} />
          <Route path='customers' element={<Customers />} />
          <Route path='settings' element={<Settings />} />
          <Route path='edit-order/:orderId' element={<EditOrder />} />
          <Route path='add-book' element={<AddBook />} />
          <Route path="edit-book/:bookId" element={<EditBook />} />
          <Route path="add-categories" element={<AddCategory />} />
          <Route path='edit-customer/:userId' element={<EditCustomer />} />
        </Route>

        {/* Not found route */}
        <Route path='*' element={<div>Page Not Found</div>} />

      </Routes >
      {/* </ErrorBoundary> */}
      {role === 'user' && <Footer />}

    </>
  )
}

export default App

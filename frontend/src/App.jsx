import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
// auth
import { Login } from "../src/auth/Login"
import { SignUp } from "../src/auth/SignUp"
import { ForgotPassword } from './auth/ForgotPassword'
import { ResetPassword } from './auth/ResetPassword'
//components
import { Footer } from './Components/common/Footer'
import { Header } from './Components/common/Header'
import { AddressConfirmation } from './Components/User/AddressConfirmation'

//pages
import { Home } from './Pages/User/Home'
import { AllBooks } from "./Pages/User/AllBooks"
import { Cart } from './Pages/User/Cart'
import { Profile } from './Pages/User/Profile'
import { ViewBookDetails } from './Pages/User/ViewBookDetails'
import { Favourites } from './Pages/User/Favourites'
import { UserOrderHistory } from './Pages/User/UserOrderHistory'
import { Setting } from './Pages/User/Setting'
import { AllOrders } from './Pages/Admin/AllOrders'
import { TrackOrder } from './Pages/User/TrackOrder'
import { Contact } from './Pages/User/Contact'
import { PersonalInformation } from './Pages/User/PersonalInformation'
// import { AccountSecurity } from './Pages/User/AccountSecurity'
import { AddressContact } from './Pages/User/AddressContact'
import { Payment } from './Pages/User/Payment'
import { OrderSummary } from './Pages/User/OrderSummary'

import { UpdateBook } from './Pages/Admin/UpdateBook'
import { AddBook } from './Pages/Admin/AddBook'
import { Dashboard } from './Pages/Admin/Dashboard'
import { Analytics } from './Pages/Admin/Analytics'
import { Orders } from './Pages/Admin/Orders'
import { Customers } from './Pages/Admin/Customers'
import { Inventory } from './Pages/Admin/Inventory'
import { Settings as AdminSettings } from './Pages/Admin/Settings'
import { EditOrder } from './Pages/Admin/EditOrder'
import { EditBook } from './Pages/Admin/EditBook'
import { EditCustomer } from './Pages/Admin/EditCustomer'
import { AdminNotification } from './Pages/Admin/AdminNotification'

import { AddCategory } from './Pages/Admin/AddCategory'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from './store/Cart/cartThunks'
import { fetchAlertBooks } from './store/books/booksAlertThunks'
import { fetchCategories } from './store/categories/categoryThunks'
import { fetchBooks } from './store/books/authBooks'
function App() {
  const dispatch = useDispatch()
  const { role, token } = useSelector(state => state.auth)
  useEffect(() => {
    if (token) {
      dispatch(fetchBooks())
      dispatch(fetchCart());


      dispatch(fetchAlertBooks())
      dispatch(fetchCategories());
    }
  }, [dispatch, token]);
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
        <Route path='/payment' element={<Payment />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/order-summary/:orderid' element={<OrderSummary />} />
        <Route path='/cart' element={<Cart />} />
        {/* <Route path='/all-orders' element={<AllOrders />} /> */}
        <Route path='/view-book-details/:bookid' element={<ViewBookDetails />} />
        <Route path='/address-confirmation' element={<AddressConfirmation />} />

        {role === 'user' &&
          <Route path='/profile' element={<Profile />} >
            <Route index element={<Favourites />} />


            <Route path='/profile/orderHistory' element={<UserOrderHistory />} />
            <Route path="/profile/settings" element={<Setting />} >
              <Route path='/profile/settings/personal-info' element={<PersonalInformation />} />
              {/* <Route path='/profile/settings/account-security' element={<AccountSecurity />} /> */}
              <Route path='/profile/settings/address-contact' element={<AddressContact />} />

              <Route path='/profile/settings/notification-setting' />
            </Route>
            <Route path="/profile/trackOrder/:orderid/:bookid" element={<TrackOrder />
            } />
          </Route>
        }
        {/* admin routes */}
        <Route path='/updateBook/:bookid' element={<UpdateBook />} />
        <Route path='/admin-notification' element={<AdminNotification />} />
        <Route path='/admin/dashboard' element={<Dashboard />} >
          <Route path='/admin/dashboard/analytics' element={<Analytics />} />
          <Route path='/admin/dashboard/orders' element={<Orders />} />
          <Route path='/admin/dashboard/inventory' element={<Inventory />} />
          <Route path='/admin/dashboard/customers' element={<Customers />} />
          <Route path='/admin/dashboard/settings' element={<AdminSettings />} />
          <Route path='/admin/dashboard/edit-order/:orderid' element={<EditOrder />} />
          <Route path='/admin/dashboard/add-book' element={<AddBook />} />
          <Route path="/admin/dashboard/edit-book/:bookid" element={<EditBook />} />
          <Route path="/admin/dashboard/add-categories" element={<AddCategory />} />
          <Route path='/admin/dashboard/edit-customer/:customerid' element={<EditCustomer />} />
        </Route>

        {/* Not found route */}
        <Route path='*' element={'Page Not Found'} />

      </Routes >
      {role === 'user' && <Footer />}

    </>
  )
}

export default App

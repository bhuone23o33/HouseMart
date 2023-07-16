import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Explore from "./pages/Explore";
import ForgetPassword from "./pages/ForgetPassword";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateListings from "./pages/CreateListings";
import EditListing from "./pages/EditListing";
import Listings from "./pages/Listings";
import Contact from "./pages/Contact";





function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-listing" element={<CreateListings />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/category/:categoryName/:listingId" element={< Listings />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
        </Routes>
        {/* navbar here so we can navigate through navbar (in router so we can navigate)*/}
        <Navbar />
      </Router>
      <ToastContainer />

    </>
  )
}

export default App

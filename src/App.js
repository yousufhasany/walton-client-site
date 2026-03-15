import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import Inventory from './admin/Inventory';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import AdminSales from './admin/Sales';
import AdminPurchases from './admin/Purchases';
import AdminMessages from './admin/Messages';
import PrivateRoute from './admin/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/inventory/add"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/inventory/edit/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <PrivateRoute>
              <AdminSales />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/purchases"
          element={
            <PrivateRoute>
              <AdminPurchases />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <PrivateRoute>
              <AdminMessages />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

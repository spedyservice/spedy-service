import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/common/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const BookNowPage = lazy(() => import('./pages/BookNowPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage')); // ✅ NEW
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const BookingDetailPage = lazy(() => import('./pages/BookingDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminProductCategories = lazy(() => import('./pages/admin/AdminProductCategories'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();

  const hideNavbarFooter = ['/login', '/register'];
  const adminRoutes = [
    '/admin',
    '/admin/bookings',
    '/admin/services',
    '/admin/brands',
    '/admin/banners',
    '/admin/videos',
    '/admin/users',
    '/admin/settings',
    '/admin/categories',
    '/admin/products',
    '/admin/orders',
  ];
  const isAdminRoute = adminRoutes.some((route) => location.pathname.startsWith(route));
  const shouldHideNavbarFooter = hideNavbarFooter.includes(location.pathname) || isAdminRoute;

  const hideFooter =
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/order/') ||
    location.pathname === '/shop' ||
    location.pathname === '/services' ||
    location.pathname === '/book-now' ||
    location.pathname === '/contact' ||
    location.pathname === '/my-bookings' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminRoute) {
    return (
      <AdminRoute>
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/categories" element={<AdminProductCategories />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </Suspense>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbarFooter && <Navbar />}
      <main className={`flex-grow ${!shouldHideNavbarFooter ? 'pt-[60px] md:pt-[80px]' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book-now" element={<BookNowPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth-callback" element={<AuthCallbackPage />} /> {/* ✅ NEW */}

            <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      {!shouldHideNavbarFooter && !hideFooter && <Footer />}
    </div>
  );
}

export default App;
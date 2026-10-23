import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/common/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import PopupBanner from './components/common/PopupBanner';

// Lazy load most pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const BookNowPage = lazy(() => import('./pages/BookNowPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const BookingDetailPage = lazy(() => import('./pages/BookingDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));

// Import these normally to avoid dynamic chunk errors
import MyBookingsPage from './pages/MyBookingsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WhatsAppButton from './components/common/WhatsAppButton';

// Admin pages (lazy)
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
const AdminPopupBanners = lazy(() => import('./pages/admin/AdminPopupBanners'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ✅ ENHANCED SEO METADATA (Keyword optimized)
const BASE_URL = 'https://spedyservice.in';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

const pageMeta = {
  home: {
    title: 'Spedy Service – Best Home Appliance Repair in Bardhaman | AC, Fridge, Washing Machine',
    description: 'Spedy Service offers fast, reliable home appliance repair in Bardhaman and genuine products. Expert AC, refrigerator, washing machine, and TV repair. Book now!',
  },
  services: {
    title: 'Professional Appliance Repair Services | AC, Fridge, Washing Machine | Spedy Service',
    description: 'Expert repair services for AC, refrigerator, washing machine, TV, and more in Bardhaman. Trusted professionals, same-day service, and genuine parts.',
  },
  shop: {
    title: 'Buy Home Appliances Online | Spedy Service',
    description: 'Buy genuine home appliances at best prices. AC, refrigerator, washing machine, TV, and more. Free delivery on orders above ₹1000.',
  },
  bookNow: {
    title: 'Book Appliance Repair Online | Same-Day Service | Spedy Service',
    description: 'Book your appliance repair service online in Bardhaman. Professional technicians, genuine parts, and fast response.',
  },
  contact: {
    title: 'Contact Us – Spedy Service | 24/7 Appliance Repair Support',
    description: 'Reach out to us for queries, support, or service booking. Call +91 96093 37633 or email spedyservice40@gmail.com.',
  }
};

function App() {
  const location = useLocation();

  const hideNavbarFooter = ['/login', '/register'];
  const adminRoutes = [
    '/admin', '/admin/bookings', '/admin/services', '/admin/brands', '/admin/banners', 
    '/admin/videos', '/admin/popup-banners', '/admin/users', '/admin/settings', 
    '/admin/categories', '/admin/products', '/admin/orders',
  ];
  const isAdminRoute = adminRoutes.some((route) => location.pathname.startsWith(route));
  const shouldHideNavbarFooter = hideNavbarFooter.includes(location.pathname) || isAdminRoute;

  const isHomePage = location.pathname === '/';

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

  // Admin routes – strictly NO INDEX
  if (isAdminRoute) {
    return (
      <AdminRoute>
        <AdminLayout>
          <Helmet>
            <title>Admin Panel – Spedy Service</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/popup-banners" element={<AdminPopupBanners />} />
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

  // Public routes – with dynamic SEO metadata
  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbarFooter && <Navbar />}
      <main className={`flex-grow ${!shouldHideNavbarFooter ? 'pt-[60px] md:pt-[80px]' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            
            {/* === HOME PAGE === */}
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.home.title}</title>
                    <meta name="description" content={pageMeta.home.description} />
                    <link rel="canonical" href={BASE_URL} />
                    {/* Open Graph */}
                    <meta property="og:title" content={pageMeta.home.title} />
                    <meta property="og:description" content={pageMeta.home.description} />
                    <meta property="og:url" content={BASE_URL} />
                    <meta property="og:image" content={DEFAULT_IMAGE} />
                    <meta property="og:type" content="website" />
                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={pageMeta.home.title} />
                    <meta name="twitter:description" content={pageMeta.home.description} />
                    <meta name="twitter:image" content={DEFAULT_IMAGE} />
                  </Helmet>
                  <HomePage />
                </>
              }
            />

            {/* === SERVICES PAGE === */}
            <Route
              path="/services"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.services.title}</title>
                    <meta name="description" content={pageMeta.services.description} />
                    <link rel="canonical" href={`${BASE_URL}/services`} />
                    {/* Open Graph */}
                    <meta property="og:title" content={pageMeta.services.title} />
                    <meta property="og:description" content={pageMeta.services.description} />
                    <meta property="og:url" content={`${BASE_URL}/services`} />
                    <meta property="og:image" content={DEFAULT_IMAGE} />
                    <meta property="og:type" content="website" />
                  </Helmet>
                  <ServicesPage />
                </>
              }
            />

            {/* === SHOP PAGE === */}
            <Route
              path="/shop"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.shop.title}</title>
                    <meta name="description" content={pageMeta.shop.description} />
                    <link rel="canonical" href={`${BASE_URL}/shop`} />
                    <meta property="og:title" content={pageMeta.shop.title} />
                    <meta property="og:description" content={pageMeta.shop.description} />
                    <meta property="og:url" content={`${BASE_URL}/shop`} />
                    <meta property="og:image" content={DEFAULT_IMAGE} />
                  </Helmet>
                  <ShopPage />
                </>
              }
            />

            {/* === BOOK NOW PAGE === */}
            <Route
              path="/book-now"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.bookNow.title}</title>
                    <meta name="description" content={pageMeta.bookNow.description} />
                    <link rel="canonical" href={`${BASE_URL}/book-now`} />
                    <meta property="og:title" content={pageMeta.bookNow.title} />
                    <meta property="og:description" content={pageMeta.bookNow.description} />
                    <meta property="og:url" content={`${BASE_URL}/book-now`} />
                  </Helmet>
                  <BookNowPage />
                </>
              }
            />

            {/* === CONTACT PAGE === */}
            <Route
              path="/contact"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.contact.title}</title>
                    <meta name="description" content={pageMeta.contact.description} />
                    <link rel="canonical" href={`${BASE_URL}/contact`} />
                  </Helmet>
                  <ContactPage />
                </>
              }
            />

            {/* === PRODUCT DETAIL PAGE === */}
            <Route
              path="/product/:slug"
              element={
                <>
                  <Helmet>
                    <title>Product Details – Spedy Service</title>
                    <meta name="description" content="View product details, price, and buy genuine appliances online." />
                    <link rel="canonical" href={`${BASE_URL}${location.pathname}`} />
                  </Helmet>
                  <ProductDetailPage />
                </>
              }
            />

            {/* === AUTH PAGES (NO INDEX) === */}
            <Route
              path="/login"
              element={
                <>
                  <Helmet>
                    <title>Login – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <LoginPage />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Helmet>
                    <title>Register – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <RegisterPage />
                </>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <>
                  <Helmet>
                    <title>Forgot Password – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <ForgotPasswordPage />
                </>
              }
            />
            <Route
              path="/reset-password"
              element={
                <>
                  <Helmet>
                    <title>Reset Password – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <ResetPasswordPage />
                </>
              }
            />
            <Route
              path="/auth-callback"
              element={
                <>
                  <Helmet>
                    <title>Completing Sign In – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <AuthCallbackPage />
                </>
              }
            />

            {/* === PROTECTED / USER PAGES (NO INDEX) === */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>My Bookings – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Booking Details – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <BookingDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>My Profile – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Cart – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Checkout – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>Order Details – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>My Orders – Spedy Service</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!shouldHideNavbarFooter && !hideFooter && <Footer />}
      <PopupBanner />
      {isHomePage && <WhatsAppButton />}
    </div>
  );
}

export default App;
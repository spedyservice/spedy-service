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
import WhatsAppButton from './components/common/WhatsAppButton'


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

// SEO metadata for each page
const pageMeta = {
  home: {
    title: 'Spedy Service – Home Appliance Repair & Sells | Trusted Service',
    description: 'Fast, reliable home appliance repair and sells. AC, refrigerator, washing machine, TV repair. Book now!',
  },
  services: {
    title: 'Our Services – Spedy Service | Professional Appliance Repair',
    description: 'Expert repair services for AC, refrigerator, washing machine, TV, and more. Trusted professionals, same-day service.',
  },
  shop: {
    title: 'Shop Appliances – Spedy Service | Genuine Products',
    description: 'Buy genuine home appliances at best prices. AC, refrigerator, washing machine, TV, and more. Free delivery on orders above ₹1000.',
  },
  bookNow: {
    title: 'Book a Repair – Spedy Service | Quick & Reliable',
    description: 'Book your appliance repair service online. Professional technicians, genuine parts, and fast response.',
  },
  contact: {
    title: 'Contact Us – Spedy Service | 24/7 Support',
    description: 'Reach out to us for queries, support, or service booking. Call +91 96093 37633 or email spedyservice40@gmail.com.',
  },
  login: {
    title: 'Login – Spedy Service | Sign in to your account',
    description: 'Login to your Spedy Service account to manage bookings, orders, and profile.',
  },
  register: {
    title: 'Register – Spedy Service | Create Account',
    description: 'Create an account with Spedy Service for fast booking and order tracking.',
  },
  myBookings: {
    title: 'My Bookings – Spedy Service | Track Your Services',
    description: 'View and manage all your service bookings. Track status, leave reviews, and more.',
  },
  myOrders: {
    title: 'My Orders – Spedy Service | Track Orders',
    description: 'View your purchase history and order status. Track deliveries and manage orders.',
  },
  cart: {
    title: 'Cart – Spedy Service | Your Shopping Cart',
    description: 'Review your cart items and proceed to checkout. Genuine products with best prices.',
  },
  checkout: {
    title: 'Checkout – Spedy Service | Secure Checkout',
    description: 'Complete your order securely. Free delivery on orders above ₹1000.',
  },
  profile: {
    title: 'My Profile – Spedy Service | Account Settings',
    description: 'Manage your profile, address, and password settings.',
  },
  authCallback: {
    title: 'Completing Sign In – Spedy Service',
    description: 'Please wait while we complete your sign-in process.',
  },
};

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
    '/admin/popup-banners',
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

  // Admin routes – also add a Helmet for admin pages
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

  // Public routes – with SEO metadata
  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbarFooter && <Navbar />}
      <main className={`flex-grow ${!shouldHideNavbarFooter ? 'pt-[60px] md:pt-[80px]' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.home.title}</title>
                    <meta name="description" content={pageMeta.home.description} />
                    <link rel="canonical" href="https://spedyservice.in" />
                  </Helmet>
                  <HomePage />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.services.title}</title>
                    <meta name="description" content={pageMeta.services.description} />
                  </Helmet>
                  <ServicesPage />
                </>
              }
            />
            <Route
              path="/shop"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.shop.title}</title>
                    <meta name="description" content={pageMeta.shop.description} />
                  </Helmet>
                  <ShopPage />
                </>
              }
            />
            <Route
              path="/book-now"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.bookNow.title}</title>
                    <meta name="description" content={pageMeta.bookNow.description} />
                  </Helmet>
                  <BookNowPage />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.contact.title}</title>
                    <meta name="description" content={pageMeta.contact.description} />
                  </Helmet>
                  <ContactPage />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Helmet>
                    <title>{pageMeta.login.title}</title>
                    <meta name="description" content={pageMeta.login.description} />
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
                    <title>{pageMeta.register.title}</title>
                    <meta name="description" content={pageMeta.register.description} />
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
                    <title>{pageMeta.authCallback.title}</title>
                    <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  <AuthCallbackPage />
                </>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>{pageMeta.myBookings.title}</title>
                    <meta name="description" content={pageMeta.myBookings.description} />
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
                    <meta name="description" content="View your booking details, status, and manage your service request." />
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
                    <title>{pageMeta.profile.title}</title>
                    <meta name="description" content={pageMeta.profile.description} />
                  </Helmet>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <>
                  <Helmet>
                    <title>Product Details – Spedy Service</title>
                    <meta name="description" content="View product details, price, and buy genuine appliances online." />
                  </Helmet>
                  <ProductDetailPage />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Helmet>
                    <title>{pageMeta.cart.title}</title>
                    <meta name="description" content={pageMeta.cart.description} />
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
                    <title>{pageMeta.checkout.title}</title>
                    <meta name="description" content={pageMeta.checkout.description} />
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
                    <meta name="description" content="View your order details, status, and track delivery." />
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
                    <title>{pageMeta.myOrders.title}</title>
                    <meta name="description" content={pageMeta.myOrders.description} />
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
      <WhatsAppButton />
    </div>
  );
}

export default App;
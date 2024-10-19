import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EnhancedLoadingSpinner from './components/shared/EnhancedLoadingSpinner';
import ErrorFallback from './components/shared/ErrorFallback';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
// const QrCodePage = lazy(() => import('./pages/QrCodePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <EnhancedLoadingSpinner />;
  }

  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex flex-col min-h-screen App">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<EnhancedLoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                {/* Home route is now open to all users */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } />
                <Route path="/faq" element={
                  <ProtectedRoute>
                    <FAQ />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                } />
                {/* <Route path="/qr-code" element={
                  <ProtectedRoute>
                    <QrCodePage />
                  </ProtectedRoute>
                } /> */}

                {/* Redirect all /book routes to / */}
                <Route path="/book/*" element={<Navigate to="/" replace />} />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
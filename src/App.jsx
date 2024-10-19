import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EnhancedLoadingSpinner from './components/shared/EnhancedLoadingSpinner';
import ErrorFallback from './components/shared/ErrorFallback';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
// const Explore = lazy(() => import('./pages/Explore'));
const Events = lazy(() => import('./pages/Events'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const QrCodePage = lazy(() => import('./pages/QrCodePage'));

function App() {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex flex-col min-h-screen App">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<EnhancedLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/explore" element={<Explore />} /> */}
                <Route path="/events" element={<Events />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/qr-code" element={<QrCodePage />} />

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

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EnhancedLoadingSpinner from './components/shared/EnhancedLoadingSpinner';
import ErrorFallback from './components/shared/ErrorFallback';
import ProtectedRoute from './components/ProtectedRoute';

// Direct imports instead of lazy loading
import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Progress from './pages/Progress.jsx';
import Quiz from './pages/Quiz.jsx';
import Resume from './pages/Resume.jsx';
import Roadmap from './pages/Roadmap.jsx';

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
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/quiz" element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="/resume" element={
                <ProtectedRoute>
                  <Resume />
                </ProtectedRoute>
              } />
              <Route path="/roadmap" element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              } />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
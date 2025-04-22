import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EnhancedLoadingSpinner from './components/shared/EnhancedLoadingSpinner';
import ErrorFallback from './components/shared/ErrorFallback';

// Direct imports instead of lazy loading
import Home from './pages/Home.jsx';
import Progress from './pages/Progress.jsx';
import Quiz from './pages/Quiz.jsx';
import Resume from './pages/Resume.jsx';
import Roadmap from './pages/Roadmap.jsx';

function App() {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex flex-col min-h-screen App">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/roadmap" element={<Roadmap />} />

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
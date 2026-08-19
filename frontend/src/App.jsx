import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AdsProvider } from './context/AdsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppOpenAd from './components/AppOpenAd';
import GlobalAdScript from './components/GlobalAdScript';
import BannerAd from './components/BannerAd';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch/');
  
  return (
    <div className="app-container">
      {!isWatchPage && <Navbar />}
      <main className="main-content" style={{ paddingTop: isWatchPage ? 0 : '64px' }}>
        {!isWatchPage && <BannerAd placement="bannerHeader" />}
        {children}
      </main>
      {!isWatchPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AdsProvider>
      <GlobalAdScript />
      <Router>
        <AppOpenAd />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </Router>
    </AdsProvider>
  );
};

export default App;
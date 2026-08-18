import React, { useState, useEffect } from 'react';
import { Film, Eye, Star, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPage.css';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDashboard();
        if (res.success) setData(res);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;
  if (!data) return <div className="error-state">Failed to load dashboard</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Overview</h2>
        <div className="dashboard-actions">
          <Link to="/movies/add" className="btn btn-primary">
            <Plus size={18} /> Add Movie
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Movies" value={data.totalMovies} icon={<Film size={24} />} color="primary" />
        <StatsCard title="Published" value={data.publishedMovies} icon={<CheckCircle size={24} />} color="success" />
        <StatsCard title="Featured" value={data.featuredMovies} icon={<Star size={24} />} color="warning" />
        <StatsCard title="Total Views" value={data.totalViews?.toLocaleString() || 0} icon={<Eye size={24} />} color="primary" />
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h3>Recent Uploads</h3>
          <Link to="/movies">View All</Link>
        </div>
        <div className="recent-list">
          {data.recentUploads?.length > 0 ? data.recentUploads.map(movie => (
            <div key={movie._id} className="recent-item">
              <img src={movie.posterUrl} alt={movie.title} />
              <div className="recent-info">
                <h4>{movie.title}</h4>
                <span>{new Date(movie.createdAt).toLocaleDateString()} • {movie.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="recent-status">
                <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                  {movie.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          )) : (
            <div className="empty-state">No recent uploads</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

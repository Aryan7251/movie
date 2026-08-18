import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-info">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
      <div className={`stats-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;

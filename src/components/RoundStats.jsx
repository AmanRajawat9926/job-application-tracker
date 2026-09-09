import React from 'react';
import { ROUNDS } from '../utils/helpers';

export default function RoundStats({ applications }) {
  const counts = ROUNDS.reduce((acc, round) => {
    acc[round] = applications.filter((app) => app.round === round).length;
    return acc;
  }, {});

  return (
    <div className="stats-bar">
      <div className="stat-pill total-pill">
        <span className="stat-label">Total</span>
        <span className="stat-value">{applications.length}</span>
      </div>
      {ROUNDS.map((round) => (
        <div key={round} className={`stat-pill stat-${round.toLowerCase()}`}>
          <span className="stat-label">{round}</span>
          <span className="stat-value">{counts[round] || 0}</span>
        </div>
      ))}
    </div>
  );
}
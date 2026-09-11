import React from 'react';
import { ROUNDS } from '../utils/helpers';

export default function RoundStats({ applications }) {
  const counts = ROUNDS.reduce((acc, round) => {
    acc[round] = 0;
    return acc;
  }, {});

  applications.forEach((app) => {
    if (counts[app.round] !== undefined) {
      counts[app.round] += 1;
    }
  });

  return (
    <nav className="stats-bar" aria-label="Application status counts">
      <div className="stat-pill total-pill">
        <span className="stat-label">Total</span>
        <span className="stat-value">{applications.length}</span>
      </div>
      {ROUNDS.map((round) => (
        <div key={round} className={`stat-pill stat-${round.toLowerCase()}`}>
          <span className="stat-label">{round}</span>
          <span className="stat-value">{counts[round]}</span>
        </div>
      ))}
    </nav>
  );
}
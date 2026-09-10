// src/components/ApplicationList.jsx
import React, { useState, useMemo } from 'react';
import ApplicationRow from './ApplicationRow';
import { ROUNDS } from '../utils/helpers';

export default function ApplicationList({
  applications,
  onUpdateApplication,
  onDeleteApplication
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roundFilter, setRoundFilter] = useState('ALL');

  // Newest first, then apply combined filter
  const filteredApplications = useMemo(() => {
    const sorted = [...applications].sort(
      (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
    );

    return sorted.filter((app) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === '' ||
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term);

      const matchesRound = roundFilter === 'ALL' || app.round === roundFilter;
      return matchesSearch && matchesRound;
    });
  }, [applications, searchTerm, roundFilter]);

  // Distinct Empty State 1: Global database is empty
  if (applications.length === 0) {
    return (
      <div className="list-container">
        <div className="empty-state empty-state-initial">
          <p className="empty-title">No applications recorded</p>
          <p className="empty-sub">
            Add your first job application using the form to start tracking your rounds and timeline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="filter-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="round-select"
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
        >
          <option value="ALL">All Rounds</option>
          {ROUNDS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Distinct Empty State 2: Filters match nothing */}
      {filteredApplications.length === 0 ? (
        <div className="empty-state empty-state-search">
          <p className="empty-title">No matching applications</p>
          <p className="empty-sub">
            No entries found matching &ldquo;{searchTerm}&rdquo; in round &ldquo;{roundFilter}&rdquo;.
          </p>
          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setRoundFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {filteredApplications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onUpdate={onUpdateApplication}
              onDelete={onDeleteApplication}
            />
          ))}
        </div>
      )}
    </div>
  );
}
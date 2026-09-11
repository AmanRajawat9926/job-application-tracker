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

  const filteredApplications = useMemo(() => {

    const sorted = [...applications].sort((a, b) => {
      const dateA = new Date(a.appliedDate + 'T00:00:00').getTime();
      const dateB = new Date(b.appliedDate + 'T00:00:00').getTime();
      return dateB - dateA;
    });

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

  if (applications.length === 0) {
    return (
      <section className="list-container" aria-labelledby="list-heading">
        <h2 id="list-heading" className="sr-only">Applications List</h2>
        <div className="empty-state empty-state-initial" role="status">
          <p className="empty-title">No applications recorded yet</p>
          <p className="empty-sub">
            Fill out the form on the left to start tracking your job applications.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="list-container" aria-labelledby="list-heading">
      <div className="list-header-row">
        <h2 id="list-heading">
          Applications ({filteredApplications.length}{' '}
          {filteredApplications.length !== applications.length ? `of ${applications.length}` : ''})
        </h2>
      </div>

      <div className="filter-toolbar" role="search" aria-label="Filter applications">
        <div className="search-box">
          <label htmlFor="search-input" className="sr-only">Search applications</label>
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label htmlFor="round-filter" className="sr-only">Filter by round</label>
          <select
            id="round-filter"
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
      </div>

      {filteredApplications.length === 0 ? (
        <div className="empty-state empty-state-search" role="status">
          <p className="empty-title">No matching applications</p>
          <p className="empty-sub">
            No applications match &ldquo;{searchTerm}&rdquo; in &ldquo;{roundFilter}&rdquo;.
          </p>
          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setRoundFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="card-grid" role="feed" aria-busy="false">
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
    </section>
  );
}
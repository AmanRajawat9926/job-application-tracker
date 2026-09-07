import React from 'react';
import { getRelativeTime, formatExactDate } from '../utils/dateUtils';

export default function ApplicationList({
  applications,
  onDeleteApplication
}) {
  // Create a copy of applications and sort newest applications first
  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
  );

  // Show message when there are no applications
  if (sortedApplications.length === 0) {
    return (
      <div className="empty-state">
        <p>
          No job applications tracked yet. Fill the form to log your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="list-container">

      {/* Display total number of applications */}
      <h2>Tracked Applications ({sortedApplications.length})</h2>

      <div className="card-grid">

        {/* Loop through all applications */}
        {sortedApplications.map((app) => (
          <article key={app.id} className="app-card">

            {/* Application header */}
            <header className="card-header">
              <div>

                {/* Job role */}
                <h3>{app.role}</h3>

                {/* Company name */}
                <p className="company-name">{app.company}</p>
              </div>

              {/* Application status / round */}
              <span className={`badge badge-${app.round.toLowerCase()}`}>
                {app.round}
              </span>
            </header>

            <div className="card-body">

              {/* Application date */}
              <p className="applied-time">
                Applied:{' '}

                <time
                  dateTime={app.appliedDate}
                  title={formatExactDate(app.appliedDate)}
                  className="time-hover"
                >
                  {getRelativeTime(app.appliedDate)}
                </time>
              </p>

              <div className="card-actions">

                {/* Open job posting in a new tab */}
                <a
                  href={app.jobLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="job-anchor"
                >
                  View Link &rarr;
                </a>

                {/* Delete application */}
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onDeleteApplication(app.id)}
                  aria-label={`Delete ${app.role} application at ${app.company}`}
                >
                  Delete
                </button>

              </div>
            </div>
          </article>
        ))}

      </div>
    </div>
  );
}
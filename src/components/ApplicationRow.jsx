import React, { useState } from 'react';
import {
  validateApplication,
  ROUNDS,
  getRelativeTime,
  formatExactDate,
  getDaysSinceApplied,
  isApplicationStale
} from '../utils/helpers';

export default function ApplicationRow({ app, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(app);
  const [errors, setErrors] = useState({});

  const daysSince = getDaysSinceApplied(app.appliedDate);
  const isStale = isApplicationStale(app.round, app.appliedDate);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = validateApplication(editData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onUpdate(editData);
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditData(app);
    setErrors({});
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="app-card edit-card">
        <form onSubmit={handleSave} noValidate>
          <div className="edit-grid">
            <div className="form-group">
              <label htmlFor={`edit-company-${app.id}`}>Company</label>
              <input
                id={`edit-company-${app.id}`}
                name="company"
                type="text"
                value={editData.company}
                onChange={handleEditChange}
              />
              {errors.company && <span className="field-error">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={`edit-role-${app.id}`}>Role</label>
              <input
                id={`edit-role-${app.id}`}
                name="role"
                type="text"
                value={editData.role}
                onChange={handleEditChange}
              />
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={`edit-round-${app.id}`}>Round</label>
              <select
                id={`edit-round-${app.id}`}
                name="round"
                value={editData.round}
                onChange={handleEditChange}
              >
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`edit-date-${app.id}`}>Applied Date</label>
              <input
                id={`edit-date-${app.id}`}
                name="appliedDate"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={editData.appliedDate}
                onChange={handleEditChange}
              />
              {errors.appliedDate && <span className="field-error">{errors.appliedDate}</span>}
            </div>

            <div className="form-group span-two">
              <label htmlFor={`edit-link-${app.id}`}>Job Posting URL</label>
              <input
                id={`edit-link-${app.id}`}
                name="jobLink"
                type="url"
                value={editData.jobLink}
                onChange={handleEditChange}
              />
              {errors.jobLink && <span className="field-error">{errors.jobLink}</span>}
            </div>
          </div>

          <div className="edit-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className={`app-card ${isStale ? 'card-stale-border' : ''}`}>
      <header className="card-header">
        <div>
          <div className="title-row">
            <h3>{app.role}</h3>
            {isStale && <span className="badge badge-stale">Stale (&gt;14d)</span>}
          </div>
          <p className="company-name">{app.company}</p>
        </div>
        <div className="badge-group">
          <span className="badge badge-days">
            {daysSince === null ? 'Unknown age' : `${daysSince}d active`}
          </span>
          <span className={`badge badge-${app.round.toLowerCase()}`}>
            {app.round}
          </span>
        </div>
      </header>

      <div className="card-body">
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
          {app.jobLink ? (
            <a
              href={app.jobLink}
              target="_blank"
              rel="noreferrer noopener"
              className="job-anchor"
            >
              View Posting &rarr;
            </a>
          ) : (
            <span className="no-link">No link</span>
          )}
          <button
            type="button"
            className="edit-btn"
            onClick={() => {
              setEditData(app);
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(app.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
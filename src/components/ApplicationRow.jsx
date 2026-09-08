// src/components/ApplicationRow.jsx
import React, { useState } from 'react';
import { validateApplication, ROUNDS, getRelativeTime, formatExactDate } from '../utils/helpers';

export default function ApplicationRow({ app, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(app);
  const [errors, setErrors] = useState({});

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
              <label>Company</label>
              <input
                name="company"
                type="text"
                value={editData.company}
                onChange={handleEditChange}
              />
              {errors.company && <span className="field-error">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                name="role"
                type="text"
                value={editData.role}
                onChange={handleEditChange}
              />
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label>Round</label>
              <select name="round" value={editData.round} onChange={handleEditChange}>
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Applied Date</label>
              <input
                name="appliedDate"
                type="date"
                value={editData.appliedDate}
                onChange={handleEditChange}
              />
              {errors.appliedDate && <span className="field-error">{errors.appliedDate}</span>}
            </div>

            <div className="form-group span-two">
              <label>Job Posting URL</label>
              <input
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
    <article className="app-card">
      <header className="card-header">
        <div>
          <h3>{app.role}</h3>
          <p className="company-name">{app.company}</p>
        </div>
        <span className={`badge badge-${app.round.toLowerCase()}`}>
          {app.round}
        </span>
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
          <a
            href={app.jobLink}
            target="_blank"
            rel="noreferrer noopener"
            className="job-anchor"
          >
            View Posting &rarr;
          </a>
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditing(true)}
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
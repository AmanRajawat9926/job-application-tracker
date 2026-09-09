import React, { useState } from 'react';
import { validateApplication, ROUNDS } from '../utils/helpers';

const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  company: '',
  role: '',
  round: 'Applied',
  appliedDate: getTodayString(),
  jobLink: ''
};

export default function ApplicationForm({ onAddApplication }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateApplication(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAddApplication({
      ...formData,
      id: crypto.randomUUID()
    });

    setFormData({
      ...INITIAL_FORM,
      appliedDate: getTodayString()
    });
    setErrors({});
  };

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Application</h2>

      <div className="form-group">
        <label htmlFor="add-company">Company</label>
        <input
          id="add-company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Stripe"
        />
        {errors.company && <span className="field-error">{errors.company}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="add-role">Role</label>
        <input
          id="add-role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Full Stack Engineer"
        />
        {errors.role && <span className="field-error">{errors.role}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="add-round">Round</label>
        <select
          id="add-round"
          name="round"
          value={formData.round}
          onChange={handleChange}
        >
          {ROUNDS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="add-date">Applied Date</label>
        <input
          id="add-date"
          name="appliedDate"
          type="date"
          max={getTodayString()}
          value={formData.appliedDate}
          onChange={handleChange}
        />
        {errors.appliedDate && <span className="field-error">{errors.appliedDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="add-link">Job Posting URL</label>
        <input
          id="add-link"
          name="jobLink"
          type="url"
          value={formData.jobLink}
          onChange={handleChange}
          placeholder="https://..."
        />
        {errors.jobLink && <span className="field-error">{errors.jobLink}</span>}
      </div>

      <button type="submit" className="submit-btn">Save Application</button>
    </form>
  );
}
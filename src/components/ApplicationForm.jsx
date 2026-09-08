// src/components/ApplicationForm.jsx
import React, { useState } from 'react';
import { validateApplication, ROUNDS } from '../utils/helpers';

const INITIAL_FORM = {
  company: '',
  role: '',
  round: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0],
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

    setFormData(INITIAL_FORM);
    setErrors({});
  };

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Application</h2>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Stripe"
        />
        {errors.company && <span className="field-error">{errors.company}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Software Engineer"
        />
        {errors.role && <span className="field-error">{errors.role}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="round">Round</label>
        <select
          id="round"
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
        <label htmlFor="appliedDate">Applied Date</label>
        <input
          id="appliedDate"
          name="appliedDate"
          type="date"
          value={formData.appliedDate}
          onChange={handleChange}
        />
        {errors.appliedDate && <span className="field-error">{errors.appliedDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="jobLink">Job Posting URL</label>
        <input
          id="jobLink"
          name="jobLink"
          type="url"
          value={formData.jobLink}
          onChange={handleChange}
          placeholder="https://example.com/job"
        />
        {errors.jobLink && <span className="field-error">{errors.jobLink}</span>}
      </div>

      <button type="submit" className="submit-btn">Save Application</button>
    </form>
  );
}
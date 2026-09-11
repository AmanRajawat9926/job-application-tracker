import React, { useState } from 'react';
import { validateApplication, ROUNDS, getTodayString } from '../utils/helpers';

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
    <form className="app-form" onSubmit={handleSubmit} noValidate aria-labelledby="form-heading">
      <h2 id="form-heading">Add Application</h2>

      <div className="form-group">
        <label htmlFor="company-field">
          Company <span className="req-marker" aria-hidden="true">*</span>
        </label>
        <input
          id="company-field"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? 'company-error' : undefined}
          placeholder="e.g. Stripe"
        />
        {errors.company && (
          <span id="company-error" className="field-error" role="alert">
            {errors.company}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="role-field">
          Role <span className="req-marker" aria-hidden="true">*</span>
        </label>
        <input
          id="role-field"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? 'role-error' : undefined}
          placeholder="e.g. Full Stack Engineer"
        />
        {errors.role && (
          <span id="role-error" className="field-error" role="alert">
            {errors.role}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="round-field">Round</label>
        <select
          id="round-field"
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
        <label htmlFor="date-field">
          Applied Date <span className="req-marker" aria-hidden="true">*</span>
        </label>
        <input
          id="date-field"
          name="appliedDate"
          type="date"
          max={getTodayString()}
          value={formData.appliedDate}
          onChange={handleChange}
          aria-invalid={Boolean(errors.appliedDate)}
          aria-describedby={errors.appliedDate ? 'date-error' : undefined}
        />
        {errors.appliedDate && (
          <span id="date-error" className="field-error" role="alert">
            {errors.appliedDate}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="link-field">
          Job Posting URL <span className="req-marker" aria-hidden="true">*</span>
        </label>
        <input
          id="link-field"
          name="jobLink"
          type="url"
          value={formData.jobLink}
          onChange={handleChange}
          aria-invalid={Boolean(errors.jobLink)}
          aria-describedby={errors.jobLink ? 'link-error' : undefined}
          placeholder="https://..."
        />
        {errors.jobLink && (
          <span id="link-error" className="field-error" role="alert">
            {errors.jobLink}
          </span>
        )}
      </div>

      <button type="submit" className="submit-btn">Save Application</button>
    </form>
  );
}
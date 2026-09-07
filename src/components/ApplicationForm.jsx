import React, { useState } from 'react';

// Initial/default values for the application form
const INITIAL_FORM = {
  company: '',
  role: '',
  round: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0],
  jobLink: ''
};

export default function ApplicationForm({ onAddApplication }) {
  // Stores all form field values
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Stores validation error messages for each field
  const [errors, setErrors] = useState({});

  // Validates all form fields before submission
  const validate = () => {
    const nextErrors = {};

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Validate company name
    if (!formData.company.trim()) {
      nextErrors.company = 'Company name is required.';
    }

    // Validate role
    if (!formData.role.trim()) {
      nextErrors.role = 'Role is required.';
    }

    // Validate applied date
    if (!formData.appliedDate) {
      nextErrors.appliedDate = 'Applied date is required.';
    } else if (formData.appliedDate > today) {
      // Prevent the user from selecting a future date
      nextErrors.appliedDate = 'Applied date cannot be in the future.';
    }

    // Validate job posting URL
    if (!formData.jobLink.trim()) {
      nextErrors.jobLink = 'Job link is required.';
    } 
    // Return all validation errors
    return nextErrors;
  };

  // Handles changes in all form inputs
  const handleChange = (e) => {
    // Get the input's name and current value
    const { name, value } = e.target;

    // Update only the changed field while keeping other values unchanged
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Remove the error message when the user starts correcting the field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handles form submission
  const handleSubmit = (e) => {
    // Prevent the browser from refreshing the page
    e.preventDefault();

    // Run form validation
    const validationErrors = validate();

    // If validation errors exist, display them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Send the application data to the parent component
    onAddApplication({
      ...formData,
    });

    // Reset the form after successful submission
    setFormData(INITIAL_FORM);

    // Clear any previous validation errors
    setErrors({});
  };

  return (
    // Form submission is handled by handleSubmit
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Application</h2>

      {/* Company name field */}
      <div className="form-group">
        <label htmlFor="company">Company</label>

        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Acme Corp"
        />

        {/* Display company validation error if it exists */}
        {errors.company && (
          <span className="field-error">{errors.company}</span>
        )}
      </div>

      {/* Job role field */}
      <div className="form-group">
        <label htmlFor="role">Role</label>

        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Frontend Engineer"
        />

        {/* Display role validation error if it exists */}
        {errors.role && (
          <span className="field-error">{errors.role}</span>
        )}
      </div>

      {/* Application stage/round field */}
      <div className="form-group">
        <label htmlFor="round">Round</label>

        <select
          id="round"
          name="round"
          value={formData.round}
          onChange={handleChange}
        >
          <option value="Applied">Applied</option>
          <option value="Screen">Screen</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Application date field */}
      <div className="form-group">
        <label htmlFor="appliedDate">Applied Date</label>

        <input
          id="appliedDate"
          name="appliedDate"
          type="date"
          value={formData.appliedDate}
          onChange={handleChange}
        />

        {/* Display date validation error if it exists */}
        {errors.appliedDate && (
          <span className="field-error">{errors.appliedDate}</span>
        )}
      </div>

      {/* Job posting URL field */}
      <div className="form-group">
        <label htmlFor="jobLink">Job Posting URL</label>

        <input
          id="jobLink"
          name="jobLink"
          type="url"
          value={formData.jobLink}
          onChange={handleChange}
          placeholder="https://..."
        />

        {/* Display URL validation error if it exists */}
        {errors.jobLink && (
          <span className="field-error">{errors.jobLink}</span>
        )}
      </div>

      {/* Submit button */}
      <button type="submit" className="submit-btn">
        Save Application
      </button>
    </form>
  );
}


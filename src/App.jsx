import React, { useState, useEffect } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import './App.css';

// Key used to store and retrieve applications from localStorage
const STORAGE_KEY = 'storage_key';

export default function App() {
  // Store all job applications in state
  const [applications, setApplications] = useState(() => {
    try {
      // Get saved application data from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);

      // Convert saved JSON string back into an array
      // If nothing is saved, use an empty array
      return saved ? JSON.parse(saved) : [];
    } catch {
      // If localStorage contains invalid JSON,
      // start with an empty application list
      return [];
    }
  });

  // Save applications to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );
  }, [applications]);

  // Handle adding a new job application
  const handleAddApplication = (newApp) => {
    // Add the new application at the beginning of the array
    setApplications((prev) => [newApp, ...prev]);
  };

  // Handle deleting an application
  const handleDeleteApplication = (idToDelete) => {
    // Keep all applications except the one whose ID matches
    setApplications((prev) =>
      prev.filter((app) => app.id !== idToDelete)
    );
  };

  return (
    <div className="app-layout">

      {/* Main page header */}
      <header className="page-header">
        <h1>Job Application Tracker</h1>
      </header>

      <main className="content-container">

        {/* Left column containing the application form */}
        <section className="form-column">
          <ApplicationForm
            onAddApplication={handleAddApplication}
          />
        </section>

        {/* Right column containing the application list */}
        <section className="list-column">
          <ApplicationList
            applications={applications}
            onDeleteApplication={handleDeleteApplication}
          />
        </section>

      </main>
    </div>
  );
}

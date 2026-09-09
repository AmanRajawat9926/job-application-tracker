import React, { useState, useEffect } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import RoundStats from './components/RoundStats';
import { loadAndMigrateApplications, CANONICAL_STORAGE_KEY } from './utils/storage';
import './App.css';

export default function App() {
  const [applications, setApplications] = useState(() => loadAndMigrateApplications());

  useEffect(() => {
    try {
      localStorage.setItem(CANONICAL_STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error('Failed to sync applications to localStorage', err);
    }
  }, [applications]);

  const handleAddApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleUpdateApplication = (updatedApp) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
  };

  const handleDeleteApplication = (idToDelete) => {
    setApplications((prev) => prev.filter((app) => app.id !== idToDelete));
  };

  return (
    <div className="app-layout">
      <header className="page-header">
        <h1>Job Application Tracker</h1>
        <RoundStats applications={applications} />
      </header>

      <main className="content-container">
        <aside className="form-column">
          <ApplicationForm onAddApplication={handleAddApplication} />
        </aside>
        <section className="list-column">
          <ApplicationList
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        </section>
      </main>
    </div>
  );
}
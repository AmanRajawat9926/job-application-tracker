// src/App.jsx
import React, { useState, useEffect } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import RoundStats from './components/RoundStats';
import './App.css';

const STORAGE_KEY = 'job_tracker_applications_v1';

export default function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);

      // REPAIR: Backfill missing IDs on existing records
      let neededRepair = false;
      const repaired = parsed.map((item) => {
        if (!item.id || typeof item.id !== 'string') {
          neededRepair = true;
          return { ...item, id: crypto.randomUUID() };
        }
        return item;
      });

      if (neededRepair) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
      }

      return repaired;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
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
        {/* Header counts derived from the full saved dataset */}
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
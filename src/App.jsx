import React, { useState, useEffect } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import RoundStats from './components/RoundStats';
import StorageBanner from './components/StorageBanner';
import { loadApplicationsSafely, saveApplicationsSafely } from './utils/storage';
import './App.css';

export default function App() {
  const [storageState] = useState(() => loadApplicationsSafely());
  const [applications, setApplications] = useState(storageState.records);
  const [storageNotice, setStorageNotice] = useState(
    storageState.status !== 'ok' ? storageState.status : null
  );

  useEffect(() => {
    const saveStatus = saveApplicationsSafely(applications);
    if (saveStatus !== 'ok') {
      setStorageNotice(saveStatus);
    }
  }, [applications]);

  const handleAddApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleUpdateApplication = (updatedApp) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === updatedApp.id ? updatedApp : item))
    );
  };

  const handleDeleteApplication = (idToDelete) => {
    setApplications((prev) => prev.filter((item) => item.id !== idToDelete));
  };

  return (
    <div className="app-layout">
      <StorageBanner
        status={storageNotice}
        onDismiss={() => setStorageNotice(null)}
      />

      <header className="page-header">
        <h1>Job Application Tracker</h1>
        <RoundStats applications={applications} />
      </header>

      <main className="content-container">
        <aside className="form-column">
          <ApplicationForm onAddApplication={handleAddApplication} />
        </aside>
        <div className="list-column">
          <ApplicationList
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        </div>
      </main>
    </div>
  );
}
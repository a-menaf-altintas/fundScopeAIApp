// src/App.js
import React from 'react';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <h1>FundScope AI</h1>
      <ProfileForm />
      <hr />
      <Dashboard />
    </div>
  );
}

export default App;

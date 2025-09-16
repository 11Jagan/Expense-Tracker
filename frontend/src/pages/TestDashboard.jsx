import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const TestDashboard = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Test Dashboard</h1>
        <p>This is a test to see if the basic layout works.</p>
      </div>
    </MainLayout>
  );
};

export default TestDashboard;
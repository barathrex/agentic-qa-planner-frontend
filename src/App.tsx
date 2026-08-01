import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QaPlanPage from './pages/QaPlanPage';
import VersionHistoryPage from './pages/VersionHistoryPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plan/:id" element={<QaPlanPage />} />
        <Route path="/plan/:id/versions" element={<VersionHistoryPage />} />
      </Routes>
    </Layout>
  );
}

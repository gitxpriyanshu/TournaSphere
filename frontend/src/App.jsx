import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import MyTeam from './pages/captain/MyTeam';
import ManageTournaments from './pages/admin/ManageTournaments';
import ManageTeams from './pages/organizer/ManageTeams';
import ManageMatches from './pages/organizer/ManageMatches';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ className: 'font-sans font-bold', style: {background: '#1e293b', color: '#fff', border: '1px solid #334155'} }} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={<Navigate to="/tournaments" replace />} />

          {/* Protected Routes encapsulated in Main Layout */}
          <Route element={<MainLayout />}>
            {/* Any authed user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Captain Only */}
            <Route element={<ProtectedRoute allowedRoles={['team_captain']} />}>
              <Route path="/team" element={<MyTeam />} />
            </Route>

            {/* Organizer OR Admin */}
            <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
              <Route path="/organizer/teams" element={<ManageTeams />} />
              <Route path="/organizer/matches" element={<ManageMatches />} />
            </Route>

            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/tournaments" element={<ManageTournaments />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import OnboardingProfile from './pages/OnboardingProfile';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UserTypeProvider } from './contexts/UserTypeContext';
import Navbar from './components/Navbar';
import Matches from './pages/Matches';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UserTypeProvider>
          <Router>
            <Toaster position="top-center" />
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding/profile" element={<OnboardingProfile />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/matches" element={<Matches />} />
            </Routes>
          </Router>
        </UserTypeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

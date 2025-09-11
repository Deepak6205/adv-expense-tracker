import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {currentUser ? (
          <Route path="/*" element={<Dashboard />} />
        ) : (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

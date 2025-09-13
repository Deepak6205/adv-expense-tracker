// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout, setToken, setLoading } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // reload and get token to be sure
        try {
          await user.reload();
        } catch (e) {
          // ignoring reload error
        }
        const token = await user.getIdToken();
        dispatch(
          login({
            token,
            userId: user.uid,
            user: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              email: user.email,
            },
          })
        );
        dispatch(setToken(token));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

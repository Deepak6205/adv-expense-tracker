import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout, setToken, setLoading } from "./redux/authSlice";
import { setCart } from "./redux/cartSlice";
import { get, ref, child } from "firebase/database";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((s) => s.auth);
  const [user, setUser] = useState(null);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        dispatch(
          login({
            token,
            userId: currentUser.uid,
            user: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              emailVerified: currentUser.emailVerified,
              email: currentUser.email,
            },
          })
        );
        dispatch(setToken(token));

        // Fetch user's cart from Firebase
        const dbRef = ref(db);
        get(child(dbRef, `carts/${currentUser.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              dispatch(setCart(snapshot.val()));
            } else {
              dispatch(setCart([]));
            }
          })
          .catch((error) => console.error(error));
      } else {
        setUser(null);
        dispatch(logout());
        dispatch(setCart([]));
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
    <>
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
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./lib/supabase";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Exercises/Exercises";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Layout from "./pages/Layout/Layout";
import Workouts from "./pages/Workouts/Workouts";
import { fetchCurrentUser } from "./store/auth/authThunks";
import { setAuthState } from "./store/auth/authSlice";
import ContactUs from "./pages/ContactUs/ContactUs";

export default function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(
        setAuthState({ user: session?.user ?? null, session: session ?? null }),
      );
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  if (!initialized) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <>
      <div className="app">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/exercises" element={<Dashboard />} />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />{" "}
          </Route>
        </Routes>
      </div>
    </>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import { UnifiedFeedback } from "unified-sdk";
import "unified-sdk/dist/unified-sdk.css";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Dashboard />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/stats"
                element={
                  <>
                    <Stats />
                    <Footer />
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
          <UnifiedFeedback
            projectId={import.meta.env.VITE_PROJECT_ID}
            firebaseUid={import.meta.env.VITE_FIREBASE_UID}
            theme="dark"
          />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};
export default App;

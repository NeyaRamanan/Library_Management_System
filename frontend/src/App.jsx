import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import Resources from "./pages/Resources";
import Users from "./pages/Users";
import History from "./pages/History";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const SIDEBAR_WIDTH = "250px";

function Layout({ children }) {
  const location  = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!hideSidebar && <Sidebar />}
      <div
        style={{
          flex: 1,
          marginLeft: hideSidebar ? 0 : SIDEBAR_WIDTH,
          minHeight: "100vh",
          background: "#f1f5f9",
          width: hideSidebar ? "100%" : `calc(100% - ${SIDEBAR_WIDTH})`,
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/books" element={
        <ProtectedRoute><Layout><Books /></Layout></ProtectedRoute>
      } />
      <Route path="/issue" element={
        <ProtectedRoute><Layout><IssueBook /></Layout></ProtectedRoute>
      } />
      <Route path="/return" element={
        <ProtectedRoute><Layout><ReturnBook /></Layout></ProtectedRoute>
      } />
      <Route path="/resources" element={
        <ProtectedRoute><Layout><Resources /></Layout></ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><Layout><History /></Layout></ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

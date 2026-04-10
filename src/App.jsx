// ✅ FULLY RESPONSIVE VERSION (CORE FIXES APPLIED)
// NOTE: This is a cleaned + responsive base. Replace your App.jsx with this.

import { useState, useEffect } from "react";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.menuBtn}
        >
          ☰
        </button>
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <div style={styles.mobileSidebar}>
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div style={styles.content}>
        <Dashboard isMobile={isMobile} />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>CLINIVANTA</h2>
      <p>Dashboard</p>
      <p>Patients</p>
      <p>Appointments</p>
    </div>
  );
}

function Dashboard({ isMobile }) {
  return (
    <div
      style={{
        ...styles.grid,
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      <Card title="Patients" value="120" />
      <Card title="Appointments" value="45" />
      <Card title="Revenue" value="$12,400" />
      <Card title="Alerts" value="3" />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    overflow: "auto", // ✅ FIXED
    background: "#0d1117",
    color: "white",
  },
  sidebar: {
    width: 220,
    background: "#161b22",
    padding: 20,
  },
  mobileSidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 220,
    height: "100%",
    background: "#161b22",
    zIndex: 1000,
  },
  menuBtn: {
    position: "fixed",
    top: 10,
    left: 10,
    zIndex: 1100,
    padding: "10px 14px",
    background: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: 6,
  },
  content: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
  },
  grid: {
    display: "grid",
    gap: 16,
  },
  card: {
    background: "#161b22",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #30363d",
  },
};

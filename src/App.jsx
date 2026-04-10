import { useState, createContext, useContext, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const G = () => (
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0d1117;--bg2:#161b22;--bg3:#1c2330;--bg4:#21262d;
      --border:#30363d;--border2:#444c56;
      --text:#e6edf3;--text2:#8b949e;--text3:#6e7681;
      --accent:#58a6ff;--a2:#1f6feb;
      --green:#3fb950;--g2:#238636;
      --red:#f85149;--yellow:#d29922;--purple:#bc8cff;--cyan:#79c0ff;
      --font:'Sora',sans-serif;--mono:'JetBrains Mono',monospace;
      --sidebar-w:214px;
    }
    html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.5}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#444c56;border-radius:9px}
    input,select,textarea{font-family:var(--font);background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:7px 11px;font-size:13px;width:100%;outline:none}
    input:focus,select:focus,textarea:focus{border-color:var(--accent)}
    input[type=date]{color-scheme:dark}
    button{font-family:var(--font);cursor:pointer;border:none;outline:none}
    table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:9px 13px}
    @media(max-width:768px){
      td,th{padding:8px 10px}
    }
  `}</style>
);

/* ─── DEMO DATA ─────────────────────────────────────────────── */
const TODAY = new Date().toISOString().split("T")[0];
const D = {
  patients: [
    {
      id: "p1",
      mrn: "MRN100001",
      name: "James Wilson",
      dob: "1965-04-15",
      gender: "Male",
      phone: "+1-555-1001",
      email: "james.wilson@email.com",
      blood: "A+",
      allergies: "Penicillin",
      address: "123 Oak St, Boston MA",
      emergency: "Mary Wilson — +1-555-1002",
      insurance: "BlueCross BS001",
      chronic: "Hypertension, Hyperlipidemia",
    },
    {
      id: "p2",
      mrn: "MRN100002",
      name: "Emma Thompson",
      dob: "1988-11-22",
      gender: "Female",
      phone: "+1-555-1003",
      email: "emma.t@email.com",
      blood: "O-",
      allergies: "None",
      address: "456 Maple Ave, Boston MA",
      emergency: "John Thompson — +1-555-1004",
      insurance: "Aetna AE002",
      chronic: "",
    },
    {
      id: "p3",
      mrn: "MRN100003",
      name: "Robert Garcia",
      dob: "1975-07-30",
      gender: "Male",
      phone: "+1-555-1005",
      email: "r.garcia@email.com",
      blood: "B+",
      allergies: "Sulfa drugs",
      address: "789 Pine Rd, Cambridge MA",
      emergency: "Carmen Garcia — +1-555-1006",
      insurance: "Cigna CG003",
      chronic: "Type 2 Diabetes, Obesity",
    },
    {
      id: "p4",
      mrn: "MRN100004",
      name: "Sophia Martinez",
      dob: "1992-02-14",
      gender: "Female",
      phone: "+1-555-1007",
      email: "sophia.m@email.com",
      blood: "AB+",
      allergies: "None",
      address: "321 Elm St, Somerville MA",
      emergency: "Luis Martinez — +1-555-1008",
      insurance: "UnitedHealth UH004",
      chronic: "",
    },
    {
      id: "p5",
      mrn: "MRN100005",
      name: "David Kim",
      dob: "1950-09-08",
      gender: "Male",
      phone: "+1-555-1009",
      email: "d.kim@email.com",
      blood: "O+",
      allergies: "Aspirin, NSAIDs",
      address: "654 Birch Lane, Brookline MA",
      emergency: "Ji-yeon Kim — +1-555-1010",
      insurance: "Medicare MED005",
      chronic: "Coronary Artery Disease, COPD",
    },
    {
      id: "p6",
      mrn: "MRN100006",
      name: "Aisha Mohammed",
      dob: "2010-06-18",
      gender: "Female",
      phone: "+1-555-1011",
      email: "",
      blood: "B-",
      allergies: "Peanuts",
      address: "987 Cedar Rd, Quincy MA",
      emergency: "Hassan Mohammed — +1-555-1012",
      insurance: "Medicaid MD006",
      chronic: "Asthma",
    },
  ],
  doctors: [
    {
      id: "doc1",
      name: "Dr. Arjun Sharma",
      spec: "Cardiologist",
      dept: "Cardiology",
      exp: 15,
      fee: 150,
      available: true,
      phone: "+1-555-0201",
    },
    {
      id: "doc2",
      name: "Dr. Priya Patel",
      spec: "General Physician",
      dept: "General Medicine",
      exp: 10,
      fee: 80,
      available: true,
      phone: "+1-555-0202",
    },
    {
      id: "doc3",
      name: "Dr. Wei Chen",
      spec: "Neurologist",
      dept: "Neurology",
      exp: 12,
      fee: 200,
      available: true,
      phone: "+1-555-0203",
    },
    {
      id: "doc4",
      name: "Dr. Amina Yusuf",
      spec: "Pediatrician",
      dept: "Pediatrics",
      exp: 8,
      fee: 90,
      available: false,
      phone: "+1-555-0204",
    },
    {
      id: "doc5",
      name: "Dr. Carlos Rivera",
      spec: "Orthopedic Surgeon",
      dept: "Orthopedics",
      exp: 18,
      fee: 250,
      available: true,
      phone: "+1-555-0205",
    },
  ],
  appointments: [
    {
      id: "a1",
      patientId: "p1",
      doctorId: "doc1",
      date: TODAY,
      time: "09:00",
      status: "completed",
      type: "Consultation",
      complaint: "Chest pain and shortness of breath",
      token: 1,
    },
    {
      id: "a2",
      patientId: "p2",
      doctorId: "doc2",
      date: TODAY,
      time: "10:00",
      status: "in_progress",
      type: "Follow-up",
      complaint: "Fever and cough",
      token: 2,
    },
    {
      id: "a3",
      patientId: "p3",
      doctorId: "doc1",
      date: TODAY,
      time: "09:30",
      status: "checked_in",
      type: "Checkup",
      complaint: "Annual cardiac review",
      token: 3,
    },
    {
      id: "a4",
      patientId: "p4",
      doctorId: "doc3",
      date: TODAY,
      time: "09:00",
      status: "confirmed",
      type: "Consultation",
      complaint: "Persistent migraines",
      token: 1,
    },
    {
      id: "a5",
      patientId: "p5",
      doctorId: "doc2",
      date: TODAY,
      time: "11:00",
      status: "scheduled",
      type: "Consultation",
      complaint: "Diabetes management",
      token: 3,
    },
    {
      id: "a6",
      patientId: "p6",
      doctorId: "doc4",
      date: TODAY,
      time: "10:30",
      status: "scheduled",
      type: "Checkup",
      complaint: "Asthma review",
      token: 1,
    },
  ],
  invoices: [
    {
      id: "inv1",
      number: "INV-10001",
      patientId: "p1",
      status: "paid",
      total: 259.05,
      paid: 259.05,
      date: TODAY,
    },
    {
      id: "inv2",
      number: "INV-10002",
      patientId: "p2",
      status: "sent",
      total: 126.5,
      paid: 0,
      date: TODAY,
    },
    {
      id: "inv3",
      number: "INV-10003",
      patientId: "p5",
      status: "partially_paid",
      total: 386.65,
      paid: 200,
      date: "2025-01-20",
    },
    {
      id: "inv4",
      number: "INV-10004",
      patientId: "p3",
      status: "paid",
      total: 104.5,
      paid: 104.5,
      date: "2025-01-20",
    },
    {
      id: "inv5",
      number: "INV-10005",
      patientId: "p6",
      status: "overdue",
      total: 198.0,
      paid: 0,
      date: "2025-01-01",
    },
  ],
  medicines: [
    {
      id: "m1",
      name: "Atorvastatin 40mg",
      generic: "Atorvastatin",
      cat: "Cardiovascular",
      unit: "tablet",
      price: 0.45,
      stock: 487,
      reorder: 100,
      expiry: "2026-12-01",
    },
    {
      id: "m2",
      name: "Metoprolol 25mg",
      generic: "Metoprolol",
      cat: "Cardiovascular",
      unit: "tablet",
      price: 0.6,
      stock: 312,
      reorder: 100,
      expiry: "2026-10-01",
    },
    {
      id: "m3",
      name: "Amoxicillin 500mg",
      generic: "Amoxicillin",
      cat: "Antibiotic",
      unit: "capsule",
      price: 0.45,
      stock: 850,
      reorder: 150,
      expiry: "2026-09-01",
    },
    {
      id: "m4",
      name: "Paracetamol 500mg",
      generic: "Paracetamol",
      cat: "Analgesic",
      unit: "tablet",
      price: 0.15,
      stock: 18,
      reorder: 200,
      expiry: "2027-01-01",
    },
    {
      id: "m5",
      name: "Metformin 1000mg",
      generic: "Metformin HCl",
      cat: "Antidiabetic",
      unit: "tablet",
      price: 0.3,
      stock: 640,
      reorder: 100,
      expiry: "2026-11-01",
    },
    {
      id: "m6",
      name: "Salbutamol Inhaler",
      generic: "Salbutamol",
      cat: "Bronchodilator",
      unit: "inhaler",
      price: 12.5,
      stock: 7,
      reorder: 20,
      expiry: "2025-08-01",
    },
    {
      id: "m7",
      name: "Insulin Glargine",
      generic: "Insulin Glargine",
      cat: "Antidiabetic",
      unit: "vial",
      price: 45.0,
      stock: 28,
      reorder: 10,
      expiry: "2025-09-01",
    },
    {
      id: "m8",
      name: "Amlodipine 5mg",
      generic: "Amlodipine",
      cat: "Antihypertensive",
      unit: "tablet",
      price: 0.5,
      stock: 423,
      reorder: 80,
      expiry: "2026-08-01",
    },
    {
      id: "m9",
      name: "Omeprazole 20mg",
      generic: "Omeprazole",
      cat: "Antacid",
      unit: "capsule",
      price: 0.35,
      stock: 9,
      reorder: 100,
      expiry: "2026-06-01",
    },
  ],
  labOrders: [
    {
      id: "lo1",
      patientId: "p1",
      doctor: "Dr. Arjun Sharma",
      date: TODAY,
      status: "completed",
      priority: "normal",
      tests: [
        { code: "ECG", result: "Normal sinus rhythm", abnormal: false },
        { code: "LIPID", result: "Total 198, LDL 118", abnormal: true },
      ],
    },
    {
      id: "lo2",
      patientId: "p2",
      doctor: "Dr. Priya Patel",
      date: TODAY,
      status: "ordered",
      priority: "urgent",
      tests: [{ code: "CBC", result: null, abnormal: false }],
    },
    {
      id: "lo3",
      patientId: "p3",
      doctor: "Dr. Priya Patel",
      date: TODAY,
      status: "processing",
      priority: "normal",
      tests: [
        { code: "HBA1C", result: "8.2%", abnormal: true },
        { code: "LIPID", result: null, abnormal: false },
      ],
    },
  ],
  staff: [
    {
      id: "st1",
      name: "Sarah Johnson",
      role: "Receptionist",
      dept: "General Medicine",
      email: "sarah@clinivanta.com",
      phone: "+1-555-0301",
      empId: "EMP-001",
      active: true,
    },
    {
      id: "st2",
      name: "Mike Brown",
      role: "Pharmacist",
      dept: "Pharmacy",
      email: "mike@clinivanta.com",
      phone: "+1-555-0302",
      empId: "EMP-002",
      active: true,
    },
    {
      id: "st3",
      name: "Lisa Davis",
      role: "Lab Technician",
      dept: "Laboratory",
      email: "lisa@clinivanta.com",
      phone: "+1-555-0303",
      empId: "EMP-003",
      active: true,
    },
    {
      id: "st4",
      name: "James Okafor",
      role: "Nurse",
      dept: "Cardiology",
      email: "james@clinivanta.com",
      phone: "+1-555-0304",
      empId: "EMP-004",
      active: true,
    },
    {
      id: "st5",
      name: "Fatima Hassan",
      role: "Nurse",
      dept: "Neurology",
      email: "fatima@clinivanta.com",
      phone: "+1-555-0305",
      empId: "EMP-005",
      active: false,
    },
  ],
  revenue: [
    { m: "Sep", v: 12400 },
    { m: "Oct", v: 15200 },
    { m: "Nov", v: 11800 },
    { m: "Dec", v: 18600 },
    { m: "Jan", v: 14200 },
    { m: "Feb", v: 9763 },
  ],
};

/* ─── CONTEXT ───────────────────────────────────────────────── */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

function Provider({ children }) {
  const [data, setData] = useState(D);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState({ name: "Admin User", role: "admin" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const addItem = (k, item) =>
    setData((d) => ({
      ...d,
      [k]: [{ ...item, id: "x" + Date.now() }, ...d[k]],
    }));
  const updateItem = (k, id, patch) =>
    setData((d) => ({
      ...d,
      [k]: d[k].map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  const navigate = (p) => {
    setPage(p);
    setSidebarOpen(false);
  };

  return (
    <Ctx.Provider
      value={{
        data,
        page,
        setPage: navigate,
        showToast,
        addItem,
        updateItem,
        user,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      <G />
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 16,
            zIndex: 999,
            background:
              toast.type === "error"
                ? "rgba(248,81,73,.15)"
                : "rgba(63,185,80,.15)",
            border: `1px solid ${toast.type === "error" ? "rgba(248,81,73,.4)" : "rgba(63,185,80,.4)"}`,
            borderRadius: 10,
            padding: "11px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 200,
            maxWidth: "calc(100vw - 32px)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: toast.type === "error" ? "var(--red)" : "var(--green)",
              fontSize: 16,
            }}
          >
            {toast.type === "error" ? "✕" : "✓"}
          </span>
          <span style={{ fontSize: 13 }}>{toast.msg}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

/* ─── PRIMITIVES ────────────────────────────────────────────── */
const BC = {
  gray: ["#8b949e", "rgba(139,148,158,.15)"],
  green: ["#3fb950", "rgba(63,185,80,.13)"],
  red: ["#f85149", "rgba(248,81,73,.13)"],
  yellow: ["#d29922", "rgba(210,153,34,.13)"],
  blue: ["#58a6ff", "rgba(88,166,255,.13)"],
  purple: ["#bc8cff", "rgba(188,140,255,.13)"],
  cyan: ["#79c0ff", "rgba(121,192,255,.13)"],
};
const Badge = ({ children, color = "gray" }) => {
  const [fg, bg] = BC[color] || BC.gray;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 9px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        color: fg,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};
const SM = {
  completed: ["green", "Completed"],
  in_progress: ["blue", "In Progress"],
  checked_in: ["cyan", "Checked In"],
  scheduled: ["gray", "Scheduled"],
  confirmed: ["purple", "Confirmed"],
  cancelled: ["red", "Cancelled"],
  paid: ["green", "Paid"],
  sent: ["blue", "Sent"],
  partially_paid: ["yellow", "Partial"],
  overdue: ["red", "Overdue"],
  pending: ["yellow", "Pending"],
  dispensed: ["green", "Dispensed"],
  ordered: ["blue", "Ordered"],
  processing: ["cyan", "Processing"],
  normal: ["gray", "Normal"],
  urgent: ["yellow", "Urgent"],
};
const SBadge = ({ s }) => {
  const [c, l] = SM[s] || ["gray", s];
  return <Badge color={c}>{l}</Badge>;
};

const Card = ({ children, style }) => (
  <div
    style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 18,
      ...style,
    }}
  >
    {children}
  </div>
);

const Stat = ({
  label,
  value,
  sub,
  icon,
  color = "var(--accent)",
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "14px 16px",
      cursor: onClick ? "pointer" : "default",
      minWidth: 0,
    }}
    onMouseEnter={(e) =>
      onClick && (e.currentTarget.style.borderColor = "var(--border2)")
    }
    onMouseLeave={(e) =>
      onClick && (e.currentTarget.style.borderColor = "var(--border)")
    }
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "var(--text2)",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: ".06em",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 18, opacity: 0.8 }}>{icon}</span>
    </div>
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        color,
        lineHeight: 1,
        wordBreak: "break-all",
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
        {sub}
      </div>
    )}
  </div>
);

const BTN = {
  accent: { bg: "var(--a2)", h: "#388bfd", t: "#fff", b: "none" },
  green: { bg: "var(--g2)", h: "#2ea043", t: "#fff", b: "none" },
  ghost: {
    bg: "transparent",
    h: "var(--bg3)",
    t: "var(--text2)",
    b: "1px solid var(--border)",
  },
  danger: {
    bg: "rgba(248,81,73,.1)",
    h: "rgba(248,81,73,.2)",
    t: "var(--red)",
    b: "1px solid rgba(248,81,73,.3)",
  },
};
const Btn = ({
  children,
  onClick,
  color = "accent",
  size = "md",
  disabled,
  style,
}) => {
  const c = BTN[color] || BTN.ghost;
  const p =
    { xs: "3px 8px", sm: "5px 12px", md: "7px 16px", lg: "10px 22px" }[size] ||
    "7px 16px";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: c.bg,
        color: c.t,
        border: c.b,
        borderRadius: 8,
        padding: p,
        fontSize: size === "sm" || size === "xs" ? 12 : 13,
        fontWeight: 500,
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) =>
        !disabled && (e.currentTarget.style.background = c.h)
      }
      onMouseLeave={(e) =>
        !disabled && (e.currentTarget.style.background = c.bg)
      }
    >
      {children}
    </button>
  );
};

const Inp = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  options,
  rows,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && (
      <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: "var(--red)" }}> *</span>}
      </label>
    )}
    {options ? (
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>
            {o.label || o}
          </option>
        ))}
      </select>
    ) : rows ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

/* ─── RESPONSIVE TABLE ──────────────────────────────────────── */
const Tbl = ({ cols, rows = [], onRow }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
    <table style={{ minWidth: "max-content", width: "100%" }}>
      <thead>
        <tr
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg3)",
          }}
        >
          {cols.map((c, i) => (
            <th
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                padding: "9px 13px",
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td
              colSpan={cols.length}
              style={{
                textAlign: "center",
                color: "var(--text3)",
                padding: "36px 13px",
                fontSize: 13,
              }}
            >
              No records found.
            </td>
          </tr>
        )}
        {rows.map((r, i) => (
          <tr
            key={r.id || i}
            onClick={() => onRow?.(r)}
            style={{
              borderBottom: "1px solid var(--border)",
              cursor: onRow ? "pointer" : "default",
            }}
            onMouseEnter={(e) =>
              onRow && (e.currentTarget.style.background = "var(--bg3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {cols.map((c, j) => (
              <td
                key={j}
                style={{
                  padding: "9px 13px",
                  fontSize: 13,
                  whiteSpace: c.wrap ? "normal" : "nowrap",
                }}
              >
                {c.render ? c.render(r) : r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── MODAL ─────────────────────────────────────────────────── */
const Modal = ({ title, children, onClose, footer, width = 580 }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.72)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      overflowY: "auto",
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        width: "100%",
        maxWidth: width,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            color: "var(--text2)",
            fontSize: 22,
            lineHeight: 1,
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>
      <div style={{ overflowY: "auto", padding: 20, flex: 1 }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            background: "var(--bg3)",
            borderRadius: "0 0 16px 16px",
            flexShrink: 0,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  </div>
);

const Avatar = ({ name = "", size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "var(--a2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    }}
  >
    {name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()}
  </div>
);

const age = (dob) =>
  dob ? Math.floor((Date.now() - new Date(dob)) / 31557600000) : null;
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ─── NAV ───────────────────────────────────────────────────── */
const NAV = [
  { id: "dashboard", icon: "⬛", label: "Dashboard" },
  { id: "patients", icon: "👤", label: "Patients" },
  { id: "appointments", icon: "📅", label: "Appointments" },
  { id: "queue", icon: "🔢", label: "Queue Board" },
  { id: "records", icon: "📋", label: "Medical Records" },
  { id: "doctors", icon: "🩺", label: "Doctors" },
  { id: "billing", icon: "💳", label: "Billing" },
  { id: "pharmacy", icon: "💊", label: "Pharmacy" },
  { id: "laboratory", icon: "🔬", label: "Laboratory" },
  { id: "staff", icon: "👥", label: "Staff" },
];
const TITLES = {
  dashboard: "Dashboard",
  patients: "Patients",
  appointments: "Appointments",
  queue: "Queue Board",
  records: "Medical Records",
  doctors: "Doctors",
  billing: "Billing & Invoicing",
  pharmacy: "Pharmacy",
  laboratory: "Laboratory",
  staff: "Staff Management",
};

function Sidebar() {
  const { page, setPage, user, sidebarOpen, setSidebarOpen } = useApp();
  const content = (
    <div
      style={{
        width: "var(--sidebar-w)",
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "18px 16px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--accent)",
              letterSpacing: "-.03em",
            }}
          >
            CLINIVANTA
          </div>
          <div
            style={{
              fontSize: 9,
              color: "var(--text3)",
              marginTop: 2,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            Hospital Management
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            background: "none",
            color: "var(--text2)",
            fontSize: 20,
            lineHeight: 1,
            display: "none",
          }}
          className="sidebar-close"
        >
          ×
        </button>
      </div>
      <nav style={{ padding: "10px 7px", flex: 1, overflowY: "auto" }}>
        {NAV.map((n) => {
          const a = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                background: a ? "var(--bg3)" : "transparent",
                color: a ? "var(--text)" : "var(--text2)",
                fontWeight: a ? 600 : 400,
                fontSize: 13,
                marginBottom: 2,
                textAlign: "left",
                border: a ? "1px solid var(--border)" : "1px solid transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                !a && (e.currentTarget.style.background = "var(--bg3)")
              }
              onMouseLeave={(e) =>
                !a && (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: 14, opacity: a ? 1 : 0.55 }}>
                {n.icon}
              </span>
              {n.label}
            </button>
          );
        })}
      </nav>
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar name={user.name} size={30} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Admin User</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>
            Administrator
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        style={{ display: "flex", flexShrink: 0 }}
        className="desktop-sidebar"
      >
        {content}
      </div>
      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}
          onClick={(e) => e.target === e.currentTarget && setSidebarOpen(false)}
        >
          <div
            style={{
              background: "rgba(0,0,0,.6)",
              position: "absolute",
              inset: 0,
            }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "var(--sidebar-w)",
                background: "var(--bg2)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              <div
                style={{
                  padding: "18px 16px 14px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--accent)",
                      letterSpacing: "-.03em",
                    }}
                  >
                    CLINIVANTA
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--text3)",
                      marginTop: 2,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Hospital Management
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: "none",
                    color: "var(--text2)",
                    fontSize: 24,
                    lineHeight: 1,
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
              <nav style={{ padding: "10px 7px", flex: 1, overflowY: "auto" }}>
                {NAV.map((n) => {
                  const a = page === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setPage(n.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        width: "100%",
                        padding: "10px 10px",
                        borderRadius: 8,
                        background: a ? "var(--bg3)" : "transparent",
                        color: a ? "var(--text)" : "var(--text2)",
                        fontWeight: a ? 600 : 400,
                        fontSize: 13,
                        marginBottom: 2,
                        textAlign: "left",
                        border: a
                          ? "1px solid var(--border)"
                          : "1px solid transparent",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 14, opacity: a ? 1 : 0.55 }}>
                        {n.icon}
                      </span>
                      {n.label}
                    </button>
                  );
                })}
              </nav>
              <div
                style={{
                  padding: "12px 14px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Avatar name={user.name} size={30} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    Admin User
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media(min-width:769px){ .mobile-menu-btn{display:none!important} }
        @media(max-width:768px){ .desktop-sidebar{display:none!important} }
      `}</style>
    </>
  );
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
function Dashboard() {
  const { data, setPage } = useApp();
  const todayA = data.appointments.filter((a) => a.date === TODAY);
  const revenue = data.invoices.reduce((s, i) => s + i.paid, 0);
  const outstanding = data.invoices.reduce(
    (s, i) => s + Math.max(0, i.total - i.paid),
    0,
  );
  const lowStock = data.medicines.filter((m) => m.stock <= m.reorder);

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <style>{`
        .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .dash-mid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .dash-bot{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        @media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.dash-mid{grid-template-columns:1fr}.dash-bot{grid-template-columns:1fr 1fr}}
        @media(max-width:520px){.stat-grid{grid-template-columns:repeat(2,1fr)}.dash-bot{grid-template-columns:1fr}}
      `}</style>
      <div className="stat-grid">
        <Stat
          label="Total Patients"
          value={data.patients.length}
          sub="+2 this week"
          icon="👤"
          color="var(--accent)"
          onClick={() => setPage("patients")}
        />
        <Stat
          label="Today's Appts"
          value={todayA.length}
          sub={`${todayA.filter((a) => a.status === "completed").length} completed`}
          icon="📅"
          color="var(--green)"
          onClick={() => setPage("appointments")}
        />
        <Stat
          label="Revenue"
          value={`₦${revenue.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub={`₦${outstanding.toFixed(0)} outstanding`}
          icon="💳"
          color="var(--purple)"
          onClick={() => setPage("billing")}
        />
        <Stat
          label="Stock Alerts"
          value={lowStock.length}
          sub={lowStock.length ? "Needs reorder" : "All stocked ✓"}
          icon="⚠️"
          color={lowStock.length ? "var(--red)" : "var(--green)"}
          onClick={() => setPage("pharmacy")}
        />
      </div>

      <div className="dash-mid">
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13 }}>Today's Queue</span>
            <Btn size="xs" color="ghost" onClick={() => setPage("queue")}>
              Full Board →
            </Btn>
          </div>
          {todayA.map((a) => {
            const p = data.patients.find((x) => x.id === a.patientId);
            const d = data.doctors.find((x) => x.id === a.doctorId);
            const sc = {
              completed: "var(--green)",
              in_progress: "var(--accent)",
              checked_in: "var(--cyan)",
              scheduled: "var(--border2)",
              confirmed: "var(--purple)",
            };
            return (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: (sc[a.status] || "#888") + "22",
                    border: `1.5px solid ${sc[a.status] || "#888"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: sc[a.status],
                    flexShrink: 0,
                  }}
                >
                  #{a.token}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p?.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {d?.name} · {a.time}
                  </div>
                </div>
                <SBadge s={a.status} />
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
            Monthly Revenue
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.revenue}>
              <XAxis
                dataKey="m"
                tick={{ fill: "#6e7681", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: 8,
                  color: "#e6edf3",
                  fontSize: 12,
                }}
                formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="v" fill="#1f6feb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="dash-bot">
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
            Doctor Roster
          </div>
          {data.doctors.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: d.available ? "var(--green)" : "var(--border2)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {d.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>
                  {d.spec}
                </div>
              </div>
              <Badge color={d.available ? "green" : "gray"}>
                {d.available ? "Active" : "Away"}
              </Badge>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
            Stock Alerts
          </div>
          {lowStock.length === 0 ? (
            <div
              style={{
                color: "var(--green)",
                fontSize: 13,
                textAlign: "center",
                padding: 20,
              }}
            >
              ✓ All medicines stocked
            </div>
          ) : (
            lowStock.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>
                    Reorder at {m.reorder}
                  </div>
                </div>
                <Badge color={m.stock === 0 ? "red" : "yellow"}>
                  {m.stock} left
                </Badge>
              </div>
            ))
          )}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
            Quick Stats
          </div>
          {[
            [
              "Active Doctors",
              data.doctors.filter((d) => d.available).length,
              "var(--green)",
            ],
            [
              "Total Staff",
              data.staff.filter((s) => s.active).length,
              "var(--cyan)",
            ],
            [
              "Paid Invoices",
              data.invoices.filter((i) => i.status === "paid").length,
              "var(--green)",
            ],
            [
              "Overdue Invoices",
              data.invoices.filter((i) => i.status === "overdue").length,
              "var(--red)",
            ],
            ["Low Stock Items", lowStock.length, "var(--yellow)"],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{l}</span>
              <span
                style={{ fontWeight: 700, color: c, fontFamily: "var(--mono)" }}
              >
                {v}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── PATIENTS ──────────────────────────────────────────────── */
function Patients() {
  const { data, addItem, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    blood: "O+",
    allergies: "",
    address: "",
    emergency: "",
    insurance: "",
    chronic: "",
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const filtered = data.patients.filter(
    (p) =>
      !search ||
      [p.name, p.mrn, p.phone, p.email].some((v) =>
        v?.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  if (selected) {
    const appts = data.appointments.filter((a) => a.patientId === selected.id);
    return (
      <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Btn size="sm" color="ghost" onClick={() => setSelected(null)}>
            ← Back
          </Btn>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selected.name}
          </h2>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text3)",
              flexShrink: 0,
            }}
          >
            {selected.mrn}
          </span>
        </div>
        <style>{`
          .patient-detail{display:grid;grid-template-columns:270px 1fr;gap:14px;align-items:start}
          @media(max-width:768px){.patient-detail{grid-template-columns:1fr}}
        `}</style>
        <div className="patient-detail">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Avatar name={selected.name} size={56} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    {selected.gender}
                    {age(selected.dob) && ` · ${age(selected.dob)} yrs`}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--text3)",
                    }}
                  >
                    {selected.mrn}
                  </div>
                </div>
                <Badge color="blue">{selected.blood}</Badge>
              </div>
              {[
                ["📞", selected.phone],
                ["✉", selected.email],
                ["📍", selected.address],
                ["🆘", selected.emergency],
                ["🏥", selected.insurance],
              ]
                .filter(([, v]) => v)
                .map(([ic, v]) => (
                  <div
                    key={ic}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text3)",
                        width: 20,
                        flexShrink: 0,
                      }}
                    >
                      {ic}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
            </Card>
            {selected.allergies && selected.allergies !== "None" && (
              <Card
                style={{
                  background: "rgba(248,81,73,.06)",
                  borderColor: "rgba(248,81,73,.3)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--red)",
                    marginBottom: 4,
                  }}
                >
                  ⚠ ALLERGIES
                </div>
                <div style={{ fontSize: 13 }}>{selected.allergies}</div>
              </Card>
            )}
            {selected.chronic && (
              <Card
                style={{
                  background: "rgba(210,153,34,.06)",
                  borderColor: "rgba(210,153,34,.3)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--yellow)",
                    marginBottom: 4,
                  }}
                >
                  CHRONIC CONDITIONS
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {selected.chronic}
                </div>
              </Card>
            )}
          </div>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
              Visit History ({appts.length})
            </div>
            {appts.length === 0 ? (
              <div style={{ color: "var(--text3)", fontSize: 13 }}>
                No appointments yet.
              </div>
            ) : (
              appts.map((a) => {
                const d = data.doctors.find((x) => x.id === a.doctorId);
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        width: 56,
                        flexShrink: 0,
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {a.date}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {a.complaint}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {d?.name} · {a.type}
                      </div>
                    </div>
                    <SBadge s={a.status} />
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text3)",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, MRN, phone..."
            style={{ paddingLeft: 32 }}
          />
        </div>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + Register Patient
        </Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Tbl
          cols={[
            {
              label: "MRN",
              render: (r) => (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text3)",
                  }}
                >
                  {r.mrn}
                </span>
              ),
            },
            {
              label: "Patient",
              render: (r) => (
                <div>
                  <div style={{ fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {r.gender}
                    {age(r.dob) && ` · ${age(r.dob)} yrs`}
                  </div>
                </div>
              ),
            },
            { label: "Phone", render: (r) => <span>{r.phone}</span> },
            {
              label: "Blood",
              render: (r) => <Badge color="blue">{r.blood}</Badge>,
            },
            {
              label: "Allergies",
              render: (r) =>
                r.allergies && r.allergies !== "None" ? (
                  <Badge color="red">{r.allergies}</Badge>
                ) : (
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>
                    None
                  </span>
                ),
            },
          ]}
          rows={filtered}
          onRow={(r) => setSelected(r)}
        />
      </Card>
      {showForm && (
        <Modal
          title="Register New Patient"
          onClose={() => setShowForm(false)}
          width={660}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.name || !form.phone)
                    return showToast("Name and phone required", "error");
                  addItem("patients", {
                    ...form,
                    mrn: "MRN10000" + (data.patients.length + 1),
                  });
                  showToast("Patient registered");
                  setShowForm(false);
                }}
              >
                Register
              </Btn>
            </>
          }
        >
          <style>{`.reg-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:520px){.reg-grid{grid-template-columns:1fr}}`}</style>
          <div className="reg-grid">
            <Inp
              label="Full Name"
              value={form.name}
              onChange={(v) => F("name", v)}
              required
            />
            <Inp
              label="Date of Birth"
              value={form.dob}
              onChange={(v) => F("dob", v)}
              type="date"
            />
            <Inp
              label="Gender"
              value={form.gender}
              onChange={(v) => F("gender", v)}
              options={["Male", "Female", "Other"]}
            />
            <Inp
              label="Blood Type"
              value={form.blood}
              onChange={(v) => F("blood", v)}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            />
            <Inp
              label="Phone"
              value={form.phone}
              onChange={(v) => F("phone", v)}
              required
              placeholder="+1-555-0000"
            />
            <Inp
              label="Email"
              value={form.email}
              onChange={(v) => F("email", v)}
              type="email"
            />
            <div style={{ gridColumn: "span 2" }}>
              <Inp
                label="Address"
                value={form.address}
                onChange={(v) => F("address", v)}
              />
            </div>
            <Inp
              label="Emergency Contact"
              value={form.emergency}
              onChange={(v) => F("emergency", v)}
            />
            <Inp
              label="Insurance"
              value={form.insurance}
              onChange={(v) => F("insurance", v)}
            />
            <Inp
              label="Known Allergies"
              value={form.allergies}
              onChange={(v) => F("allergies", v)}
              placeholder="None or list..."
            />
            <Inp
              label="Chronic Conditions"
              value={form.chronic}
              onChange={(v) => F("chronic", v)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── APPOINTMENTS ──────────────────────────────────────────── */
function Appointments() {
  const { data, addItem, updateItem, showToast } = useApp();
  const [dateF, setDateF] = useState(TODAY);
  const [statusF, setStatusF] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: TODAY,
    time: "09:00",
    type: "Consultation",
    complaint: "",
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const FLOW = {
    scheduled: ["confirmed", "cancelled"],
    confirmed: ["checked_in", "cancelled"],
    checked_in: ["in_progress", "cancelled"],
    in_progress: ["completed", "no_show"],
    completed: [],
    cancelled: [],
    no_show: [],
  };
  const filtered = data.appointments
    .filter(
      (a) =>
        (dateF ? a.date === dateF : true) &&
        (statusF === "all" || a.status === statusF),
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <style>{`
        .appt-filters{display:flex;gap:8px;flexWrap:wrap;align-items:center}
        .filter-scroll{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;flex:1}
        .filter-scroll::-webkit-scrollbar{height:0}
      `}</style>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="date"
          value={dateF}
          onChange={(e) => setDateF(e.target.value)}
          style={{ width: "auto", minWidth: 130 }}
        />
        <div className="filter-scroll">
          {[
            "all",
            "scheduled",
            "confirmed",
            "checked_in",
            "in_progress",
            "completed",
            "cancelled",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setStatusF(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                background: statusF === s ? "var(--a2)" : "var(--bg3)",
                color: statusF === s ? "#fff" : "var(--text2)",
                border: "1px solid var(--border)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s === "all"
                ? "All"
                : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + Book
        </Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Tbl
          cols={[
            {
              label: "#",
              render: (r) => (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  #{r.token}
                </span>
              ),
            },
            {
              label: "Time",
              render: (r) => (
                <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                  {r.time}
                </span>
              ),
            },
            {
              label: "Patient",
              render: (r) => {
                const p = data.patients.find((x) => x.id === r.patientId);
                return (
                  <div>
                    <div style={{ fontWeight: 500 }}>{p?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {p?.mrn}
                    </div>
                  </div>
                );
              },
            },
            {
              label: "Doctor",
              render: (r) => {
                const d = data.doctors.find((x) => x.id === r.doctorId);
                return <span style={{ fontSize: 12 }}>{d?.name}</span>;
              },
            },
            { label: "Status", render: (r) => <SBadge s={r.status} /> },
            {
              label: "Actions",
              render: (r) => (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {FLOW[r.status]?.map((ns) => (
                    <Btn
                      key={ns}
                      size="xs"
                      color={
                        ns === "completed"
                          ? "green"
                          : ns === "cancelled" || ns === "no_show"
                            ? "danger"
                            : "ghost"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem("appointments", r.id, { status: ns });
                        showToast("Status updated");
                      }}
                    >
                      {ns.replace("_", " ")}
                    </Btn>
                  ))}
                </div>
              ),
            },
          ]}
          rows={filtered}
        />
      </Card>
      {showForm && (
        <Modal
          title="Book Appointment"
          onClose={() => setShowForm(false)}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.patientId || !form.doctorId)
                    return showToast("Patient and doctor required", "error");
                  const token =
                    data.appointments.filter(
                      (a) =>
                        a.doctorId === form.doctorId && a.date === form.date,
                    ).length + 1;
                  addItem("appointments", {
                    ...form,
                    status: "scheduled",
                    token,
                  });
                  showToast("Appointment booked");
                  setShowForm(false);
                }}
              >
                Book
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp
              label="Patient"
              value={form.patientId}
              onChange={(v) => F("patientId", v)}
              required
              options={data.patients.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.mrn})`,
              }))}
            />
            <Inp
              label="Doctor"
              value={form.doctorId}
              onChange={(v) => F("doctorId", v)}
              required
              options={data.doctors.map((d) => ({
                value: d.id,
                label: `${d.name} — ${d.spec} (₦${d.fee})`,
              }))}
            />
            <style>{`.appt-dt{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:400px){.appt-dt{grid-template-columns:1fr}}`}</style>
            <div className="appt-dt">
              <Inp
                label="Date"
                value={form.date}
                onChange={(v) => F("date", v)}
                type="date"
              />
              <Inp
                label="Time"
                value={form.time}
                onChange={(v) => F("time", v)}
                type="time"
              />
            </div>
            <Inp
              label="Type"
              value={form.type}
              onChange={(v) => F("type", v)}
              options={[
                "Consultation",
                "Follow-up",
                "Checkup",
                "Emergency",
                "Procedure",
              ]}
            />
            <Inp
              label="Chief Complaint"
              value={form.complaint}
              onChange={(v) => F("complaint", v)}
              rows={3}
              placeholder="Describe symptoms..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── QUEUE ─────────────────────────────────────────────────── */
function Queue() {
  const { data, updateItem, showToast } = useApp();
  const todayA = data.appointments
    .filter((a) => a.date === TODAY)
    .sort((a, b) => {
      const o = {
        in_progress: 0,
        checked_in: 1,
        scheduled: 2,
        confirmed: 2,
        completed: 3,
        cancelled: 4,
      };
      return (
        (o[a.status] ?? 5) - (o[b.status] ?? 5) || a.time.localeCompare(b.time)
      );
    });
  const byDoc = {};
  todayA.forEach((a) => {
    if (!byDoc[a.doctorId]) byDoc[a.doctorId] = [];
    byDoc[a.doctorId].push(a);
  });
  const sc = {
    in_progress: "var(--accent)",
    checked_in: "var(--cyan)",
    scheduled: "var(--border2)",
    confirmed: "var(--purple)",
    completed: "var(--green)",
    cancelled: "var(--red)",
  };

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <style>{`.q-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}@media(max-width:600px){.q-stats{grid-template-columns:repeat(2,1fr)}}`}</style>
      <div className="q-stats">
        <Stat label="Total Today" value={todayA.length} icon="📋" />
        <Stat
          label="In Progress"
          value={todayA.filter((a) => a.status === "in_progress").length}
          icon="▶"
          color="var(--accent)"
        />
        <Stat
          label="Waiting"
          value={
            todayA.filter((a) =>
              ["checked_in", "scheduled", "confirmed"].includes(a.status),
            ).length
          }
          icon="⏳"
          color="var(--yellow)"
        />
        <Stat
          label="Completed"
          value={todayA.filter((a) => a.status === "completed").length}
          icon="✅"
          color="var(--green)"
        />
      </div>
      {Object.entries(byDoc).map(([docId, appts]) => {
        const doc = data.doctors.find((d) => d.id === docId);
        return (
          <Card key={docId}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 18 }}>🩺</span>
              <span style={{ fontWeight: 700 }}>{doc?.name}</span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>
                {doc?.spec}
              </span>
              <div style={{ flex: 1 }} />
              <Badge color="gray">{appts.length} patients</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {appts.map((a) => {
                const p = data.patients.find((x) => x.id === a.patientId);
                const isAct = a.status === "in_progress";
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 8,
                      background: isAct ? "rgba(88,166,255,.07)" : "var(--bg3)",
                      border: `1px solid ${isAct ? "rgba(88,166,255,.3)" : "var(--border)"}`,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: (sc[a.status] || "#888") + "22",
                        border: `2px solid ${sc[a.status] || "#888"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: sc[a.status],
                        flexShrink: 0,
                      }}
                    >
                      #{a.token}
                    </div>
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>
                        {p?.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {a.complaint} · {a.time}
                      </div>
                    </div>
                    <SBadge s={a.status} />
                    <div style={{ display: "flex", gap: 5 }}>
                      {a.status === "scheduled" && (
                        <Btn
                          size="xs"
                          color="ghost"
                          onClick={() => {
                            updateItem("appointments", a.id, {
                              status: "checked_in",
                            });
                            showToast("Checked in");
                          }}
                        >
                          Check In
                        </Btn>
                      )}
                      {a.status === "checked_in" && (
                        <Btn
                          size="xs"
                          color="accent"
                          onClick={() => {
                            updateItem("appointments", a.id, {
                              status: "in_progress",
                            });
                            showToast("Started");
                          }}
                        >
                          Start
                        </Btn>
                      )}
                      {a.status === "in_progress" && (
                        <Btn
                          size="xs"
                          color="green"
                          onClick={() => {
                            updateItem("appointments", a.id, {
                              status: "completed",
                            });
                            showToast("Completed ✓");
                          }}
                        >
                          Done ✓
                        </Btn>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ─── MEDICAL RECORDS ───────────────────────────────────────── */
function Records() {
  const { data, addItem, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: TODAY,
    complaint: "",
    diagnosis: "",
    treatment: "",
    vitals: { temp: "", bp: "", pulse: "", spo2: "", weight: "", height: "" },
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const FV = (k, v) =>
    setForm((f) => ({ ...f, vitals: { ...f.vitals, [k]: v } }));
  const sampleRecords = [
    {
      id: "mr1",
      patientId: "p1",
      doctorId: "doc1",
      date: TODAY,
      complaint: "Chest pain and shortness of breath",
      diagnosis: "Stable Angina, Hypertension Stage 2",
      treatment: "Atorvastatin 40mg OD, Metoprolol 25mg BD, Amlodipine 5mg OD.",
      vitals: {
        temp: 36.8,
        bp: "148/92",
        pulse: 78,
        spo2: 97,
        weight: 82,
        height: 175,
      },
    },
    {
      id: "mr2",
      patientId: "p2",
      doctorId: "doc2",
      date: TODAY,
      complaint: "Fever and persistent cough",
      diagnosis: "Community-Acquired Pneumonia (mild)",
      treatment: "Amoxicillin-Clavulanate 625mg TID × 7 days.",
      vitals: {
        temp: 38.2,
        bp: "118/76",
        pulse: 92,
        spo2: 96,
        weight: 62,
        height: 165,
      },
    },
    {
      id: "mr3",
      patientId: "p3",
      doctorId: "doc2",
      date: "2025-01-20",
      complaint: "Diabetes follow-up",
      diagnosis: "Type 2 Diabetes Mellitus — improving",
      treatment: "Metformin 1000mg BD, dietary counselling.",
      vitals: {
        temp: 36.5,
        bp: "132/84",
        pulse: 80,
        spo2: 99,
        weight: 96,
        height: 175,
      },
    },
  ];
  const allRecords = [...sampleRecords, ...(data.medicalRecords || [])];

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + New Record
        </Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Tbl
          cols={[
            {
              label: "Date",
              render: (r) => (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text3)",
                  }}
                >
                  {r.date}
                </span>
              ),
            },
            {
              label: "Patient",
              render: (r) => {
                const p = data.patients.find((x) => x.id === r.patientId);
                return (
                  <div>
                    <div style={{ fontWeight: 500 }}>{p?.name || "—"}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {p?.mrn}
                    </div>
                  </div>
                );
              },
            },
            {
              label: "Diagnosis",
              render: (r) => (
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  {r.diagnosis}
                </span>
              ),
              wrap: true,
            },
            {
              label: "Vitals",
              render: (r) =>
                r.vitals ? (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {r.vitals.temp && (
                      <Badge color="yellow">🌡{r.vitals.temp}°</Badge>
                    )}
                    {r.vitals.bp && <Badge color="red">❤{r.vitals.bp}</Badge>}
                    {r.vitals.spo2 && (
                      <Badge color="blue">💧{r.vitals.spo2}%</Badge>
                    )}
                  </div>
                ) : (
                  <span style={{ color: "var(--text3)" }}>—</span>
                ),
            },
          ]}
          rows={allRecords}
        />
      </Card>
      {showForm && (
        <Modal
          title="New Medical Record"
          onClose={() => setShowForm(false)}
          width={720}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.patientId || !form.diagnosis)
                    return showToast("Patient and diagnosis required", "error");
                  addItem("medicalRecords", form);
                  showToast("Record saved");
                  setShowForm(false);
                }}
              >
                Save Record
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <style>{`.rec-top{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}@media(max-width:520px){.rec-top{grid-template-columns:1fr}}.vitals-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}@media(max-width:600px){.vitals-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:380px){.vitals-grid{grid-template-columns:repeat(2,1fr)}}`}</style>
            <div className="rec-top">
              <Inp
                label="Patient"
                value={form.patientId}
                onChange={(v) => F("patientId", v)}
                required
                options={data.patients.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.mrn})`,
                }))}
              />
              <Inp
                label="Doctor"
                value={form.doctorId}
                onChange={(v) => F("doctorId", v)}
                options={data.doctors.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <Inp
                label="Date"
                value={form.date}
                onChange={(v) => F("date", v)}
                type="date"
              />
            </div>
            <div
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text2)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Vitals
              </div>
              <div className="vitals-grid">
                <Inp
                  label="Temp °C"
                  value={form.vitals.temp}
                  onChange={(v) => FV("temp", v)}
                  placeholder="36.8"
                />
                <Inp
                  label="BP"
                  value={form.vitals.bp}
                  onChange={(v) => FV("bp", v)}
                  placeholder="120/80"
                />
                <Inp
                  label="Pulse"
                  value={form.vitals.pulse}
                  onChange={(v) => FV("pulse", v)}
                  placeholder="72"
                />
                <Inp
                  label="SpO₂ %"
                  value={form.vitals.spo2}
                  onChange={(v) => FV("spo2", v)}
                  placeholder="98"
                />
                <Inp
                  label="Weight kg"
                  value={form.vitals.weight}
                  onChange={(v) => FV("weight", v)}
                  placeholder="70"
                />
                <Inp
                  label="Height cm"
                  value={form.vitals.height}
                  onChange={(v) => FV("height", v)}
                  placeholder="170"
                />
              </div>
            </div>
            <Inp
              label="Chief Complaint"
              value={form.complaint}
              onChange={(v) => F("complaint", v)}
              rows={2}
              placeholder="Patient complaint..."
            />
            <Inp
              label="Diagnosis"
              value={form.diagnosis}
              onChange={(v) => F("diagnosis", v)}
              required
              rows={2}
              placeholder="Clinical diagnosis..."
            />
            <Inp
              label="Treatment Plan"
              value={form.treatment}
              onChange={(v) => F("treatment", v)}
              rows={3}
              placeholder="Treatment, medications, follow-up..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── DOCTORS ───────────────────────────────────────────────── */
function Doctors() {
  const { data, addItem, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    spec: "",
    dept: "Cardiology",
    exp: "",
    fee: "",
    phone: "",
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const depts = [
    "Cardiology",
    "General Medicine",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Psychiatry",
  ];

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + Add Doctor
        </Btn>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 14,
        }}
      >
        {data.doctors.map((d) => {
          const cnt = data.appointments.filter(
            (a) => a.doctorId === d.id && a.date === TODAY,
          ).length;
          return (
            <Card key={d.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: d.available
                      ? "rgba(63,185,80,.12)"
                      : "var(--bg3)",
                    border: `2px solid ${d.available ? "var(--green)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🩺
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    {d.spec}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {d.dept}
                  </div>
                </div>
                <Badge color={d.available ? "green" : "gray"}>
                  {d.available ? "Active" : "Away"}
                </Badge>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  ["Exp", `${d.exp}y`],
                  ["Fee", `₦${d.fee}`],
                  ["Today", `${cnt} appts`],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      textAlign: "center",
                      background: "var(--bg3)",
                      borderRadius: 8,
                      padding: "7px 4px",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{ marginTop: 10, fontSize: 11, color: "var(--text3)" }}
              >
                📞 {d.phone}
              </div>
            </Card>
          );
        })}
      </div>
      {showForm && (
        <Modal
          title="Add Doctor"
          onClose={() => setShowForm(false)}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.name || !form.spec)
                    return showToast(
                      "Name and specialization required",
                      "error",
                    );
                  addItem("doctors", {
                    ...form,
                    exp: +form.exp,
                    fee: +form.fee,
                    available: true,
                  });
                  showToast("Doctor added");
                  setShowForm(false);
                }}
              >
                Add
              </Btn>
            </>
          }
        >
          <style>{`.doc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:420px){.doc-grid{grid-template-columns:1fr}}`}</style>
          <div className="doc-grid">
            <Inp
              label="Full Name"
              value={form.name}
              onChange={(v) => F("name", v)}
              required
            />
            <Inp
              label="Specialization"
              value={form.spec}
              onChange={(v) => F("spec", v)}
              required
            />
            <Inp
              label="Department"
              value={form.dept}
              onChange={(v) => F("dept", v)}
              options={depts}
            />
            <Inp
              label="Phone"
              value={form.phone}
              onChange={(v) => F("phone", v)}
            />
            <Inp
              label="Experience (yrs)"
              value={form.exp}
              onChange={(v) => F("exp", v)}
              type="number"
            />
            <Inp
              label="Fee (₦)"
              value={form.fee}
              onChange={(v) => F("fee", v)}
              type="number"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── BILLING ───────────────────────────────────────────────── */
function Billing() {
  const { data, addItem, updateItem, showToast } = useApp();
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [payInv, setPayInv] = useState(null);
  const [form, setForm] = useState({
    patientId: "",
    items: [{ desc: "", qty: 1, price: 0 }],
    tax: 10,
  });
  const [payAmt, setPayAmt] = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const filtered = data.invoices.filter(
    (i) => filter === "all" || i.status === filter,
  );
  const revenue = data.invoices.reduce((s, i) => s + i.paid, 0);
  const outstanding = data.invoices.reduce(
    (s, i) => s + Math.max(0, i.total - i.paid),
    0,
  );
  const calcTotal = () => {
    const sub = form.items.reduce((s, i) => s + +i.qty * +i.price, 0);
    const tax = (sub * +form.tax) / 100;
    return { sub, tax, total: sub + tax };
  };

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <style>{`.bill-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}@media(max-width:600px){.bill-stats{grid-template-columns:repeat(2,1fr)}}`}</style>
      <div className="bill-stats">
        <Stat
          label="Revenue"
          value={`₦${revenue.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
          color="var(--green)"
        />
        <Stat
          label="Outstanding"
          value={`₦${outstanding.toFixed(2)}`}
          icon="⏳"
          color="var(--yellow)"
        />
        <Stat
          label="Paid"
          value={data.invoices.filter((i) => i.status === "paid").length}
          icon="✅"
          color="var(--green)"
        />
        <Stat
          label="Overdue"
          value={data.invoices.filter((i) => i.status === "overdue").length}
          icon="🔴"
          color="var(--red)"
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            overflow: "auto",
            flex: 1,
            paddingBottom: 2,
          }}
        >
          {["all", "sent", "paid", "partially_paid", "overdue"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                background: filter === s ? "var(--a2)" : "var(--bg3)",
                color: filter === s ? "#fff" : "var(--text2)",
                border: "1px solid var(--border)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s === "all"
                ? "All"
                : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + Invoice
        </Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Tbl
          cols={[
            {
              label: "Invoice #",
              render: (r) => (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--accent)",
                  }}
                >
                  {r.number}
                </span>
              ),
            },
            {
              label: "Patient",
              render: (r) => {
                const p = data.patients.find((x) => x.id === r.patientId);
                return (
                  <div>
                    <div style={{ fontWeight: 500 }}>{p?.name || "—"}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {p?.mrn}
                    </div>
                  </div>
                );
              },
            },
            {
              label: "Total",
              render: (r) => (
                <span style={{ fontWeight: 600 }}>₦{r.total.toFixed(2)}</span>
              ),
            },
            {
              label: "Balance",
              render: (r) => {
                const b = r.total - r.paid;
                return (
                  <span
                    style={{
                      color: b > 0 ? "var(--yellow)" : "var(--green)",
                      fontWeight: 500,
                    }}
                  >
                    ₦{Math.max(0, b).toFixed(2)}
                  </span>
                );
              },
            },
            { label: "Status", render: (r) => <SBadge s={r.status} /> },
            {
              label: "Action",
              render: (r) =>
                r.status !== "paid" && r.status !== "cancelled" ? (
                  <Btn
                    size="xs"
                    color="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPayInv(r);
                      setPayAmt((r.total - r.paid).toFixed(2));
                    }}
                  >
                    Pay
                  </Btn>
                ) : null,
            },
          ]}
          rows={filtered}
        />
      </Card>
      {showForm && (
        <Modal
          title="Create Invoice"
          onClose={() => setShowForm(false)}
          width={640}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.patientId)
                    return showToast("Patient required", "error");
                  const { total } = calcTotal();
                  addItem("invoices", {
                    number: "INV-" + (10006 + data.invoices.length),
                    patientId: form.patientId,
                    status: "sent",
                    total,
                    paid: 0,
                    date: TODAY,
                  });
                  showToast("Invoice created");
                  setShowForm(false);
                }}
              >
                Create
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp
              label="Patient"
              value={form.patientId}
              onChange={(v) => F("patientId", v)}
              required
              options={data.patients.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.mrn})`,
              }))}
            />
            <div
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text2)",
                  marginBottom: 8,
                }}
              >
                LINE ITEMS
              </div>
              {form.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 56px 76px 28px",
                    gap: 7,
                    marginBottom: 7,
                    alignItems: "end",
                  }}
                >
                  <Inp
                    label={i === 0 ? "Description" : ""}
                    value={item.desc}
                    onChange={(v) =>
                      setForm((f) => {
                        const it = [...f.items];
                        it[i] = { ...it[i], desc: v };
                        return { ...f, items: it };
                      })
                    }
                    placeholder="Service..."
                  />
                  <Inp
                    label={i === 0 ? "Qty" : ""}
                    value={item.qty}
                    onChange={(v) =>
                      setForm((f) => {
                        const it = [...f.items];
                        it[i] = { ...it[i], qty: +v };
                        return { ...f, items: it };
                      })
                    }
                    type="number"
                  />
                  <Inp
                    label={i === 0 ? "Price (₦)" : ""}
                    value={item.price}
                    onChange={(v) =>
                      setForm((f) => {
                        const it = [...f.items];
                        it[i] = { ...it[i], price: +v };
                        return { ...f, items: it };
                      })
                    }
                    type="number"
                  />
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        items: f.items.filter((_, j) => j !== i),
                      }))
                    }
                    style={{
                      background: "rgba(248,81,73,.1)",
                      color: "var(--red)",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 8px",
                      cursor: "pointer",
                      marginTop: i === 0 ? 18 : 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <Btn
                size="xs"
                color="ghost"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    items: [...f.items, { desc: "", qty: 1, price: 0 }],
                  }))
                }
              >
                + Add Item
              </Btn>
            </div>
            {(() => {
              const { sub, tax, total } = calcTotal();
              return (
                <div
                  style={{
                    textAlign: "right",
                    background: "var(--bg4)",
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    Subtotal: ₦{sub.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    Tax (10%): ₦{tax.toFixed(2)}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginTop: 4 }}>
                    Total: ₦{total.toFixed(2)}
                  </div>
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
      {payInv && (
        <Modal
          title={`Pay — ${payInv.number}`}
          onClose={() => setPayInv(null)}
          width={380}
          footer={
            <>
              <Btn color="ghost" onClick={() => setPayInv(null)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  const amt = Math.min(+payAmt, payInv.total - payInv.paid);
                  const np = payInv.paid + amt;
                  updateItem("invoices", payInv.id, {
                    paid: np,
                    status: np >= payInv.total ? "paid" : "partially_paid",
                  });
                  showToast("Payment recorded");
                  setPayInv(null);
                }}
              >
                Confirm
              </Btn>
            </>
          }
        >
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 14,
            }}
          >
            {[
              ["Total", `₦${payInv.total.toFixed(2)}`],
              ["Paid", `₦${payInv.paid.toFixed(2)}`],
              ["Balance", `₦${(payInv.total - payInv.paid).toFixed(2)}`],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp
              label="Amount (₦)"
              value={payAmt}
              onChange={setPayAmt}
              type="number"
            />
            <Inp
              label="Method"
              value={payMethod}
              onChange={setPayMethod}
              options={["cash", "card", "bank_transfer", "insurance"]}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── PHARMACY ──────────────────────────────────────────────── */
function Pharmacy() {
  const { data, updateItem, showToast } = useApp();
  const [tab, setTab] = useState("medicines");
  const [search, setSearch] = useState("");
  const lowStock = data.medicines.filter((m) => m.stock <= m.reorder);
  const filtered = data.medicines.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.generic.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {lowStock.length > 0 && (
        <div
          style={{
            background: "rgba(210,153,34,.08)",
            border: "1px solid rgba(210,153,34,.3)",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 13,
            color: "var(--yellow)",
          }}
        >
          ⚠️ {lowStock.length} medicines low on stock:{" "}
          {lowStock.map((m) => m.name).join(", ")}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {["medicines", "prescriptions"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: tab === t ? "var(--a2)" : "var(--bg3)",
              color: tab === t ? "#fff" : "var(--text2)",
              border: "1px solid var(--border)",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        {tab === "medicines" && (
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text3)",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ paddingLeft: 32, width: 180 }}
            />
          </div>
        )}
      </div>
      {tab === "medicines" && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Tbl
            cols={[
              {
                label: "Medicine",
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {r.generic} · {r.cat}
                    </div>
                  </div>
                ),
              },
              {
                label: "Price",
                render: (r) => (
                  <span style={{ fontFamily: "var(--mono)" }}>
                    ₦{r.price.toFixed(2)}
                  </span>
                ),
              },
              {
                label: "Stock",
                render: (r) => (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          r.stock <= r.reorder
                            ? "var(--red)"
                            : r.stock <= r.reorder * 2
                              ? "var(--yellow)"
                              : "var(--green)",
                      }}
                    >
                      {r.stock}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>
                      /{r.reorder}
                    </span>
                  </div>
                ),
              },
              {
                label: "Expiry",
                render: (r) => (
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color:
                        new Date(r.expiry) < new Date()
                          ? "var(--red)"
                          : "var(--text2)",
                    }}
                  >
                    {r.expiry}
                  </span>
                ),
              },
              {
                label: "Restock",
                render: (r) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn
                      size="xs"
                      color="ghost"
                      onClick={() => {
                        updateItem("medicines", r.id, { stock: r.stock + 100 });
                        showToast("+100 added");
                      }}
                    >
                      +100
                    </Btn>
                    <Btn
                      size="xs"
                      color="ghost"
                      onClick={() => {
                        updateItem("medicines", r.id, { stock: r.stock + 500 });
                        showToast("+500 added");
                      }}
                    >
                      +500
                    </Btn>
                  </div>
                ),
              },
            ]}
            rows={filtered}
          />
        </Card>
      )}
      {tab === "prescriptions" && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Tbl
            cols={[
              {
                label: "Date",
                render: (r) => (
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--text3)",
                    }}
                  >
                    {r.date}
                  </span>
                ),
              },
              {
                label: "Patient",
                render: (r) => {
                  const p = data.patients.find((x) => x.id === r.patientId);
                  return (
                    <div>
                      <div style={{ fontWeight: 500 }}>{p?.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {p?.mrn}
                      </div>
                    </div>
                  );
                },
              },
              {
                label: "Medicines",
                render: (r) => (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {r.items?.map((it, i) => (
                      <Badge key={i} color="cyan">
                        {it.med} ×{it.qty}
                      </Badge>
                    ))}
                  </div>
                ),
                wrap: true,
              },
              { label: "Status", render: (r) => <SBadge s={r.status} /> },
              {
                label: "Action",
                render: (r) =>
                  r.status === "pending" ? (
                    <Btn
                      size="xs"
                      color="green"
                      onClick={() => {
                        updateItem("prescriptions", r.id, {
                          status: "dispensed",
                        });
                        showToast("Dispensed");
                      }}
                    >
                      Dispense
                    </Btn>
                  ) : null,
              },
            ]}
            rows={
              data.prescriptions || [
                {
                  id: "rx1",
                  patientId: "p1",
                  date: TODAY,
                  status: "dispensed",
                  items: [
                    { med: "Atorvastatin 40mg", qty: 90 },
                    { med: "Metoprolol 25mg", qty: 180 },
                  ],
                },
                {
                  id: "rx2",
                  patientId: "p2",
                  date: TODAY,
                  status: "pending",
                  items: [
                    { med: "Amoxicillin 500mg", qty: 21 },
                    { med: "Paracetamol 500mg", qty: 20 },
                  ],
                },
              ]
            }
          />
        </Card>
      )}
    </div>
  );
}

/* ─── LABORATORY ────────────────────────────────────────────── */
function Laboratory() {
  const { data, addItem, updateItem, showToast } = useApp();
  const [tab, setTab] = useState("orders");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    tests: [],
    priority: "normal",
    notes: "",
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const allTests = [
    "CBC",
    "FBG",
    "HBA1C",
    "LIPID",
    "LFT",
    "KFT",
    "TSH",
    "ECG",
    "CXR",
    "UA",
    "ECHO",
    "MRI-B",
  ];
  const toggle = (code) =>
    setForm((f) => ({
      ...f,
      tests: f.tests.includes(code)
        ? f.tests.filter((x) => x !== code)
        : [...f.tests, code],
    }));
  const orders = [...data.labOrders, ...(data.addedLabOrders || [])];

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {["orders", "catalog"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: tab === t ? "var(--a2)" : "var(--bg3)",
              color: tab === t ? "#fff" : "var(--text2)",
              border: "1px solid var(--border)",
            }}
          >
            {t === "orders" ? "Lab Orders" : "Test Catalog"}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {tab === "orders" && (
          <Btn color="green" onClick={() => setShowForm(true)}>
            + New Order
          </Btn>
        )}
      </div>
      {tab === "orders" && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Tbl
            cols={[
              {
                label: "Date",
                render: (r) => (
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                      color: "var(--text3)",
                    }}
                  >
                    {r.date}
                  </span>
                ),
              },
              {
                label: "Patient",
                render: (r) => {
                  const p = data.patients.find((x) => x.id === r.patientId);
                  return (
                    <div>
                      <div style={{ fontWeight: 500 }}>{p?.name || "—"}</div>
                    </div>
                  );
                },
              },
              {
                label: "Tests",
                render: (r) => (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {r.tests.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: t.abnormal
                            ? "rgba(248,81,73,.12)"
                            : "var(--bg3)",
                          color: t.abnormal ? "var(--red)" : "var(--text2)",
                          border: `1px solid ${t.abnormal ? "rgba(248,81,73,.3)" : "var(--border)"}`,
                        }}
                      >
                        {t.code}
                        {t.result ? `: ${t.result}` : ""}
                      </span>
                    ))}
                  </div>
                ),
                wrap: true,
              },
              { label: "Priority", render: (r) => <SBadge s={r.priority} /> },
              { label: "Status", render: (r) => <SBadge s={r.status} /> },
              {
                label: "Action",
                render: (r) =>
                  r.status === "ordered" ? (
                    <Btn
                      size="xs"
                      color="accent"
                      onClick={() => {
                        updateItem("labOrders", r.id, { status: "processing" });
                        showToast("Processing started");
                      }}
                    >
                      Process
                    </Btn>
                  ) : r.status === "processing" ? (
                    <Btn
                      size="xs"
                      color="green"
                      onClick={() => {
                        updateItem("labOrders", r.id, { status: "completed" });
                        showToast("Results ready");
                      }}
                    >
                      Complete
                    </Btn>
                  ) : null,
              },
            ]}
            rows={orders}
          />
        </Card>
      )}
      {tab === "catalog" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 12,
          }}
        >
          {[
            {
              code: "CBC",
              name: "Complete Blood Count",
              cat: "Hematology",
              price: 25,
              hours: 4,
              normal: "RBC 4.5-5.5M, WBC 4-11K/μL",
            },
            {
              code: "FBG",
              name: "Blood Glucose Fasting",
              cat: "Biochemistry",
              price: 15,
              hours: 2,
              normal: "70-100 mg/dL",
            },
            {
              code: "HBA1C",
              name: "HbA1c",
              cat: "Biochemistry",
              price: 35,
              hours: 4,
              normal: "<5.7%",
            },
            {
              code: "LIPID",
              name: "Lipid Profile",
              cat: "Biochemistry",
              price: 45,
              hours: 6,
              normal: "Chol <200, LDL <100 mg/dL",
            },
            {
              code: "LFT",
              name: "Liver Function Test",
              cat: "Biochemistry",
              price: 55,
              hours: 6,
              normal: "ALT 7-40 U/L",
            },
            {
              code: "KFT",
              name: "Kidney Function Test",
              cat: "Biochemistry",
              price: 50,
              hours: 6,
              normal: "Creatinine 0.6-1.2 mg/dL",
            },
            {
              code: "TSH",
              name: "Thyroid (TSH)",
              cat: "Endocrinology",
              price: 40,
              hours: 8,
              normal: "0.4-4.0 mIU/L",
            },
            {
              code: "ECG",
              name: "ECG 12-Lead",
              cat: "Cardiology",
              price: 30,
              hours: 1,
              normal: "Normal sinus rhythm",
            },
            {
              code: "CXR",
              name: "Chest X-Ray",
              cat: "Radiology",
              price: 60,
              hours: 2,
              normal: "Clear lung fields",
            },
            {
              code: "UA",
              name: "Urine Analysis",
              cat: "Microbiology",
              price: 20,
              hours: 3,
              normal: "See report",
            },
          ].map((t) => (
            <Card key={t.code}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {t.code}
                  </div>
                </div>
                <Badge color="purple">₦{t.price}</Badge>
              </div>
              <div
                style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}
              >
                🏷 {t.cat} · ⏱ {t.hours}h TAT
              </div>
              <div
                style={{
                  fontSize: 11,
                  background: "var(--bg3)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: "var(--text2)",
                }}
              >
                {t.normal}
              </div>
            </Card>
          ))}
        </div>
      )}
      {showForm && (
        <Modal
          title="New Lab Order"
          onClose={() => setShowForm(false)}
          width={580}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.patientId || !form.tests.length)
                    return showToast("Patient and tests required", "error");
                  addItem("labOrders", {
                    ...form,
                    date: TODAY,
                    status: "ordered",
                    doctor:
                      data.doctors.find((d) => d.id === form.doctorId)?.name ||
                      "",
                    tests: form.tests.map((c) => ({
                      code: c,
                      result: null,
                      abnormal: false,
                    })),
                  });
                  showToast("Lab order created");
                  setShowForm(false);
                }}
              >
                Create
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <style>{`.lab-top{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}@media(max-width:520px){.lab-top{grid-template-columns:1fr}}.test-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}@media(max-width:400px){.test-grid{grid-template-columns:1fr}}`}</style>
            <div className="lab-top">
              <Inp
                label="Patient"
                value={form.patientId}
                onChange={(v) => F("patientId", v)}
                required
                options={data.patients.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.mrn})`,
                }))}
              />
              <Inp
                label="Doctor"
                value={form.doctorId}
                onChange={(v) => F("doctorId", v)}
                options={data.doctors.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <Inp
                label="Priority"
                value={form.priority}
                onChange={(v) => F("priority", v)}
                options={["normal", "urgent", "stat"]}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  fontWeight: 500,
                  marginBottom: 7,
                }}
              >
                Select Tests <span style={{ color: "var(--red)" }}>*</span>
              </div>
              <div className="test-grid">
                {allTests.map((code) => (
                  <label
                    key={code}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 10px",
                      borderRadius: 8,
                      background: form.tests.includes(code)
                        ? "rgba(88,166,255,.1)"
                        : "var(--bg3)",
                      border: `1px solid ${form.tests.includes(code) ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.tests.includes(code)}
                      onChange={() => toggle(code)}
                      style={{ width: "auto", accentColor: "var(--accent)" }}
                    />
                    {code}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── STAFF ─────────────────────────────────────────────────── */
function Staff() {
  const { data, addItem, updateItem, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    dept: "",
    email: "",
    phone: "",
  });
  const F = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      style={{
        padding: 16,
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <style>{`.staff-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:480px){.staff-stats{grid-template-columns:repeat(2,1fr)}}`}</style>
      <div className="staff-stats">
        <Stat label="Total Staff" value={data.staff.length} icon="👥" />
        <Stat
          label="Active"
          value={data.staff.filter((s) => s.active).length}
          icon="✅"
          color="var(--green)"
        />
        <Stat label="Departments" value={6} icon="🏥" color="var(--purple)" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn color="green" onClick={() => setShowForm(true)}>
          + Add Staff
        </Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Tbl
          cols={[
            {
              label: "Name",
              render: (r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Avatar name={r.name} size={28} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {r.empId}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: "Role",
              render: (r) => <Badge color="purple">{r.role}</Badge>,
            },
            {
              label: "Dept",
              render: (r) => <span style={{ fontSize: 12 }}>{r.dept}</span>,
            },
            {
              label: "Status",
              render: (r) => (
                <Badge color={r.active ? "green" : "red"}>
                  {r.active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              label: "Action",
              render: (r) => (
                <Btn
                  size="xs"
                  color={r.active ? "danger" : "ghost"}
                  onClick={() => {
                    updateItem("staff", r.id, { active: !r.active });
                    showToast(
                      `${r.name} ${r.active ? "deactivated" : "activated"}`,
                    );
                  }}
                >
                  {r.active ? "Deactivate" : "Activate"}
                </Btn>
              ),
            },
          ]}
          rows={data.staff}
        />
      </Card>
      {showForm && (
        <Modal
          title="Add Staff"
          onClose={() => setShowForm(false)}
          width={460}
          footer={
            <>
              <Btn color="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
              <Btn
                color="green"
                onClick={() => {
                  if (!form.name || !form.role)
                    return showToast("Name and role required", "error");
                  const empId =
                    "EMP-" +
                    (data.staff.length + 6).toString().padStart(3, "0");
                  addItem("staff", { ...form, empId, active: true });
                  showToast("Staff added");
                  setShowForm(false);
                }}
              >
                Add
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp
              label="Full Name"
              value={form.name}
              onChange={(v) => F("name", v)}
              required
            />
            <Inp
              label="Role"
              value={form.role}
              onChange={(v) => F("role", v)}
              required
              options={[
                "Receptionist",
                "Nurse",
                "Pharmacist",
                "Lab Technician",
                "Admin",
                "Radiographer",
                "IT Support",
                "Security",
              ]}
            />
            <Inp
              label="Department"
              value={form.dept}
              onChange={(v) => F("dept", v)}
              options={[
                "Cardiology",
                "General Medicine",
                "Neurology",
                "Pediatrics",
                "Pharmacy",
                "Laboratory",
                "Orthopedics",
              ]}
            />
            <Inp
              label="Email"
              value={form.email}
              onChange={(v) => F("email", v)}
              type="email"
            />
            <Inp
              label="Phone"
              value={form.phone}
              onChange={(v) => F("phone", v)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── APP SHELL ─────────────────────────────────────────────── */
const PAGES = {
  dashboard: Dashboard,
  patients: Patients,
  appointments: Appointments,
  queue: Queue,
  records: Records,
  doctors: Doctors,
  billing: Billing,
  pharmacy: Pharmacy,
  laboratory: Laboratory,
  staff: Staff,
};

function AppInner() {
  const { page, sidebarOpen, setSidebarOpen } = useApp();
  const P = PAGES[page] || Dashboard;
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 52,
            padding: "0 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg2)",
            flexShrink: 0,
          }}
        >
          {/* Hamburger — shown only on mobile via CSS */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              color: "var(--text2)",
              fontSize: 20,
              lineHeight: 1,
              padding: "4px 6px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ☰
          </button>
          <h1
            style={{
              fontSize: 15,
              fontWeight: 700,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {TITLES[page] || "Clinivanta"}
          </h1>
          <Badge color="blue">ADMIN</Badge>
          <span
            style={{
              fontSize: 11,
              color: "var(--text3)",
              fontFamily: "var(--mono)",
              display: "none",
              flexShrink: 0,
            }}
            className="date-label"
          >
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--text3)",
              fontFamily: "var(--mono)",
              flexShrink: 0,
            }}
            style2="display:none"
            className="date-label-full"
          >
            {new Date().toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <style>{`@media(min-width:600px){.date-label-full{display:block!important}}`}</style>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <P />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider>
      <AppInner />
    </Provider>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";

function Settings() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    addToast("Settings saved successfully", "success");
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-kicker">Configuration</p>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences.</p>
        </div>
      </div>

      <section className="panel" style={{ padding: 24 }}>
        <h2 className="panel-title" style={{ marginBottom: 20 }}>Account</h2>

        <div className="form-field" style={{ marginBottom: 18 }}>
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-field" style={{ marginBottom: 18 }}>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: "var(--space-4)" }}>
        <h2 className="panel-title" style={{ marginBottom: 12 }}>Preferences</h2>
        <p className="panel-text" style={{ marginBottom: 16 }}>
          Theme and display options coming soon.
        </p>
        <div className="list-card__meta">
          <span className="chip">Color: Slate Blue</span>
          <span className="chip">Layout: Sidebar</span>
        </div>
      </section>
    </div>
  );
}

export default Settings;

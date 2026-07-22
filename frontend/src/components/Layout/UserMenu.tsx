// src/components/Layout/UserMenu.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../modules/auth/context/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        title={user?.name}
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-pill)",
          background: isOpen ? "var(--paper)" : "transparent",
          border: "1.5px solid var(--paper)",
          color: isOpen ? "var(--ink)" : "var(--paper)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <User size={17} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "44px",
            right: 0,
            background: "white",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
            minWidth: "180px",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--line)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {user?.name}
          </div>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              fontSize: "0.85rem",
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            <Settings size={15} />
            Configurações
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "var(--paprika)",
              textAlign: "left",
            }}
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
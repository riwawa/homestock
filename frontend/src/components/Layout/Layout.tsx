// src/components/Layout/Layout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { Boxes, ShoppingCart, Receipt, TrendingUp } from "lucide-react";
import { useAutoSelectCurrentHouse } from "../../modules/house/hooks/useAutoSelectCurrentHouse";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
  { to: "/inventory", label: "Estoque", icon: Boxes },
  { to: "/shopping-list", label: "Lista de Compras", icon: ShoppingCart },
  { to: "/purchase", label: "Compras", icon: Receipt },
  { to: "/trends", label: "Tendências", icon: TrendingUp },
];

export function Layout() {
  useAutoSelectCurrentHouse();
  const location = useLocation();

  return (
    <div>
      <nav
        style={{
          background: "var(--ink)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: isActive ? "var(--ink)" : "var(--paper)",
                  background: isActive ? "var(--paper)" : "transparent",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <UserMenu />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
import { Link, Outlet } from "react-router-dom";
import { useAutoSelectCurrentHouse } from "../../modules/house/hooks/useAutoSelectCurrentHouse";
import { useAuth } from "../../modules/auth/context/AuthContext";

export function Layout() {
  useAutoSelectCurrentHouse();
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/inventory">Estoque</Link>
        {" | "}
        <Link to="/shopping-list">Lista de Compras</Link>
        {" | "}
        <Link to="/purchase">Compras</Link>
        {" | "}
        <Link to="/settings">Configurações</Link>
        {" — "}
        {user?.name}
        {" "}
        <button type="button" onClick={logout}>Sair</button>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
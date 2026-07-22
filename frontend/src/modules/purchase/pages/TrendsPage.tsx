import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";
import { useCurrentHouse } from "../../house/context/CurrentHouseContext";
import { useMonthlySpend } from "../hooks/useMonthlySpend";
import { useSpendByCategory } from "../hooks/useSpendByCategory";
import { useTopProducts } from "../hooks/useTopProducts";
import { usePriceTrend } from "../hooks/usePriceTrend";
import { useProducts } from "../../product/hooks/useProducts";
import { getErrorMessage } from "../../../api/axios";

const MONTHS = 3;
const COLORS = ["#4f46e5", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function TrendsPage() {
  const { currentHouseId } = useCurrentHouse();

  if (!currentHouseId) {
    return (
      <div>
        <p>Nenhuma casa selecionada ainda.</p>
        <Link to="/houses">Ir para Casas</Link>
      </div>
    );
  }

  return <TrendsContent houseId={currentHouseId} />;
}

function TrendsContent({ houseId }: { houseId: string }) {
  return (
    <div>
      <h1>Tendências (últimos {MONTHS} meses)</h1>
      <MonthlySpendChart houseId={houseId} />
      <CategorySpendChart houseId={houseId} />
      <TopProductsList houseId={houseId} />
      <PriceTrendChart houseId={houseId} />
    </div>
  );
}

function MonthlySpendChart({ houseId }: { houseId: string }) {
  const { data, isLoading, isError, error } = useMonthlySpend(houseId, MONTHS);

  return (
    <section>
      <h2>Gasto mensal</h2>
      {isLoading && <p>Carregando...</p>}
      {isError && <p>Erro: {getErrorMessage(error)}</p>}
      {data && data.length === 0 && <p>Nenhuma compra no período.</p>}
      {data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

function CategorySpendChart({ houseId }: { houseId: string }) {
  const { data, isLoading, isError, error } = useSpendByCategory(houseId, MONTHS);

  return (
    <section>
      <h2>Gasto por categoria</h2>
      {isLoading && <p>Carregando...</p>}
      {isError && <p>Erro: {getErrorMessage(error)}</p>}
      {data && data.length === 0 && <p>Nenhuma compra no período.</p>}
      {data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.category}: ${formatCurrency(entry.total)}`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

function TopProductsList({ houseId }: { houseId: string }) {
  const { data, isLoading, isError, error } = useTopProducts(houseId, MONTHS, 5);

  return (
    <section>
      <h2>Produtos mais comprados</h2>
      {isLoading && <p>Carregando...</p>}
      {isError && <p>Erro: {getErrorMessage(error)}</p>}
      {data && data.length === 0 && <p>Nenhuma compra no período.</p>}
      {data && data.length > 0 && (
        <ol>
          {data.map((product) => (
            <li key={product.productId}>
              {product.productName} — {product.totalQuantity} unidade(s), total {formatCurrency(product.totalSpent)}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function PriceTrendChart({ houseId }: { houseId: string }) {
  const [productId, setProductId] = useState("");
  const { data: products } = useProducts();
  const { data, isLoading, isError, error } = usePriceTrend(houseId, productId, MONTHS);

  const activeProducts = products?.filter((p) => p.active) ?? [];

  const chartData = data?.map((point) => ({
    date: new Date(point.purchaseDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    price: point.unitPrice,
  }));

  return (
    <section>
      <h2>Variação de preço</h2>
      <label htmlFor="trendProduct">Produto</label>
      <select
        id="trendProduct"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Selecione um produto</option>
        {activeProducts.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      {productId && isLoading && <p>Carregando...</p>}
      {productId && isError && <p>Erro: {getErrorMessage(error)}</p>}
      {productId && chartData && chartData.length === 0 && (
        <p>Nenhuma compra desse produto no período.</p>
      )}
      {productId && chartData && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line type="monotone" dataKey="price" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
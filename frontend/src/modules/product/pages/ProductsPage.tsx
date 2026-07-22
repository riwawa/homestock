// modules/product/pages/ProductsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { getErrorMessage } from "../../../api/axios";
import { ProductCreateModal } from "../components/ProductCreateModal";

export function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) return <p>Carregando produtos...</p>;
  if (isError) return <p>Erro ao carregar produtos: {getErrorMessage(error)}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Produtos</h1>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          + Novo produto
        </button>
      </div>

      {!products || products.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="item-row">
              <Link to={`/products/${product.id}`}>
                {product.name}{" "}
                {!product.active && <span className="chip chip-out">inativo</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isCreateOpen && <ProductCreateModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}
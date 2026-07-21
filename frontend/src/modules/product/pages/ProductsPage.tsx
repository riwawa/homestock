import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { getErrorMessage } from "../../../api/axios";

export function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) return <p>Carregando produtos...</p>;
  if (isError) return <p>Erro ao carregar produtos: {getErrorMessage(error)}</p>;

  return (
    <div>
      <h1>Produtos</h1>
      <Link to="/products/new">+ Novo produto</Link>

      {!products || products.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`}>
                {product.name} {!product.active && "(inativo)"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
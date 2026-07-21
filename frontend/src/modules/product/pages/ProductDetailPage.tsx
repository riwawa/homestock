// modules/product/pages/ProductDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error } = useProduct(id ?? "");
  const deleteProduct = useDeleteProduct();

  if (isLoading) return <p>Carregando produto...</p>;
  if (isError) return <p>Erro ao carregar produto: {getErrorMessage(error)}</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  const handleDeactivate = () => {
    if (!id) return;
    deleteProduct.mutate(id);
  };

  return (
    <div>
      <Link to="/products">← Voltar</Link>
      <h1>
        {product.name} {!product.active && "(inativo)"}
      </h1>

      <dl>
        <dt>Categoria</dt>
        <dd>{product.category ?? "Não informada"}</dd>

        <dt>Unidade de medida</dt>
        <dd>{product.unitOfMeasure ?? "Não informada"}</dd>

        <dt>Quantidade mínima</dt>
        <dd>{product.minimumQuantity}</dd>
      </dl>

      {product.active && (
        <button onClick={handleDeactivate} disabled={deleteProduct.isPending}>
          {deleteProduct.isPending ? "Desativando..." : "Desativar produto"}
        </button>
      )}

      {deleteProduct.isError && (
        <p>Erro ao desativar: {deleteProduct.error.message}</p>
      )}

      <Link to={`/products/${id}/edit`}>Editar produto</Link>
    </div>
  );
}
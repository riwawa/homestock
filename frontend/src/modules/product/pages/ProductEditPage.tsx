// modules/product/pages/ProductEditPage.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { productCreateSchema, type ProductCreateRequest } from "../schemas/product.schema";
import { useProduct } from "../hooks/useProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id ?? "");
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductCreateRequest>({
    resolver: zodResolver(productCreateSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category ?? "",
        unitOfMeasure: product.unitOfMeasure ?? "",
        minimumQuantity: product.minimumQuantity,
      });
    }
  }, [product, reset]);

  if (isLoading) return <p>Carregando produto...</p>;
  if (isError) return <p>Erro ao carregar produto: {getErrorMessage(error)}</p>;
  if (!product || !id) return <p>Produto não encontrado.</p>;

  const onSubmit = (data: ProductCreateRequest) => {
    updateProduct.mutate(
      { id, payload: data },
      {
        onSuccess: () => {
          navigate(`/products/${id}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nome do produto</label>
        <input id="name" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="category">Categoria</label>
        <input id="category" {...register("category")} />
      </div>

      <div>
        <label htmlFor="unitOfMeasure">Unidade de medida</label>
        <input id="unitOfMeasure" {...register("unitOfMeasure")} />
      </div>

      <div>
        <label htmlFor="minimumQuantity">Quantidade mínima</label>
        <input
          id="minimumQuantity"
          type="number"
          {...register("minimumQuantity")}
        />
        {errors.minimumQuantity && <p>{errors.minimumQuantity.message}</p>}
      </div>

      {updateProduct.isError && (
        <p>Erro ao salvar: {updateProduct.error.message}</p>
      )}

      <button type="submit" disabled={isSubmitting || updateProduct.isPending}>
        {updateProduct.isPending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
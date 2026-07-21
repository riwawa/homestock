import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { productCreateSchema, type ProductCreateRequest } from "../schemas/product.schema";
import { useCreateProduct } from "../hooks/useCreateProduct";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductCreateRequest>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      category: "",
      unitOfMeasure: "",
      minimumQuantity: 0,
    },
  });

  const onSubmit = (data: ProductCreateRequest) => {
    createProduct.mutate(data, {
      onSuccess: (product) => {
        navigate(`/products/${product.id}`);
      },
    });
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

      {createProduct.isError && (
        <p>Erro ao criar produto: {createProduct.error.message}</p>
      )}

      <button type="submit" disabled={isSubmitting || createProduct.isPending}>
        {createProduct.isPending ? "Criando..." : "Criar produto"}
      </button>
    </form>
  );
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/Modal/Modal";
import { productCreateSchema, type ProductCreateRequest } from "../schemas/product.schema";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { getErrorMessage } from "../../../api/axios";

type Props = { onClose: () => void };

export function ProductCreateModal({ onClose }: Props) {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductCreateRequest>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: { name: "", category: "", unitOfMeasure: "", minimumQuantity: 0 },
  });

  const onSubmit = (data: ProductCreateRequest) => {
    createProduct.mutate(data, {
      onSuccess: (product) => {
        onClose();
        navigate(`/products/${product.id}`);
      },
    });
  };

  return (
    <Modal
      title="Criar produto"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="product-create-form"
            className="btn btn-primary"
            disabled={isSubmitting || createProduct.isPending}
          >
            {createProduct.isPending ? "Criando..." : "Criar produto"}
          </button>
        </>
      }
    >
      <form id="product-create-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="name">Nome do produto</label>
          <input id="name" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="category">Categoria</label>
          <input id="category" {...register("category")} />
        </div>

        <div className="field">
          <label htmlFor="unitOfMeasure">Unidade de medida</label>
          <input id="unitOfMeasure" {...register("unitOfMeasure")} />
        </div>

        <div className="field">
          <label htmlFor="minimumQuantity">Quantidade mínima</label>
          <input id="minimumQuantity" type="number" {...register("minimumQuantity")} />
          {errors.minimumQuantity && (
            <p className="field-error">{errors.minimumQuantity.message}</p>
          )}
        </div>

        {createProduct.isError && (
          <p className="field-error">Erro: {getErrorMessage(createProduct.error)}</p>
        )}
      </form>
    </Modal>
  );
}
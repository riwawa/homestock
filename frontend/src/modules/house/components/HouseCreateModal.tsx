import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/Modal/Modal";
import {
  houseFormSchema,
  type HouseFormValues,
  type HouseCreateRequest,
} from "../schemas/house.schemas";
import { useCreateHouse } from "../hooks/useCreateHouse";
import { getErrorMessage } from "../../../api/axios";

type Props = { onClose: () => void };

export function HouseCreateModal({ onClose }: Props) {
  const navigate = useNavigate();
  const createHouse = useCreateHouse();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HouseFormValues>({
    resolver: zodResolver(houseFormSchema),
    defaultValues: { name: "", residents: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "residents" });

  const onSubmit = (data: HouseFormValues) => {
    const payload: HouseCreateRequest = {
      name: data.name,
      residents: data.residents.map((r) => r.name),
    };

    createHouse.mutate(payload, {
      onSuccess: (house) => {
        onClose();
        navigate(`/houses/${house.id}`);
      },
    });
  };

  return (
    <Modal
      title="Criar casa"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="house-create-form"
            className="btn btn-primary"
            disabled={isSubmitting || createHouse.isPending}
          >
            {createHouse.isPending ? "Criando..." : "Criar casa"}
          </button>
        </>
      }
    >
      <form id="house-create-form" onSubmit={handleSubmit(onSubmit)}>
        <p className="field-section-title">Detalhes</p>

        <div className="field">
          <label htmlFor="name">Nome da casa</label>
          <input id="name" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <p className="field-section-title">Moradores</p>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="field"
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <input
              {...register(`residents.${index}.name` as const)}
              aria-label={`Morador ${index + 1}`}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
              Remover
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={() => append({ name: "" })}>
          + Adicionar morador
        </button>

        {createHouse.isError && (
          <p className="field-error">Erro: {getErrorMessage(createHouse.error)}</p>
        )}
      </form>
    </Modal>
  );
}
// modules/house/pages/HouseCreatePage.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { houseFormSchema, type HouseFormValues, type HouseCreateRequest } from "../schemas/house.schemas";
import { useCreateHouse } from "../hooks/useCreateHouse";
export function HouseCreatePage() {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "residents",
  });

  const onSubmit = (data: HouseFormValues) => {
    const payload: HouseCreateRequest = {
      name: data.name,
      residents: data.residents.map((r) => r.name),
    };

    createHouse.mutate(payload, {
      onSuccess: (house) => {
        navigate(`/houses/${house.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nome da casa</label>
        <input id="name" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label>Moradores</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`residents.${index}.name` as const)}
              aria-label={`Morador ${index + 1}`}
            />
            <button type="button" onClick={() => remove(index)}>
              Remover
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })}>
          + Adicionar morador
        </button>
      </div>

      {createHouse.isError && (
        <p>Erro ao criar casa: {createHouse.error.message}</p>
      )}

      <button type="submit" disabled={isSubmitting || createHouse.isPending}>
        {createHouse.isPending ? "Criando..." : "Criar casa"}
      </button>
    </form>
  );
}
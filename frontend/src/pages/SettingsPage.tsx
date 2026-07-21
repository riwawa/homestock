import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useHouses } from "../modules/house/hooks/useHouses";
import { useCurrentHouse } from "../modules/house/context/CurrentHouseContext";
import { useHouseMembers } from "../modules/house/hooks/useHouseMembers";
import { useInviteMember } from "../modules/house/hooks/useInviteMember";
import {
  inviteMemberSchema,
  type InviteMemberRequest,
} from "../modules/house/schemas/houseMember.schema";
import { getErrorMessage } from "../api/axios";

export function SettingsPage() {
  const { data: houses } = useHouses();
  const { currentHouseId, setCurrentHouseId } = useCurrentHouse();

  return (
    <div>
      <h1>Configurações</h1>

      <section>
        <h2>Casa atual</h2>
        {!houses || houses.length === 0 ? (
          <p>Nenhuma casa cadastrada ainda.</p>
        ) : houses.length === 1 ? (
          <p>{houses[0].name} (única casa cadastrada)</p>
        ) : (
          <div>
            {houses.map((house) => (
              <label key={house.id} style={{ display: "block" }}>
                <input
                  type="radio"
                  name="currentHouse"
                  checked={house.id === currentHouseId}
                  onChange={() => setCurrentHouseId(house.id)}
                />
                {house.name}
              </label>
            ))}
          </div>
        )}
      </section>

      {currentHouseId && <MembersSection houseId={currentHouseId} />}

      <section>
        <h2>Gerenciamento</h2>
        <Link to="/houses">Gerenciar casas</Link>
        <br />
        <Link to="/products">Gerenciar produtos</Link>
      </section>
    </div>
  );
}

function MembersSection({ houseId }: { houseId: string }) {
  const { data: members, isLoading, isError, error } = useHouseMembers(houseId);
  const inviteMember = useInviteMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberRequest>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: InviteMemberRequest) => {
    inviteMember.mutate(
      { houseId, payload: data },
      { onSuccess: () => reset({ email: "" }) }
    );
  };

  return (
    <section>
      <h2>Membros desta casa</h2>

      {isLoading && <p>Carregando membros...</p>}
      {isError && <p>Erro ao carregar membros: {getErrorMessage(error)}</p>}

      {members && (
        <ul>
          {members.map((member) => (
            <li key={member.userId}>
              {member.name} ({member.email}) — {member.role === "OWNER" ? "Dono" : "Membro"}
            </li>
          ))}
        </ul>
      )}

      <h3>Convidar por email</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="inviteEmail">Email</label>
          <input id="inviteEmail" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {inviteMember.isError && (
          <p>Erro ao convidar: {getErrorMessage(inviteMember.error)}</p>
        )}

        <button type="submit" disabled={isSubmitting || inviteMember.isPending}>
          {inviteMember.isPending ? "Convidando..." : "Convidar"}
        </button>
      </form>
    </section>
  );
}
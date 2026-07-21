import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useHouses } from "./useHouses";
import { useCurrentHouse } from "../context/CurrentHouseContext";

export function useAutoSelectCurrentHouse() {
  const { data: houses, isLoading } = useHouses();
  const { currentHouseId, setCurrentHouseId, clearCurrentHouse } = useCurrentHouse();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !houses) return;

    const currentHouseStillExists =
      currentHouseId && houses.some((house) => house.id === currentHouseId);

    if (currentHouseId && !currentHouseStillExists) {
      clearCurrentHouse();
      return;
    }

    if (currentHouseId) return;

    if (houses.length === 1) {
      setCurrentHouseId(houses[0].id);
      return;
    }

    if (houses.length === 0 && location.pathname !== "/houses/new") {
      navigate("/houses/new");
    }
  }, [isLoading, houses, currentHouseId, setCurrentHouseId, clearCurrentHouse, navigate, location.pathname]);
}
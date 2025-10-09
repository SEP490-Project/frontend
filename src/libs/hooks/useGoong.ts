import { useDispatch, useSelector } from "react-redux";
import { fetchPredictions } from "@/libs/stores/goongManager/thunk";
import { clearPredictions } from "@/libs/stores/goongManager/slice";
import type { RootState, AppDispatch } from "@/libs/stores";

export const useGoong = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, predictions, error } = useSelector((state: RootState) => state.manageGoong);

  const getPredictions = (input: string) => dispatch(fetchPredictions(input));
  const clear = () => dispatch(clearPredictions());

  return { loading, predictions, error, getPredictions, clear };
};

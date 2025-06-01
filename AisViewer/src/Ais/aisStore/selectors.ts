import { RootState } from "../../store";

export const getCurrentVessels = (state: RootState) => state.vessels.data;
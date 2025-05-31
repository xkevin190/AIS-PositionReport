import { configureStore } from '@reduxjs/toolkit';
import aisReducer from '../Ais/aisStore/slice';

export const store = configureStore({
  reducer: {
    vessels: aisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
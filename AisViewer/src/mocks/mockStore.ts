import { configureStore } from '@reduxjs/toolkit';
import aisReducer from '../Ais/aisStore/slice';

const store = configureStore({
  reducer: {
    vessels: aisReducer,
  },
});


export default store;
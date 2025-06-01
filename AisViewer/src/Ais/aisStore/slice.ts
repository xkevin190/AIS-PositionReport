import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../services/Api.Service';
import {FetchVesselsArgs, Vessel} from '../types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const fetchVessels = createAsyncThunk<Vessel[], FetchVesselsArgs>(
  'vessels/fetchVessels',
  async ({minLat, minLng, maxLat, maxLng}, thunkAPI) => {
    try {
      const res = await api.get('/vessels', {
        params: {minLat, minLng, maxLat, maxLng},
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error fetching vessels',
      );
    }
  },
);

const aisSlice = createSlice({
  name: 'ais',
  initialState,
  reducers: {
    clearVessels: state => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVessels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVessels.fulfilled,
        (state, action: PayloadAction<Vessel[]>) => {
          state.data = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchVessels.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {clearVessels} = aisSlice.actions;
export default aisSlice.reducer;

// aisSlice.test.ts

import reducer, { clearVessels, fetchVessels } from './slice';
import api from '../../services/Api.Service';
import { FetchVesselsArgs, Vessel } from '../types';
import store from '../../mocks/mockStore';


jest.mock('../../services/Api.Service');

const mockedApi = api as jest.Mocked<typeof api>;


const initialState = {
  data: [],
  loading: false,
  error: null
};

const bounds: FetchVesselsArgs = {
  minLat: 0,
  minLng: 0,
  maxLat: 10,
  maxLng: 10
};

const vesselsMock: Vessel[] = [
    {
      mmsi: 123456789,
      name: 'Test Ship',
      location: {
        type: 'Point',
        coordinates: [10, 20],
      },
      course: 90,
    },
  ];

describe('aisSlice integration (thunk + reducer)', () => {
  it('should handle successful fetchVessels dispatch', async () => {

    mockedApi.get.mockResolvedValueOnce({ data: vesselsMock });

    
    const result = await store.dispatch(fetchVessels(bounds));

    const state = store.getState().vessels;

    expect(result.type).toBe('vessels/fetchVessels/fulfilled');
    expect(state.data).toEqual(vesselsMock);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle failed fetchVessels dispatch', async () => {
    mockedApi.get.mockRejectedValueOnce({
      response: { data: { message: 'API failed' } }
    });

    
    const result = await store.dispatch(fetchVessels(bounds));

    const state = store.getState().vessels

    expect(result.type).toBe('vessels/fetchVessels/rejected');
    expect(state.loading).toBe(false);
    expect(state.error).toBe('API failed');
  });

  it('should clear vessels when clearVessels is dispatched', () => {
    const populatedState = {
      data: vesselsMock,
      loading: true,
      error: 'some error'
    };

    const newState = reducer(populatedState, clearVessels());

    expect(newState).toEqual(initialState);
  });
});

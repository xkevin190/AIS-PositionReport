import {renderHook, act} from '@testing-library/react-hooks';
import {useMap} from '../hooks/useMap';
import * as redux from 'react-redux';
import MapboxGL from '@rnmapbox/maps';

jest.mock('@rnmapbox/maps', () => ({
  __esModule: true,
  default: {
    MapView: jest.fn(),
    Camera: jest.fn(),
  },
}));

const mockDispatch = jest.fn();
jest.mock('../../hooks/useAppDispatch', () => () => mockDispatch);
jest.mock('../../hooks/useAppSelector', () => () => []);

import {fetchVessels, clearVessels} from '../aisStore/slice';
jest.mock('../aisStore/slice', () => ({
  fetchVessels: jest.fn(() => ({type: 'FETCH_VESSELS'})),
  clearVessels: jest.fn(() => ({type: 'CLEAR_VESSELS'})),
}));

const mockMapRef = {
  current: {
    getVisibleBounds: jest.fn(),
    getZoom: jest.fn(),
  },
};

describe('useMap hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize map refs and state correctly', () => {
    const {result} = renderHook(() => useMap());
    expect(result.current.mapRef).toBeDefined();
    expect(result.current.cameraRef).toBeDefined();
    expect(result.current.initialFetch).toBe(false);
  });

  it('should execute initial fetch only once with valid coords', () => {
    const {result} = renderHook(() => useMap());

    const mockSetCamera = jest.fn();
    result.current.cameraRef.current = {
      setCamera: mockSetCamera,
      fitBounds: jest.fn(),
      flyTo: jest.fn(),
      moveTo: jest.fn(),
      zoomTo: jest.fn(),
    };

    act(() => {
      result.current.executedInitialFetch({latitude: 1, longitude: 1});
    });

    expect(result.current.initialFetch).toBe(true);
    expect(mockSetCamera).toHaveBeenCalledWith({
      centerCoordinate: [1, 1],
      zoomLevel: 12,
    });
  });

  it('should skip fetch when bounds have not changed', async () => {
    const {result} = renderHook(() => useMap());
    const bounds = [
      [0, 0],
      [1, 1],
    ];

    mockMapRef.current.getVisibleBounds = jest.fn().mockResolvedValue(bounds);
    mockMapRef.current.getZoom = jest.fn().mockResolvedValue(13);
    result.current.mapRef.current = mockMapRef.current as any;

    await act(async () => {
      await result.current.handleRegionChange();
    });

    await act(async () => {
      await result.current.handleRegionChange();
    });

    // Expect fetch to be called only once if bounds are unchanged
    expect(fetchVessels).toHaveBeenCalledTimes(1);
  });
});

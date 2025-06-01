import React from 'react';
import { render } from '@testing-library/react-native';
import Map from '../components/Map';

// Mock react-native-config
jest.mock('react-native-config', () => ({
  MAPBOX_TOKEN: 'fake-mapbox-token',
}));

// Mock hooks
jest.mock('../hooks/useMap', () => ({
  useMap: () => ({
    mapRef: { current: null },
    cameraRef: { current: null },
    handleRegionChange: jest.fn(),
    executedInitialFetch: jest.fn(),
    vessels: [
      {
        mmsi: 123456789,
        name: 'Test Ship',
        course: 45,
        location: {
          type: 'Point',
          coordinates: [-0.1, 39.5],
        },
      },
    ],
  }),
}));

// Mock @rnmapbox/maps
jest.mock('@rnmapbox/maps', () => ({
  __esModule: true,
  default: {
    setAccessToken: jest.fn(),
  },
  MapView: ({ children }: any) => <>{children}</>,
  Camera: () => null,
  UserLocation: () => null,
  Images: () => null,
  ShapeSource: ({ children }: any) => <>{children}</>,
  SymbolLayer: () => null,
  CircleLayer: () => null,
}));

describe('Map component', () => {
  it('should render map and vessels', () => {
    const {  toJSON } = render(<Map />);
    expect(toJSON()).toMatchSnapshot();
  });
});

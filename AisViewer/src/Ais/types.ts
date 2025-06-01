export interface Vessel {
  mmsi: number;
  name: string;
  course: number | null;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface AisState {
  data: Vessel[];
  loading: boolean;
  error: string | null;
}

export interface FetchVesselsArgs {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

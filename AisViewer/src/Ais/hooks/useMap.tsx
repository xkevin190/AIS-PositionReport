import {useCallback, useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import useAppDispatch from '../../hooks/useAppDispatch';
import {clearVessels, fetchVessels} from '../aisStore/slice';
import {Position} from '@rnmapbox/maps/lib/typescript/src/types/Position';
import useAppSelector from '../../hooks/useAppSelector';
import {getCurrentVessels} from '../aisStore/selectors';
import { AppState, AppStateStatus } from 'react-native';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useMap = () => {
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const dispatch = useAppDispatch();
  const vessels = useAppSelector(getCurrentVessels);
  const [initialFetch, setInitialFetch] = useState<boolean>(false);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<string | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);


  const getVessels = async (bounds: [Position, Position]) => {
    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    dispatch(
      fetchVessels({
        minLat,
        minLng,
        maxLat,
        maxLng,
      }),
    );
  };

  const handleRegionChange = useCallback(async () => {
    const bounds = await mapRef.current?.getVisibleBounds();
    const zoom = await mapRef.current?.getZoom();
    const boundsKey = JSON.stringify(bounds);

    if (boundsKey === lastBoundsRef.current) {
      return;
    }

    lastBoundsRef.current = boundsKey;

    if (bounds && zoom && zoom >= 12) {
      return getVessels(bounds);
    }

    if (zoom && zoom < 12) {
      dispatch(clearVessels());
    }
  }, []);

  const executedInitialFetch = (coords: Coordinates) => {
    if (initialFetch) {
      return;
    }

    if (coords.latitude === 0 && coords.longitude === 0) {
      return;
    }

    setInitialFetch(true);
    cameraRef.current?.setCamera({
      centerCoordinate: [coords.longitude, coords.latitude],
      zoomLevel: 12,
    });
  };

  const startFetchInterval = () => {
    if (fetchIntervalRef.current) return;
    fetchIntervalRef.current = setInterval(async () => {
      const bounds = await mapRef.current?.getVisibleBounds();
      const zoom = await mapRef.current?.getZoom();
      if (bounds && zoom && zoom >= 12)  {
        getVessels(bounds);
      }
    }, 10000);
  };

  const stopFetchInterval = () => {
    if (!fetchIntervalRef.current) return;
    clearInterval(fetchIntervalRef.current);
    fetchIntervalRef.current = null;
  };

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const isForeground = nextState === 'active';
      isForeground ? startFetchInterval() : stopFetchInterval();
      appState.current = nextState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    if (AppState.currentState === 'active') startFetchInterval();

    return () => {
      subscription.remove();
      stopFetchInterval();
    };
  }, []);


  return {
    mapRef,
    cameraRef,
    handleRegionChange,
    initialFetch,
    executedInitialFetch,
    vessels,
  };
};

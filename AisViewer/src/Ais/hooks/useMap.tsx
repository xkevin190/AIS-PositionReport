import { useEffect, useRef, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchVessels } from '../aisStore/slice';
import { FetchVesselsArgs } from '../types';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

type Coordinates = {
    latitude: number;
    longitude: number;
};


export const useMap = () => {
    const mapRef = useRef<MapboxGL.MapView>(null);
    const cameraRef = useRef<MapboxGL.Camera>(null);
    const dispatch = useAppDispatch();
    const [initialFetch, setInitialFetch] = useState<boolean>(false);


    const getVessels = async (bounds: [Position, Position]) => {
        const [[minLng, minLat], [maxLng, maxLat]] = bounds;  
        dispatch(fetchVessels({
            minLat,
            minLng,
            maxLat,
            maxLng
        })); 
    }

    const handleRegionChange = async () => {
            const bounds = await mapRef.current?.getVisibleBounds();
            const zoom = await mapRef.current?.getZoom();
            
            if (bounds && zoom && zoom >= 12) {
                getVessels(bounds);
            }
    };


    const executedInitialFetch = (coords: Coordinates) => {
        if (initialFetch ) {
            return
        }

        if (coords.latitude === 0 && coords.longitude === 0)  {
            return
        }


        setInitialFetch(true);
        cameraRef.current?.setCamera({
            centerCoordinate: [coords.longitude, coords.latitude],
            zoomLevel: 12,
        });
    }   
    

    return { mapRef,cameraRef,  handleRegionChange, initialFetch, executedInitialFetch };
}  
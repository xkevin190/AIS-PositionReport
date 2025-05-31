import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View, StyleSheet } from 'react-native';
import { useMap } from '../hooks/useMap';

MapboxGL.setAccessToken('pk.eyJ1IjoieGtldmluMTkwIiwiYSI6ImNtYmJkc2RjMDFlejkybXMxMWprdnloMDEifQ.q2fVCWP-cPQ69vuJEgs1Bg');

<MapboxGL.Images images={{ ship: require('../../assets/ship.png') }} />

const Map = () => {

   const { mapRef, handleRegionChange, cameraRef, executedInitialFetch, vessels } = useMap();
   
  return (
    <View style={styles.page}>
      <MapboxGL.MapView style={styles.map} ref={mapRef} onMapIdle={()=>{
        handleRegionChange();
      }}>
      <MapboxGL.Images images={{ ship: require('../../assets/ship.png') }} />

      <MapboxGL.ShapeSource
          id="vessels"
          shape={{
            type: 'FeatureCollection',
            features: vessels.map((vessel) => ({
              type: 'Feature',
              geometry: vessel.location,
              properties: {
                mmsi: vessel.mmsi,
                name: vessel.name,
                course: vessel?.course ,
              },
            })),
          }}
        >
          <MapboxGL.SymbolLayer
            id="vessel-icons"
            style={{
              iconImage: 'ship',
              iconAllowOverlap: true,
              iconSize: 0.05,  
              iconRotate: ['get', 'course'],
              iconRotationAlignment: 'map',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          followUserLocation={false}
        />
        <MapboxGL.UserLocation visible={false} onUpdate={(location)=>{
            executedInitialFetch(location.coords)
        }}/>
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;

import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View, StyleSheet } from 'react-native';
import { useMap } from '../hooks/useMap';

MapboxGL.setAccessToken('pk.eyJ1IjoieGtldmluMTkwIiwiYSI6ImNtYmJkc2RjMDFlejkybXMxMWprdnloMDEifQ.q2fVCWP-cPQ69vuJEgs1Bg');

const Map = () => {

   const { mapRef, handleRegionChange, initialFetch, cameraRef, executedInitialFetch } = useMap();
   
 
  return (
    <View style={styles.page}>
      <MapboxGL.MapView style={styles.map} ref={mapRef} onMapIdle={handleRegionChange}>
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

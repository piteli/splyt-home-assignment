import React from 'react';
import {
    GoogleMap,
    useJsApiLoader
} from '@react-google-maps/api';
import { defaultMapContainerStyle } from './Map.style';

function MapComponent(props: any) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBxkMzANRiNqV2V--bJF7BLwXRc9DvEgTM" 
        // this key won't be keep here on production. On production, this key will keep in db 
        // and retrieve by API and loaded it at here
    });

    const defaultLocation = {lat: 32.7502, lng: 114.7655};

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        props.setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        props.setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={
                props.hasOwnProperty('mapContainerStyle') 
                ? props.mapContainerStyle : defaultMapContainerStyle
            }
            center={props.hasOwnProperty('location') ? props.location : defaultLocation}
            zoom={props.hasOwnProperty('zoom') ? props.zoom : 10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {props.children}
        </GoogleMap>
    ) : null
}


export default MapComponent;    
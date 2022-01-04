import React from 'react';
import {
    Marker
} from '@react-google-maps/api';
import MapComponent from '../../components/map/Map.component';
import { 
    PageHeader, 
    Slider,
    Select,
    Typography,
} from 'antd';
import { officesLocation } from './Home.model';
import ApiService from '../../services/api.service';
import { AUTHENTICATION_TYPE } from '../../utils/constants/http.constant';
import { GET_OFFICES_LOCATION, GET_CURRENT_LOCATION, GET_TAXIS } from '../../utils/constants/api.constant';
import { getKilometerBetweenTwoPointsOfLatAndLng } from '../../utils/helper/math.helper';

const { Option } = Select;
const { Text } = Typography;

//located in kota kinabalu, Sabah, Malaysia
const mockCurrentLocation = { lat: 6.0425528, lng: 116.1468417 };

function HomeView() {
    const [map, setMap] = React.useState<any>(null);
    const [offices, setOffices] = React.useState([]);
    const [officeLocation, setOfficeLocation] = React.useState<any>(null);
    const [currentLocation, setCurrentLocation] = React.useState<any>(null);
    const [taxis, setTaxis] = React.useState<any>([]);
    const [noOfTaxis, setNoOfTaxis] = React.useState<number>(3);

    let timeoutGetTaxis: any = null;
    let timeoutGetRecentTaxisLocation: any = null;

    const onLoadOfficeMarker = React.useCallback(function callback(marker) {
        marker.setIcon(require('../../assets/icons/office_marker.png'));
    }, []); 

    const onLoadCurrentMarker = React.useCallback(function callback(marker) {
        marker.setIcon(require('../../assets/icons/me_marker.png'));
    }, []);

    const onLoadTaxisMarker = React.useCallback(function callback(marker) {
        marker.setIcon(require('../../assets/icons/car_marker.png'));
    }, []);

    const isFirstRenderCurrentLocation = React.useRef(true);
    const isFirstRenderNearbyToLocation = React.useRef(true);
    const isFirstRenderOfficeLocation = React.useRef(true);

    React.useEffect(() => {
        if (isFirstRenderCurrentLocation.current) {
            isFirstRenderCurrentLocation.current = false; // toggle flag after first render/mounting
            return;
        }
        getCurrentLocationFromAPI();
    }, [offices]);

    React.useEffect(() => {
        if (isFirstRenderNearbyToLocation.current) {
            isFirstRenderNearbyToLocation.current = false; 
            return;
        }
        createMarkerAndSetLocation();
    }, [currentLocation]);

    React.useEffect(() => {
        if (isFirstRenderOfficeLocation.current) {
            isFirstRenderOfficeLocation.current = false;
            return;
        }
        setCenterZoom();
        getTaxis();
    }, [officeLocation]);


    function onChangeSlider(value: number) {
        if(timeoutGetTaxis !== null) {
            clearTimeout(timeoutGetTaxis);
            timeoutGetTaxis = null;
        }

        if(timeoutGetRecentTaxisLocation !== null) {
            clearTimeout(timeoutGetRecentTaxisLocation);
            timeoutGetRecentTaxisLocation = null;
        }

        setNoOfTaxis(value);
        timeoutGetTaxis = setTimeout(() => {
            getTaxis(value);
        }, 2000);
    }
    
    function officeChange(locationString: any) {
        const location = JSON.parse(locationString);

        if(location === 'NEAR_ME') {
            searchOfficeNearbyToMyLocation();
        } else {
            createMarkerAndSetLocation(location);
        }
    }

    function searchOfficeNearbyToMyLocation() {
        let kmCollection: any[] = [];
        const sourceLatitude = currentLocation.lat;
        const sourceLongitude = currentLocation.lng;
        const kmOffice = offices.map((item: any) => {
            const destinationLatitude = item.location.lat;
            const destinationLongitude = item.location.lng;
            
            const km = getKilometerBetweenTwoPointsOfLatAndLng(
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude
            );

            kmCollection.push(km);

            return {...item, km};
        });

        const nearestKm = (Math.min.apply(Math, kmCollection)).toFixed(2);
        const nearestOfficeIndex = kmOffice.findIndex((c) => c.km === nearestKm);

        if(nearestOfficeIndex >= 0) {
            const nearestLocation = kmOffice[nearestOfficeIndex].location;
            createMarkerAndSetLocation(nearestLocation);
        }
    }

    function getCurrentLocationFromAPI() { 
        new ApiService().get(GET_CURRENT_LOCATION, AUTHENTICATION_TYPE.NONE)
        .then((res) => res.json())
        .then((res) => {
            setCurrentLocation(res.location);
        }).catch((err) => {
            waitingToRetry(getCurrentLocationFromAPI);
        })
    }


    
    function getTaxis(value: any = null) {
        const fullURL =`${GET_TAXIS}?latitude=${currentLocation.lat}&longitude=${currentLocation.lng}&count=${value === null ? noOfTaxis : value}`;
        new ApiService().get(fullURL, AUTHENTICATION_TYPE.NONE)
        .then((res) => res.json())
        .then((res) => {
            setTaxis(res.drivers);
            readyToRefreshRecentTaxis();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function readyToRefreshRecentTaxis() {
        timeoutGetRecentTaxisLocation = setTimeout(() => getTaxis(), 15000);
    }

    function setCenterZoom() {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(officeLocation));
        bounds.extend(new window.google.maps.LatLng(currentLocation));
        
        if(map !== null){
            map.fitBounds(bounds);
        }
    }
    
    function retrieveOfficesLocation() {
        new ApiService().get(GET_OFFICES_LOCATION, AUTHENTICATION_TYPE.NONE)
        .then((res) => res.json())
        .then((res) => {
            const offices = res.data;
            setOffices(offices);
        }).catch((err) => {
            waitingToRetry(retrieveOfficesLocation);
        })
    }

    function createMarkerAndSetLocation(location: any = null) {
        if(location === null) {
            searchOfficeNearbyToMyLocation();
            return;
        }
        setOfficeLocation(location);
    }
    
    function waitingToRetry(func: any) {
        setTimeout(() => func(), 5000);
    }
    
    function renderSelect(offices: officesLocation[]) {
        return(
            <Select key={"2"} 
                placeholder={'Select Office: ' + (offices.length > 0 ? `Default - Nearest Office` : '')} 
                style={{ width: 120 }} onChange={officeChange}
            >
            { offices.length > 0 ? <Option key={0} value={JSON.stringify('NEAR_ME')}>Nearest Office</Option> : null }
            {
                offices.map((item, index) => {
                    const locationString = JSON.stringify(item.location);
                    return (<Option key={index + 1} value={locationString}>{item.country}</Option>);
                })
            }
          </Select>
        );
    }
    
    function renderSlider() {
        return(
            <div style={{
                display: 'inline-block',
                verticalAlign: 'middle'
            }}>
                <Slider onChange={onChangeSlider} min={3} max={30} style={{ width: 80 }} defaultValue={3} />
            </div>
        );
    }

    return(
        <div>
            <PageHeader
                title={'Splyt'}
                extra={[
                    renderSlider(),
                    <Text style={{marginRight: 20}}>{noOfTaxis} Taxis shown</Text>,
                    renderSelect(offices)
                ]}
            >
                
            </PageHeader>
            <MapComponent map={map} setMap={setMap} retrieveOfficesLocation={retrieveOfficesLocation}>
                {/* marker and infowindow is here  */}
                {
                    officeLocation !== null ?
                    <Marker onLoad={onLoadOfficeMarker} position={officeLocation}></Marker> : <></>
                }
                {
                    currentLocation !== null ?
                    <Marker onLoad={onLoadCurrentMarker} position={currentLocation}></Marker> : <></>
                }
                {
                    taxis.length > 0 ?
                    taxis.map((item: any) => {
                        const location = {lat: item.location.latitude, lng: item.location.longitude};
                        return (
                            <Marker onLoad={onLoadTaxisMarker} 
                            position={location}
                            ></Marker>
                        );
                    }) : <></>
                }
            </MapComponent>
        </div>
    );
}

export default HomeView;
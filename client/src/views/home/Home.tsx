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
import { GET_OFFICES_LOCATION } from '../../utils/constants/api.constant';

const { Option } = Select;
const { Text } = Typography;

function HomeView() {
    const [map, setMap] = React.useState<any>(null);
    const [offices, setOffices] = React.useState([]);
    const [officeLocation, setOfficeLocation] = React.useState<any>(null);
    const [currentLocation, setCurrentLocation] = React.useState<any>(null);
    React.useEffect(() => retrieveOfficesLocation(), []);
    
    function officeChange(locationString: any) {
        const location = JSON.parse(locationString);
        setOfficeLocation(location);
        setCenterZoom();
    }

    function getCurrentLocationFromAPI() {
        new ApiService().get(GET_OFFICES_LOCATION, AUTHENTICATION_TYPE.NONE)
        .then((res) => res.json())
        .then((res) => {
            
        }).catch((err) => {
            
        })
    }

    function setCenterZoom() {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(officeLocation));
        
        if(map !== null){
            map.fitBounds(bounds);
            setMap(map);
        }
    }
    
    function retrieveOfficesLocation() {
        new ApiService().get(GET_OFFICES_LOCATION, AUTHENTICATION_TYPE.NONE)
        .then((res) => res.json())
        .then((res) => {
            const offices = res.data;
            setOffices(offices);
            setOfficeLocation(offices[0].location);
            getCurrentLocationFromAPI();
        }).catch((err) => {
            waitingToRetry(retrieveOfficesLocation);
        })
    }
    
    function waitingToRetry(func: any) {
        setTimeout(() => func(), 5000);
    }
    
    function renderSelect(offices: officesLocation[]) {
        console.log('here is offices', offices);
        return(
            <Select key={"2"} 
                placeholder={'Select Office: ' + (offices.length > 0 ? `Default - ${offices[0].country}` : '')} 
                style={{ width: 120 }} onChange={officeChange}
            >
            {
                offices.map((item, index) => {
                    const locationString = JSON.stringify(item.location);
                    return (<Option key={index} value={locationString}>{item.country}</Option>);
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
                <Slider style={{ width: 80 }} defaultValue={3} />
            </div>
        );
    }

    return(
        <div>
            <PageHeader
                title={'Splyt'}
                extra={[
                    renderSlider(),
                    <Text style={{marginRight: 20}}>3 Taxis shown</Text>,
                    renderSelect(offices)
                ]}
            >
                
            </PageHeader>
            <MapComponent map={map} setMap={setMap}>
                {/* marker and infowindow is here  */}
                {
                    officeLocation !== null ?
                    <Marker position={officeLocation}></Marker> : <></>
                }
            </MapComponent>
        </div>
    );
}

export default HomeView;
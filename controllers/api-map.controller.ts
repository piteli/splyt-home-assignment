import { getAPI } from "../services/api.service";
require('dotenv').config();

const googleKey = process.env.GOOGLE_API_KEY;

export const getTaxis = (req: any, res: any) => {
    res.json({status: true});
}

export const getCurrentLocation = (req: any, res: any) => {
    getAPI('https://www.googleapis.com/geolocation/v1/geolocate?key=' + googleKey)
    .then((result) => {
        const mergeObject = Object.assign(result, {success: true});
        res.json(mergeObject);
    })
    .catch((err) => {
        res.json({success: false, message: err});
    });
}

export const getGoogleAPIKey = (req: any, res: any) => {
    res.json({success: true, data: {googleKey}});
}
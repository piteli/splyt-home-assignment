import express from 'express';
import { getAPI } from "../services/api.service";

const app = express();
const googleKey = app.locals.googleKey;

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
        res.json({success: false, message: 'failed to retrieve current location'});
    });
}

export const getGoogleAPIKey = (req: any, res: any) => {
    res.json({success: true, data: {googleKey}});
}
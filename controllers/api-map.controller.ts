import { getAPI, postAPI } from "../services/api.service";
require('dotenv').config();

const googleKey = process.env.GOOGLE_API_KEY;

export const getTaxis = (req: any, res: any) => {
    const requestCount = req.query.hasOwnProperty('count') ? req.query.count : '10';
    const requestLat = req.query.hasOwnProperty('latitude') ? req.query.latitude : '3.0494652';
    const requestLng = req.query.hasOwnProperty('longitude') ? req.query.longitude : '101.5149527'
    getAPI(`https://qa-interview-test.splytech.dev/api/drivers?latitude=${requestLat}&longitude=${requestLng}&count=${requestCount}`)
    .then((result: any) => {
        const mergeObject = Object.assign(result.data, {success: true});
        res.json(mergeObject);
    })
    .catch((err) => {
        res.json({status: false, message: err});
    });
}

export const getCurrentLocation = (req: any, res: any) => {
    postAPI('https://www.googleapis.com/geolocation/v1/geolocate?key=' + googleKey)
    .then((result: any) => {
        const mergeObject = Object.assign(result.data, {success: true});
        res.json(mergeObject);
    })
    .catch((err) => {
        res.json({success: false, message: err});
    });
}

export const getGoogleAPIKey = (req: any, res: any) => {
    res.json({success: true, data: {googleKey}});
}
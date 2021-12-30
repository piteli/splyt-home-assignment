import express from 'express';

const apiMapController = require('../controllers/api-map.controller');
const apiOfficeController = require('../controllers/api-office.controller');
export const apiRouter = express.Router();

apiRouter.get('/office/get-offices-location', apiOfficeController.retrieveLocation);
apiRouter.get('/map/get-taxis', apiMapController.getTaxis);
apiRouter.get('/map/get-current-location', apiMapController.getCurrentLocation);
apiRouter.get('/map/get-google-api-key', apiMapController.getGoogleAPIKey);
import { getAPI } from "../services/api.service";

export const retrieveLocation = (req: any, res: any) => {
    //query from DB and output as JSON
    res.json({
        success: true, 
        data: [
            {
                country: 'London',
                location: { lat: 51.5049375, lng: -0.0964509 }
            },
            {
                country: 'Singapore',
                location: { lat: 1.285194, lng: 103.8522982 }
            }
        ]
    });
}
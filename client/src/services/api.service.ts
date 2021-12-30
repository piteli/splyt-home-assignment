import { AUTHENTICATION_TYPE } from '../utils/constants/http.constant';

const BASE_URL = 'http://localhost:5000';

export default class ApiService {

    getHeaders(authenticationType: string){
        let headers = {Accept: 'application/json', 'Content-Type': 'application/json'};

        if(
            authenticationType === AUTHENTICATION_TYPE.BASIC ||
            authenticationType === AUTHENTICATION_TYPE.BEARER
        ) {
            headers = {...headers, ...{Authentication: `${authenticationType} ${'token-here'}`}};
        }

        return headers;
    }

    get(path: string, authenticationType: string, paramsObject = null) {
        const oneLineParams = paramsObject === null ? '' : new URLSearchParams(paramsObject).toString();
        const fullPath = paramsObject === null ? path : path + '?';
        return fetch(BASE_URL + fullPath + oneLineParams, {headers: this.getHeaders(authenticationType)})
    }

    
}
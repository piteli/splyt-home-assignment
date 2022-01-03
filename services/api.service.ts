import axios from 'axios';

export function getAPI(url: string) {
    return new Promise((resolve: any, reject: any) => {
        axios({
            url,
            responseType: 'json'
        })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
    })
}
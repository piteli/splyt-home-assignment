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

export function postAPI(url: string, body: any = null) {
    return new Promise((resolve: any, reject: any) => {
        axios.post(url, body)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
    })
}
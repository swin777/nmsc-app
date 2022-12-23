
import axios, {AxiosRequestConfig} from "axios";

const url = "";

export const serverCall = (path: string, method: string, data: any) => {
    return new Promise((resolve, reject) => {
        axios({url: url + path, method: method, data: data, headers: {}, credentials: true} as AxiosRequestConfig)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                if (err.response.data && !err.response.data.status) {
                    err.response.data.status = err.response.status;
                }
                if (err.response && err.response.data) {
                    //
                    resolve(err.response.data);
                } else {
                    reject(err);
                }
            });
    });
};

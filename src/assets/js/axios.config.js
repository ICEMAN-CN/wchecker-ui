import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
// axios.defaults.baseURL = 'http://175.24.116.94:8088/';
axios.defaults.baseURL = 'http://www.wchecker.cn';
axios.defaults.withCredentials = true;

const ajax = {
    post: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },
    get: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },
    put: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.put(url, qs.stringify(data))
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },
    del: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.delete(url, qs.stringify(data))
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
};

export default ajax;

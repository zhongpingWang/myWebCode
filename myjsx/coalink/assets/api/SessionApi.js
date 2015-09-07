import $ from 'jquery'
import {Promise} from 'es6-promise'

// TODO: [REVIEW] 错误时，需要显示错误信息。可去掉console.log
var SessionApi = {
    fetch: function () {
        return new Promise(function (resolve, reject) {
            $.post("/api/account/fetch_session").done(function (resp) {
                if (resp.success) {
                    resolve(resp.data);
                } else {
                    console.error(resp.message);
                    reject(resp);
                }
            });
        });
    },
    login(data) {
        return new Promise((resolve, reject) => {
            $.post("/api/account/login", data).done(function (resp) {
                if (resp.success) {
                    resolve(resp.data);
                } else {
                    console.error(resp.message);
                    reject(resp);
                }
            })
        });
    },
    logout(){
        return new Promise((resolve, reject) => {
            $.post("/api/account/logout").done(function (resp) {
                if (resp.success) {
                    resolve(resp.data);
                } else {
                    console.error(resp.message);
                    reject(resp);
                }
            })
        });
    },
};

export default SessionApi;

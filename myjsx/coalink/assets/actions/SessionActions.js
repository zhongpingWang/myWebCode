import {alt} from '../commons'
import SessionApi from '../api/SessionApi'

// TODO: [IMP] 如何处理错误信息
class SessionActions {
    fetch() {
        this.dispatch();
        SessionApi.fetch().then((session) => {
            this.actions.update(session);
        }).catch((errorMessage) => {
            this.actions.updateFailed(errorMessage);
        });
    }

    login(loginData) {
        return new Promise((resolve, reject)=> {
            SessionApi.login(loginData).then((account)=> {
                resolve(account);
                this.actions.updateAccount(account);
            }).catch((errorMessage)=> {
                reject(errorMessage);
                this.actions.updateFailed(errorMessage);
            });
        });
    }

    logout(){
        return new Promise((resolve, reject)=> {
            SessionApi.logout().then(()=> {
                resolve();
                this.actions.updateAccount();
            }).catch((errorMessage)=> {
                reject(errorMessage);
                this.actions.updateFailed(errorMessage);
            });
        });
    }

    register(registerData) {
        this.dispatch(registerData);
    }

    update(session) {
        this.dispatch(session);
    }

    updateAccount(account) {
        this.dispatch(account);
    }

    updateFailed(errorMessage) {
        this.dispatch(errorMessage);
    }
}

module.exports = alt.createActions(SessionActions);

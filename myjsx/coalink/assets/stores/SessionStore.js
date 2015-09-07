import {alt} from '../commons'
import SessionActions from '../actions/SessionActions'

class SessionStore {
    constructor() {
        this.currentAccount = undefined;
        this.loggedIn = false;
        let listeners = {
            handleUpdate: SessionActions.UPDATE,
            handleUpdateAccount: SessionActions.UPDATE_ACCOUNT
        }
        this.bindListeners(listeners);
    }
    handleUpdate (session) {
        this.currentAccount = session.account;
        this.loggedIn = !! session.account;
    }
    handleUpdateAccount (account) {
        this.currentAccount = account;
        this.loggedIn = !! account;
    }


}

export default alt.createStore(SessionStore, 'SessionStore');

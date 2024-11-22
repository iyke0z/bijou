import Api from "./Api"

export default {
    login(form) {
        return Api.post('/login', form)
    },
    logout() {
        return Api.post('/logout')
    },
    get_expiry(){
        return Api.get('/get-expiration')
    }
}
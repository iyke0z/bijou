import Api from "./Api"

export default {
    create(form) {
        return Api.post('/user/create', form)
    },
    update(form, id) {
        return Api.post('/user/update/' + id, form)
    },
    details(id) {
        return Api.get('/user/' + id)
    },
    delete(id) {
        return Api.post('/user/delete/' + id)
    },
    user_roles(id) {
        return Api.post('/user/assign/' + id)
    },
    all_users() {
        return Api.get('/user')
    },
    auth() {
        return Api.get('/me')
    },
    user_repot(form) {
        return Api.post('/user-sales-report', form)
    },
    generate_code(form){
        return Api.post('/generate-code', form)
    }

}
import Api from "./Api"

export default {
    create_role(form) {
        return Api.post('/role/create', form)
    },

    create_priviledge(form) {
        return Api.post('/priviledge/create', form)
    },

    roles() {
        return Api.get('/roles')
    },

    priviledge() {
        return Api.get('/priviledge')
    },

    role_priviledge(form, id) {
        return Api.post('/assign/role/' + id, form)
    }



}
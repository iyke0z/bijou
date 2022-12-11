import Api from "./Api"

export default {
    create_type(form) {
        return Api.post('/expenditure/type/create', form)
    },
    update_type(form, id) {
        return Api.post('/expenditure/type/update/' + id, form)
    },
    all_types() {
        return Api.get('/expenditure/type')
    },
    delete_type(id) {
        return Api.post('/expenditure/type/delete/' + id)
    },
    create(form) {
        return Api.post('/expenditure/create', form)
    },
    update(form, id) {
        return Api.post('/expenditure/update' + id, form)
    },
    delete(id) {
        return Api.post('/expenditure/delete/' + id)
    },
    all_expenditures() {
        return Api.get('/expenditure')
    },
    report(form) {
        return Api.post('/expenditure/report', form)
    }
}
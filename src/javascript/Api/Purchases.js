import Api from "./Api"

export default {
    create(form) {
        return Api.post('/purchase/create', form)
    },
    update(form, id) {
        return Api.post('/purchase/update/' + id, form)
    },
    delete_purchase(id) {
        return Api.post('/purchase/delete/' + id)
    },
    delete_details(id) {
        return Api.post('/purchase/detail/delete/' + id)
    },
    purchases() {
        return Api.get('/purchase')
    },
    report(form) {
        return Api.post('/purchase/report', form)
    }

}
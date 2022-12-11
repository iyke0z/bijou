import Api from "./Api"

export default {
    create(form) {
        return Api.get('/discount/create', form)
    },
    update(form, id) {
        return Api.post('/discount/update/' + id, form)
    },
    delete(id) {
        return Api.post('/discount/delete/' + id)
    },
    customer_discount(form, id) {
        return Api.post('/discount/customer/' + id, form)
    },
    discounts(id) {
        return Api.get('/discount/customer/' + id)
    },
    get_code_available(form) {
        return Api.post('/discount/available', form)
    }

}
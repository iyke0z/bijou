import Api from "./Api"

export default {
    create(form) {
        return Api.post('/customer/create', form)
    },
    update(form, id) {
        return Api.post('/customer/update/' + id, form)
    },
    delete(id) {
        return Api.post('/delete/' + id)
    },
    fund_wallet(form, id) {
        return Api.post('/customer/fund/' + id, form)
    },
    details(id) {
        return Api.post('/customer/details/' + id)
    },
    customers() {
        return Api.get('/customer/all')
    },
    revoke_discount(customer, discount) {
        return Api.post('/discount/customer/delete/' + customer + '/' + discount)
    }
}
import Api from "./Api"

export default {
    create(form) {
        return Api.post('/customer/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update(form, id) {
        return Api.post('/customer/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete(id) {
        return Api.post('/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    fund_wallet(form, id) {
        return Api.post('/customer/fund/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    details(id) {
        return Api.post('/customer/details/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    customers() {
        return Api.get('/customer/all'+'?shop_id='+localStorage.getItem('shopId'))
    },
    revoke_discount(customer, discount) {
        return Api.post('/discount/customer/delete/' + customer + '/' + discount+'?shop_id='+localStorage.getItem('shopId'))
    }
}
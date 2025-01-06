import Api from "./Api"

export default {
    create(form) {
        return Api.get('/discount/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update(form, id) {
        return Api.post('/discount/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete(id) {
        return Api.post('/discount/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    customer_discount(form, id) {
        return Api.post('/discount/customer/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    discounts(id) {
        return Api.get('/discount/customer/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    get_code_available(form) {
        return Api.post('/discount/available'+'?shop_id='+localStorage.getItem('shopId'), form)
    }

}
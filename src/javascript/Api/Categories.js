import Api from "./Api"

export default {
    create(form) {
        return Api.post('/category/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    update(form, id) {
        return Api.post('/category/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    categories() {
        return Api.get('/category'+'?shop_id='+localStorage.getItem('shopId'))
    },

    delete(id) {
        return Api.post('/category/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    }
}
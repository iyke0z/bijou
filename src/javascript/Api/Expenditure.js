import Api from "./Api"

export default {
    create_type(form) {
        return Api.post('/expenditure/type/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update_type(form, id) {
        return Api.post('/expenditure/type/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    all_types() {
        return Api.get('/expenditure/type'+'?shop_id='+localStorage.getItem('shopId'))
    },
    delete_type(id) {
        return Api.post('/expenditure/type/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    create(form) {
        return Api.post('/expenditure/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update(form, id) {
        return Api.post('/expenditure/update' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete(id) {
        return Api.post('/expenditure/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    all_expenditures() {
        return Api.get('/expenditure'+'?shop_id='+localStorage.getItem('shopId'))
    },
    report(form) {
        return Api.post('/expenditure/report'+'?shop_id='+localStorage.getItem('shopId'), form)
    }
}
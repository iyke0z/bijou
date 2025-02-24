import Api from "./Api"

export default {
    create(form) {
        return Api.post('/purchase/create'+'?package_id='+localStorage.getItem('packageId')+'&&shop_id='+localStorage.getItem('shopId'), form)
    },
    update(form, id) {
        return Api.post('/purchase/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete_purchase(id) {
        return Api.post('/purchase/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    delete_details(id) {
        return Api.post('/purchase/detail/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    purchases() {
        return Api.get('/purchase'+'?shop_id='+localStorage.getItem('shopId'))
    },
    report(form) {
        return Api.post('/purchase/report'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update_plan(form, id){
        return Api.put('/purchase/update-plan/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    }

}
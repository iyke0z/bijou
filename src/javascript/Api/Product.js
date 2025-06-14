import Api from "./Api"

export default {
    create(form) {
        return Api.post('/product/create'+'?package_id='+localStorage.getItem('packageId')+'&&shop_id='+localStorage.getItem('shopId'), form)
    },

    update(form, id) {
        return Api.patch('/product/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    delete(id) {
        return Api.post('/product/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },

    periodic_report(form, id) {
        return Api.post('/product/report/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    all_report(id) {
        return Api.post('/product/report/all/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },

    upload_image(form) {
        return Api.post('/product/upload/image'+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    products() {
        return Api.get('/product'+'?shop_id='+localStorage.getItem('shopId'))
    },
    update_plan(form, id){
        return Api.put('/purchase/update-plan/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete_image(id) {
        return Api.post('/product/delete/image/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    update_website_details(form, id) {
        return Api.post('/product/update-detail/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    }
}
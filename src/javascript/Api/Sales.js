import Api from "./Api"

export default {
    new_sale(form) {
        return Api.post('/sell'+'?package_id='+localStorage.getItem('packageId')+'&&shop_id='+localStorage.getItem('shopId'), form)
    },
    update_sale(form) {
        return Api.post('sell/update'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    pay(form) {
        return Api.post('sell/pay'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    all_sales() {
        return Api.get('/sell/all'+'?shop_id='+localStorage.getItem('shopId'))
    },
    periodic_report(form) {
        return Api.post('/sell/periodic'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    sales_today() {
        return Api.post('/sell/today'+'?shop_id='+localStorage.getItem('shopId'))
    },
    cancel_sale(form) {
        return Api.post('/sell/delete'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delivery_note(form){
        return Api.post('/goods_delivery_notes/'+'?shop_id='+localStorage.getItem('shopId'), form)
    }
}
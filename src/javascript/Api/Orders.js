import Api from "./Api"

export default {
    get_active_orders(form) {
        return Api.post('/sell/orders'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    food_orders() {
        return Api.get('/food-orders'+'?shop_id='+localStorage.getItem('shopId'))
    },
    drink_orders() {
        return Api.get('/drink-orders'+'?shop_id='+localStorage.getItem('shopId'))
    },
    update_prep_status(form) {
        return Api.post('/update-prep-status'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    banks() {
        return Api.get('/banks'+'?shop_id='+localStorage.getItem('shopId'))
    }
}
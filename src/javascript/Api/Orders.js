import Api from "./Api"

export default {
    get_active_orders(form) {
        return Api.post('/sell/orders', form)
    },
    food_orders() {
        return Api.get('/food-orders')
    },
    drink_orders() {
        return Api.get('/drink-orders')
    },
    update_prep_status(form) {
        return Api.post('/update-prep-status', form)
    },
    banks() {
        return Api.get('/banks')
    }
}
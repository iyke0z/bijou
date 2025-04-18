import Api from "./Api"

export default {
    get_shops() {
        return Api.get('/shop/all'+'?shop_id='+localStorage.getItem('shopId'))
    },
    create_shop(form) {
        return Api.post('/shop/create'+'?package_id='+localStorage.getItem('packageId')+'&&shop_id='+localStorage.getItem('shopId'), form)
    },
    update_shop(form, id) {
        return Api.put('/shop/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    delete_shop(id) {
        return Api.delete('/shop/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    set_shop_state(shop){
        localStorage.removeItem('shopId', shop.id)
        localStorage.removeItem('shopName', shop.title)
        localStorage.setItem('shopId', shop.id)
        localStorage.setItem('shopName', shop.title)
        window.location.reload()
    },
    assign_shops(form, id){
        return Api.post('/shop/assign/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    initiate_transfer(form){
        return Api.post('/shop/initiate-transfer', form )
    },
    recent_transfers(id){
        return Api.get('/shop/recent-transfers/'+id+'?shop_id='+localStorage.getItem('shopId'))
    },
    approve_transfer(id){
        return Api.post('/shop/approve-transfer/'+id )
    },
    reject_transfer(id){
        return Api.post('/shop/reject-transfer/'+id )
    },

}
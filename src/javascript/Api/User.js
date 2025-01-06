import Api from "./Api"

export default {
    create(form) {
        return Api.post('/user/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    update(form, id) {
        return Api.post('/user/update/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    details(id) {
        return Api.get('/user/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    delete(id) {
        return Api.post('/user/delete/' + id+'?shop_id='+localStorage.getItem('shopId'))
    },
    user_roles(id) {
        return Api.post('/user/assign/'+id+'?shop_id='+localStorage.getItem('shopId'))
    },
    all_users() {
        return Api.get('/user?shop_id='+localStorage.getItem('shopId'))
    },
    auth() {
        return Api.get('/me')
    },
    user_repot(form) {
        return Api.post('/user-sales-report'+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    generate_user_report(form, id) {
        return Api.post('/user-transaction-report/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    },
    generate_code(form){
        return Api.post('/generate-code'+'?shop_id='+localStorage.getItem('shopId'), form)
    }
    

}
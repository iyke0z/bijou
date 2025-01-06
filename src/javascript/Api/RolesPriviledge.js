import Api from "./Api"

export default {
    create_role(form) {
        return Api.post('/role/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    delete_role(id) {
        return Api.post('/role/delete/'+id+'?shop_id='+localStorage.getItem('shopId'))
    },

    create_priviledge(form) {
        return Api.post('/priviledge/create'+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    roles() {
        return Api.get('/roles'+'?shop_id='+localStorage.getItem('shopId'))
    },

    priviledge() {
        return Api.get('/priviledges'+'?shop_id='+localStorage.getItem('shopId'))
    },

    role_priviledge(form, id) {
        return Api.post('/assign/role/' + id+'?shop_id='+localStorage.getItem('shopId'), form)
    },

    get_role_priviledges(id){
        return Api.get('/role/priviledges/'+id+'?shop_id='+localStorage.getItem('shopId'))
    },

    assign_role_priviledge(form, id){
        return Api.post('/assign/role/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    }
    



}
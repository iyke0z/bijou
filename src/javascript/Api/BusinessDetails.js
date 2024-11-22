import Api from "./Api"

export default {
    create(form) {
        return Api.post('/business/create', form)
    },
    update(form, id) {
        return Api.post('/business/update/' + id, form)
    },
    delete(id) {
        return Api.post('/business/delete/' + id)
    },
    details() {
        return Api.get('/business/details')
    },
    get_packages(){
        return Api.get('/admin/packages')
    },
    create_package(form){
        return Api.post('/admin/create-package', form)
    },
    update_package(form, id){
        return Api.post('/admin/delete-package/'+id, form)
    },
    delete_package(id){
        return Api.post('/admin/delete-package/'+id, form)
    },
    expire() {
        return Api.post('/business/details')
    },
    restore() {
        return Api.post('/business/restore')
    },
    new_activation_code(form) {
        return Api.post('/activation/new', form)
    },
    activate(form) {
        return Api.post('/activation/activate', form)
    }
}
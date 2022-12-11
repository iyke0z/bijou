import Api from "./Api"

export default {
    create(form) {
        return Api.post('/category/create', form)
    },

    update(form, id) {
        return Api.post('/category/update/' + id, form)
    },

    categories() {
        return Api.get('/category')
    },

    delete(id) {
        return Api.post('/category/delete/' + id)
    }
}
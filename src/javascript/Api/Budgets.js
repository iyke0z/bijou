import Api from "./Api"

export default {
    getPeriodic() {
        return Api.get('/budget/show-budget?shop_id='+localStorage.getItem('shopId'))
    },
    createBudget(form){
        return Api.post('/budget/create-budget?shop_id='+localStorage.getItem('shopId'), form)
    },
    deleteBudget(id){
        return Api.delete('/budget/delete-budget/'+id)
    },
}
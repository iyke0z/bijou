import Api from "./Api"
export default {
    general_report(form) {
        return Api.post('/report?shop_id='+localStorage.getItem('shopId'), form)
    },

    generate_report(form) {
        return Api.post('/transaction-report?shop_id='+localStorage.getItem('shopId'), form)
    },
    

    get_sales_performance(form) {
        return Api.post('/report/sales-performance?shop_id='+localStorage.getItem('shopId'), form)
    },

    get_opex_report(form){
        return Api.post('/report/opex-performance?shop_id='+localStorage.getItem('shopId'), form)
    },

    get_debt_report(){
        return Api.get('/report/debt-performance?shop_id='+localStorage.getItem('shopId'))
    },

    get_cogs(form){
        return Api.post('/report/cogs-performance?shop_id='+localStorage.getItem('shopId'), form)
    },

    get_method_performance(form){
        return Api.post('/report/method-performance?shop_id='+localStorage.getItem('shopId'), form)
    },

    get_profit_loss(form){
        return Api.post('/report/profit-loss?shop_id='+localStorage.getItem('shopId'), form)
    },
    get_account_balance(){
        return Api.get('/report/bank-balance?shop_id='+localStorage.getItem('shopId'))
    },
    get_bank_statement(paylod){
        return Api.post('/report/bank-statement?shop_id='+localStorage.getItem('shopId'), paylod)
    },
    get_logistics_statement(paylod){
        return Api.post('/report/logistics-statement?shop_id='+localStorage.getItem('shopId'), paylod)
    },
    get_payables(){
        return Api.post('/report/payables?shop_id='+localStorage.getItem('shopId'))
    },
    download_report(form){
        return Api.post('/report/download', form)
    },
    update_sales(form, id){
        return Api.post('/sell/update/'+id+'?shop_id='+localStorage.getItem('shopId'), form)
    }
    


}
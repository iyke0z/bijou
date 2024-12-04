import Api from "./Api"

export default {
    general_report(form) {
        return Api.post('/report', form)
    },

    generate_report(form) {
        return Api.post('/transaction-report', form)
    },
    

    get_sales_performance(form) {
        return Api.post('/report/sales-performance', form)
    },

    get_opex_report(form){
        return Api.post('/report/opex-performance', form)
    },

    get_debt_report(){
        return Api.get('/report/debt-performance')
    },

    get_cogs(form){
        return Api.post('/report/cogs-performance', form)
    },

    get_method_performance(form){
        return Api.post('/report/method-performance', form)
    },

    get_profit_loss(form){
        return Api.post('/report/profit-loss', form)
    }

}
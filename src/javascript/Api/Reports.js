import Api from "./Api"

export default {
    general_report(form) {
        return Api.post('/report', form)
    },

    cancelled_receipts(form) {
        return Api.post('/report/deleted', form)
    }
}
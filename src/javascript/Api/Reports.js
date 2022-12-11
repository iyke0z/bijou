import Api from "./Api"

export default {
    general_report(form) {
        return Api.post('/report', form)
    },

    generate_report(form) {
        return Api.post('/transaction-report', form)
    }
}
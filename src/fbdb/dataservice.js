import firebase from './firestore'
const db = firebase.ref('live_location')
export default {
    getAll() {
        return db;
    }
}
import { initializeApp, getApps } from 'firebase/app'
// import { initializeApp, getApps } from 'firebase/compat/app'

import { getMessaging } from 'firebase/messaging'


const firebaseConfig = {
    apiKey: "AIzaSyCbAxzwUcM6N2Bmtuj5CaPxw3r5taOe6Sg",
    authDomain: "gab-taxi-app.firebaseapp.com",
    databaseURL: "https://gab-taxi-app-default-rtdb.firebaseio.com/",
    projectId: "gab-taxi-app",
    storageBucket: "gab-taxi-app.appspot.com",
    messagingSenderId: "718413509679",
    appId: "1:718413509679:web:cf083324768d4a532f82da",
    measurementId: "G-DV886DXR7R"
};


const app = initializeApp(firebaseConfig)

export const messaging = getMessaging(app)

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";



const firebaseConfig = {
    apiKey: "AIzaSyD9VghZEt4cNOm5JqinTjOKLCPauXP9GQg",
    authDomain: "iot-project-f12a3.firebaseapp.com",
    databaseURL: "https://iot-project-f12a3-default-rtdb.firebaseio.com",
    projectId: "iot-project-f12a3",
    storageBucket: "iot-project-f12a3.appspot.com",
    messagingSenderId: "302504447533",
    appId: "1:302504447533:web:52999ef2ebef2ae426b2a4",
    measurementId: "G-HZ3EZT4P56"
  };

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export default app;
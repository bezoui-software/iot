import { getDatabase, ref, child, get } from "firebase/database";
import { database } from "./firebase";

const dbRef = ref(database);
get(child(dbRef, `history`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
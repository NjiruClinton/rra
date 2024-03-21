import Navbar from "../Components/Navbar";
import {initFlowbite} from "flowbite";
import Services from "./Services";
import Requests from "../Components/Requests";
import {useAuthValue} from "../AuthContext";
import {doc, setDoc, updateDoc, deleteDoc, getDoc, addDoc, collection} from "firebase/firestore";
import {auth, db} from "../firebase";
import {useEffect} from "react";

const Dashboard = ({mechanic}) => {
    initFlowbite();

    const {currentUser} = useAuthValue();
    useEffect(() => {
        const mechanicRef = doc(db, "mechanic", currentUser.email);
        getDoc(mechanicRef).then((docSnap) => {
            if (!docSnap.exists()) {
                console.log("No such document!");
                window.location.href = "/motorist"
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    , [currentUser.email]);



    return(
        <div className="w-full">
        <Navbar mechanic={mechanic}/>
            <Services/>
            <Requests />

        </div>
    )
}

export default Dashboard
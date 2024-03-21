import {useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import MotoristNav from "../Components/MotoristNav";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {useForm} from "react-hook-form";
import {doc, setDoc, updateDoc, deleteDoc, getDoc, addDoc, collection} from "firebase/firestore";
import {auth, db} from "../firebase";
import {useAuthValue} from "../AuthContext";
import React, { useRef } from 'react';
import emailjs, {send} from '@emailjs/browser';
import {initFlowbite} from "flowbite";

const RequestService = () => {
    initFlowbite();
    const {currentUser} = useAuthValue();
    const navigate = useNavigate();
    const location = useLocation();
    const { mechanic, serviceData } = location.state;
    const [currentLocation, setCurrentLocation] = useState("");
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [userdata, setUserdata] = useState({});

    // get user data from firestore collection 'motorists' where email field is equal to currentuser.email
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRef = doc(db, "motorists", currentUser.email);
                const userSnap = await getDoc(userRef);
                setUserdata(userSnap.data());
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [currentUser]);


    console.log("userdata ", userdata);
    //     console.log("mechanic ", mechanic);
    // console.log("serviceData ", serviceData);


    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const [map, setMap] = useState(null)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: ""
    })

    const onLoad = useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [center])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])


    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
            setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        });

        emailjs.init({
            publicKey: "8wGz3AhpezFNPK6Re",
            // Do not allow headless browsers
            blockHeadless: true,
            blockList: {
                // Block the suspended emails
                list: ['foo@emailjs.com', 'bar@emailjs.com'],
                // The variable contains the email address
                watchVariable: 'userEmail',
            },
            limitRate: {
                // Set the limit rate for the application
                id: 'app',
                // Allow 1 request per 10s
                throttle: 10000,
            },
        });

    }, []);

    console.log("Request data:", mechanic, serviceData);


    const form = useRef();

    const sendEmail = () => {
        // e.preventDefault();
        console.log("submitting... ")


        const serviceID = 'service_idoq2ho';
        const templateID = 'template_ay4yhpy';

        const templateParams = {
            to_name: mechanic.name,
            to_email: mechanic.email,
            from_name: currentUser.email,
            location: currentLocation,
            description: form.current.description.value,
            service: serviceData.service,
            from_username: userdata.name,
            from_phone: userdata.phone,
            mechanic_name: mechanic.name,
            from: currentUser.email,
        }
            emailjs.send(serviceID, templateID, templateParams)
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };
    // onsubmit
    const onSubmit = async (data) => {

        const requestRef = await addDoc(collection(db, "requests"), {
            description: data.description,
            mechanic_name: mechanic.name,
            location: currentLocation,
            from: currentUser.email,
            to: mechanic.email,
            from_username: userdata.name,
            from_phone: userdata.phone,
            service: serviceData.service,
            status: "pending",
            timestamp: new Date().getTime()
        }).then(async () => {
            // console.log("Request added with ID: ", requestRef.id);
            await sendEmail();
            window.alert("Request sent successfully, wait for a response from the mechanic.");
            navigate("/motorist")
        }).catch((error) => {
            console.error("Error adding document: ", error);

        });

        // console.log("Request added with ID: ", requestRef.id);

    }
    const handleClickedMap = (e) => {
        let latitude = e.latLng.lat()
        let longtitude  = e.latLng.lat()
        setCurrentLocation(`${latitude}, ${longtitude}`);
        console.log(latitude, longtitude)
    }


    return(
        <div className="mx-3 mb-5">

<MotoristNav/>


            <form ref={form} className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <h1>Request for this service</h1>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Problem description</label>
                    <textarea {...register("description", { required: true })} defaultValue={watch("description", "")}
                              rows="4" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your description here" required />
                    {errors.description && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div className="mb-5">
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location description</label>
                    <input type="text" id="location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your location description" />
                </div>

                <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Click anywhere on the map to select your location</p>
                <div className="mb-5 relative">
                    <input value={currentLocation} className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg py-2.5 px-4" disabled />
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={{ height: "300px", width: "100%" }}
                            center={center}
                            zoom={10}
                            onLoad={onLoad}
                            onClick={handleClickedMap}
                            onUnmount={onUnmount}
                        >
                            { /* Child components, such as markers, info windows, etc. */ }
                            <></>
                        </GoogleMap>
                    ) : <></>}
                </div>
                <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Or use your current location (default)</p>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>


        </div>
    );
}

export default RequestService;
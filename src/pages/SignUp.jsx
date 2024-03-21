import React, {useCallback, useEffect, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {auth, db} from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {useAuthValue} from "../AuthContext";
import {useForm} from "react-hook-form";
import { doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const CreateUser = (props) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [processError, setProcessError] = useState('');

    const {setTimeActive} = useAuthValue()


    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();



    const onSubmit = async (data) => {
        console.log(data)
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user)
                await setDoc(doc(db, "motorists", data.email), {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: 'motorist'
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        navigate('/sign-in')
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                // const errorMessage = error.message;
                // console.log(errorCode, errorMessage)
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        setProcessError('Email already in use')
                        break;
                    case 'auth/invalid-email':
                        setProcessError('Invalid email')
                        break;
                    case 'auth/weak-password':
                        setProcessError('Weak password')
                        break;
                    default:
                        setProcessError('An error occurred')
                }
            });
    }

    return (
        <div>

            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        {/*<img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" />*/}
                            Rescue Roadside Assistance - Motorist
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create motorist account
                            </h1>
                            {processError && <p className="text-red-500 text-xs mt-1">{processError}</p>}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your full name</label>
                                    <input {...register("name", { required: true })}
                                           type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="full name" required/>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}

                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input {...register("email", { required: true })}
                                           type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="example@gmail.com" required/>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                    <input {...register("phone", { required: true })}
                                           type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="2547..." required/>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                    <input {...register("password", { required: true })}
                                           type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat your password</label>
                                    <input {...register("confirm_password", {
                                        required: true,
                                        validate: (val) => {
                                            if (watch('password') !== val) {
                                                return "Your passwords do no match";
                                            }
                                        },
                                    })}
                                           type="password" name="confirm_password" id="confirm_password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                    {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                                </div>

                                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register as motorist</button>
                                <p className="text-sm font-light text-gray-500">
                                    Or <button onClick={() => {navigate('/sign-up-mechanic')}} className="font-medium text-blue-600 hover:underline">Register as Mechanic</button>
                                </p>

                                <p className="text-sm font-light text-gray-500">
                                    Already have an account? <button onClick={() => {navigate('/sign-in')}} className="font-medium text-blue-600 hover:underline">Login here</button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};


const RegisterMechanic = (props) => {

    const [currentLocation, setCurrentLocation] = useState("");
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const navigate = useNavigate();
    const [processError, setProcessError] = useState('');
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
    }, []);


    const onSubmit = async (data) => {
        console.log(data)
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user)
                await setDoc(doc(db, "mechanic", data.email), {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    latitude: currentLocation.split(",")[0],
                    longitude: currentLocation.split(",")[1],
                    role: 'mechanic'
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        navigate('/sign-in')
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                // const errorMessage = error.message;
                // console.log(errorCode, errorMessage)
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        setProcessError('Email already in use')
                        break;
                    case 'auth/invalid-email':
                        setProcessError('Invalid email')
                        break;
                    case 'auth/weak-password':
                        setProcessError('Weak password')
                        break;
                    default:
                        setProcessError('An error occurred')
                }
            });
    }

        const handleClickedMap = (e) => {
        let latitude = e.latLng.lat()
        let longtitude  = e.latLng.lat()
            setCurrentLocation(`${latitude}, ${longtitude}`);
        console.log(latitude, longtitude)
    }



    return (

        <section className=" mt-44 flex flex-grow">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    {/*<img className="w-8 h-8 mr-2" src="" />*/}
                    Rescue Roadside Assistance - Mechanic
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create mechanic account
                        </h1>
                        {processError && <p className="text-red-500 text-xs mt-1">{processError}</p>}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your full name</label>
                                <input {...register("name", { required: true })}
                                       type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Username" required/>
                                {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input {...register("email", { required: true })}
                                       type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="example@gmail.com" required/>
                                {errors.email && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input {...register("phone", { required: true })}
                                       type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="2547..." required/>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                            </div>

                            {/*<div>*/}
                            {/*    <label htmlFor="availability" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Availability</label>*/}
                            {/*    <input {...register("availability", { required: true })}*/}
                            {/*           type="text" name="availability" id="availability" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="availability" required/>*/}
                            {/*    {errors.availability && <p className="text-red-500 text-xs mt-1">This field is required</p>}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Latitude</label>*/}
                            {/*    <input {...register("latitude", { required: true })}*/}
                            {/*           type="text" name="latitude" id="latitude" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="latitude" required/>*/}
                            {/*    {errors.latitude && <p className="text-red-500 text-xs mt-1">This field is required</p>}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Longitude</label>*/}
                            {/*    <input {...register("longitude", { required: true })}*/}
                            {/*           type="text" name="longitude" id="longitude" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="longitude" required/>*/}
                            {/*    {errors.longitude && <p className="text-red-500 text-xs mt-1">This field is required</p>}*/}
                            {/*</div>*/}

                            <h1>Click anywhere on the map to select your location</h1>
                            <input value={currentLocation} className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg"/>
                            {
                                isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        zoom={10}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                        onClick={handleClickedMap}
                                    >
                                        { /* Child components, such as markers, info windows, etc. */ }
                                        <></>
                                    </GoogleMap>
                                ) : <></>
                            }
                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Or use your current location (default)</p>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                <input {...register("password", { required: true })}
                                       type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                {errors.password && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat your password</label>
                                <input {...register("confirm_password", {
                                    required: true,
                                    validate: (val) => {
                                        if (watch('password') !== val) {
                                            return "Your passwords do no match";
                                        }
                                    },
                                })}
                                       type="password" name="confirm_password" id="confirm_password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                            </div>

                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register as mechanic</button>
                            <p className="text-sm font-light text-gray-500">
                                Or <button onClick={() => {navigate('/sign-up')}} className="font-medium text-blue-600 hover:underline">Register as a motorist</button>
                            </p>
                            <p className="text-sm font-light text-gray-500">
                                Already have an account? <button onClick={() => {navigate('/sign-in')}} className="font-medium text-blue-600 hover:underline">Login here</button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    )
}

export {CreateUser, RegisterMechanic};
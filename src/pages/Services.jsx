import {initFlowbite} from "flowbite";
import {useForm} from "react-hook-form";
import {useAuthValue} from "../AuthContext";
import {auth, db} from "../firebase";
import { doc, setDoc, updateDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import {useEffect, useState} from "react";

const Services = () => {
    initFlowbite();
    const {currentUser} = useAuthValue()
    const [services, setServices] = useState([]);
    const [editservice, setEditservice] = useState(false)
    const [editdescription, setEditdescription] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "mechanic", currentUser.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const servicesData = docSnap.data().services;
                    const servicesArray = Object.entries(servicesData).map(([id, service]) => ({
                        id,
                        ...service
                    }));
                    setServices(servicesArray);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchData();
    }, [currentUser.email]);


    // console.log("serviceshere: ", services)
    // handle edit, edit the service name and description where the id matches
    const handleEdit = async (id) => {
        console.log("id: ", id)
        // try {
        //     const updatedServices = services.map(service => {
        //         if (service.id === id) {
        //             return {
        //                 ...service,
        //                 service: editservice,
        //                 description: editdescription
        //             };
        //         }
        //         return service;
        //     });
        //     const docRef = doc(db, "mechanic", currentUser.email);
        //     await updateDoc(docRef, { services: updatedServices });
        //     setServices(updatedServices);
        // } catch (error) {
        //     console.error("Error updating service:", error);
        // }
    }

    const handleDelete = async (id) => {
        try {
            const updatedServices = services.filter(service => service.id !== id);
            const docRef = doc(db, "mechanic", currentUser.email);
            await updateDoc(docRef, { services: updatedServices });
            setServices(updatedServices);
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submit = async (data) =>{
        const docRef = doc(db, "mechanic", currentUser.email);
        const docSnap = await getDoc(docRef);

        const newServiceId = Date.now().toString(); // You can use a more sophisticated method for generating IDs if needed

        // Define new data to be added
        const newData = {
            [newServiceId]: {
                service: data.service,
                price: data.price,
                description: data.description
            }
        };
    //     add data to map 'services' in the collection
        await updateDoc(docRef, {
            services: {
                ...docSnap.data().services,
                ...newData
            }
        }).then(() => {
            window.alert("Service added successfully")
        //     reload window
            window.location.reload()
        }).catch((error) => {
            console.error("Error adding service: ", error)
        });

    }

    return(
        <div className="w-full">

            <div id="authentication-modal" tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Create a new service
                            </h3>
                            <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                                <div>
                                    <label form="service" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service name</label>
                                    <input {...register("service", {required: true})}
                                        type="text" name="service" id="service" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="service name" required />
                                    {errors.service && <p className="text-red-500 text-xs italic">Service name is required</p>}
                                </div>
                                <div>
                                    <label form="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                    <input {...register("price", {required: true})}
                                           type="text" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="service name" required />
                                    {errors.price && <p className="text-red-500 text-xs italic">Price is required</p>}
                                </div>
                                <div>
                                    <label form="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <input {...register("description", {required: true})}
                                        type="text" name="description" id="description" placeholder="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    {errors.description && <p className="text-red-500 text-xs italic">Description is required</p>}
                                </div>

                                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>




            <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg  w-full md:w-1/2">

                <button data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" className=" mb-5 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Add service
                </button>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Service name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price (Ksh)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {services.map(service => (
                    <tr key={service.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {service.service}
                        </th>
                        <td className="px-6 py-4">
                            {service.price}
                        </td>
                        <td className="px-6 py-4">
                            {service.description}
                        </td>
                        <td className="px-6 py-4 flex justify-between">
                            {/*<button data-modal-target="editservice-modal" data-modal-toggle="editservice-modal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>*/}

                            <div id="editservice-modal" tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                <div className="relative p-4 w-full max-w-md max-h-full">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Edit service
                                            </h3>
                                            <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="editservice-modal">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>

                                        <div className="p-4 md:p-5" >
                                            <form className="space-y-4" onSubmit={() => {
                                                handleEdit(service.id)
                                            }}>
                                                <div>
                                                    <label form="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service name</label>
                                                    <input onChange={(e)=>setEditservice(e.target.value)}
                                                           type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="service name" required />
                                                </div>
                                                <div>
                                                    <label form="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service desription</label>
                                                    <input onChange={(e)=>setEditdescription(e.target.value)}
                                                           type="text" name="description" id="password" placeholder="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                                </div>

                                                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">submit</button>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button  onClick={() => handleDelete(service.id)} data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="font-medium text-red-600 dark:text-blue-500 hover:underline" type="button">
                                Delete
                            </button>


                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div id="popup-modal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this service?</h3>
                            <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Yes, I'm sure
                            </button>
                            <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Services
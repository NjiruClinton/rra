
import {auth, db} from "../firebase";
import {useAuthValue} from "../AuthContext";
import {useState, useEffect}  from "react";
import {doc, setDoc, updateDoc, deleteDoc, getDocs, query, collection, where} from "firebase/firestore";

const Requests = () => {
    const {currentUser} = useAuthValue();

    const [requests, setRequests] = useState([]);

    // from firestore collection 'requests' get all data where email is the email of the logged in user
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requestsRef = collection(db, "requests");
                const q = query(requestsRef, where("to", "==", currentUser.email));
                const snapshot = await getDocs(q);
                const requestsData = snapshot.docs.map(doc => doc.data());
                setRequests(requestsData);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchRequests();
    }, [currentUser]);
    console.log("requests: ", requests)

    return (
        <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:w-2/3 w-full mx-auto mt-10">
                <h1>All requests</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Location
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Service Wanted
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((request, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'} border-b dark:border-gray-700`}>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{request.from_username}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{request.from}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{request.from_phone}</td>
                            <td className="px-6 py-4 text-blue-500 underline flex flex-row">
                                {/*{request.location}*/}
                                <a href={`https://www.google.com/maps/search/?api=1&query=${request.location}`} target="_blank" rel="noreferrer">Location
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>

                                </a>
                            </td>

                            <td className="px-6 py-4">{request.description}</td>
                            <td className="px-6 py-4">{request.service}</td>
                            <td className="px-6 py-4">{
                                // request.timestamp // convert to time
                                new Date(request.timestamp).toLocaleString()
                            }</td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Done</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Requests;
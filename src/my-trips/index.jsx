import UserTripCardItem from '@/components/my-trips/UserTripCardItem';
import { db } from '@/service/firebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";

function MyTrips() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [userTrips, setUserTrips] = useState([]);

    /* Used to get all user trips */
    const getUserTrips = async () => {
        if (!user) {
            navigate('/');
            return;
        }
        const qry = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(qry);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push(doc.data());
        });
        setUserTrips(trips);
    }

    const deleteUserTripById = async (tripId) => {
        if (!user) {
            navigate('/');
            return;
        }
        const docRef = doc(db, 'AITrips', tripId);
        await deleteDoc(docRef);
        window.location.reload();
    }

    useEffect(() => {
        getUserTrips();
    }, []);

    return (
        <div className='sm:px-10 md:px-32 lg:px-44 xl:px-96 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>My Trips</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                {userTrips?.length > 0 ? userTrips.map((trip, index) => (
                    <div key={index} className='hover:scale-105 transition-all'>
                        <div onClick={() => deleteUserTripById(trip.id)} className='absolute z-10 cursor-pointer bg-white shadow-md rounded-full mt-2 ml-2 p-1 border hover:bg-gray-100'>
                            <MdDeleteForever className='text-red-600  w-5 h-5 hover:text-red-500 hover:scale-110 ' />
                        </div>
                        <UserTripCardItem trip={trip} />
                    </div>
                ))
                    :
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className='h-[220px] w-full bg-slate-200 rounded-xl'></div>
                    ))
                }
            </div>
        </div>
    );
}

export default MyTrips;

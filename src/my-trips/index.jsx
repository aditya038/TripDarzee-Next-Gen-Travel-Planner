import UserTripCardItem from '@/components/my-trips/UserTripCardItem';
import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        getUserTrips();
    }, []); // Empty dependency array to run only once

    return (
        <div className='sm:px-10 md:px-32 lg:px-44 xl:px-96 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>My Trips</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                {userTrips?.length > 0 ? userTrips.map((trip, index) => (
                    <UserTripCardItem key={index} trip={trip} />
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

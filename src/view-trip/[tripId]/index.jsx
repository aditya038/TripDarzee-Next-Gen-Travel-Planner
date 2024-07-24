import Footer from "@/components/view-trip/Footer";
import Hotels from "@/components/view-trip/Hotels";
import InfoSection from "@/components/view-trip/InfoSection";
import PlaceToVisit from "@/components/view-trip/PlaceToVisit";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { toast } from "sonner";

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);

    /* Used to get Trip Information from Firebase */
    const getTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setTrip(docSnap.data());
        } else {
            toast.error('No Trip Found!');
        }
    }

    useEffect(() => {
        tripId && getTripData();
    }, [tripId])

    return (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56">
            {/* Information Section */}
            <InfoSection trip={trip} />
            {/* Recommended Hotels */}
            <Hotels trip={trip} />
            {/* Daily Plan */}
            <PlaceToVisit trip={trip} />
        </div>
    )
}

export default ViewTrip
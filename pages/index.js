
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import reservation_abi from "../artifacts/contracts/Reservation.sol/Reservation.json";


export default function HomePage() {
    const [reservationStatus, setReservationStatus] = useState(false);

    // Function to fetch contract and set up signer
    const getContract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, reservation_abi.abi, signer);
        return contract;
    };

    // Function to make a reservation
    const makeReservation = async () => {
        const contract = await getContract();
        await contract.makeReservation();
        setReservationStatus(true);
    };

    // Function to cancel a reservation
    const cancelReservation = async () => {
        const contract = await getContract();
        await contract.cancelReservation();
        setReservationStatus(false);
    };

    // Function to get reservation status
    useEffect(() => {
        const fetchReservationStatus = async () => {
            const contract = await getContract();
            const status = await contract.getReservationStatus(await contract.signer.getAddress());
            setReservationStatus(status);
        };
        fetchReservationStatus();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Reservation System</h1>
            <p className="status">Reservation Status: {reservationStatus ? "Reserved" : "Not Reserved"}</p>
            <button className="action-button" onClick={makeReservation}>Make Reservation</button>
            <button className="action-button" onClick={cancelReservation}>Cancel Reservation</button>
        </div>
    );
}

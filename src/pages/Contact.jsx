import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
    const [message, setMessage] = useState('');
    const [landlord, setLandloard] = useState(null);
    // eslint-disable-next-line
    const [SearchParams, setSearchParams] = useSearchParams();

    const params = useParams();

    const onChange = () => {

    }

    useEffect(() => {
        const getLandLoard = async () => {
            const docRef = doc(db, 'users', params.landlordId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLandloard(docSnap.data());
            } else {
                toast.error("could not get landloard Data");
            }
        }
        getLandLoard();
    }, [params.landlordId]);
    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">
                    Contact LandLoard
                </p>
            </header>
            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">{landlord?.name}</p>
                    </div>

                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">Message</label>
                            <textarea name="message" id="message" className='textarea' value={message} onChange={onChange} ></textarea>
                        </div>

                        <a href={`mailto:${landlord.email}?Subject=${SearchParams.get('listingName')}&body=${message}`}>
                            <button type="button" className='primaryButton' >Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}

export default Contact

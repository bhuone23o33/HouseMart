import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import homeIcon from '../assets/svg/homeIcon.svg'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'

function Profile() {
    // initializing firebase sdk
    const auth = getAuth();
    // change detail flag
    const [changeDetails, setChangeDetails] = useState(false);

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    // setting up user data
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    });

    const { name, email } = formData;
    // navigate function
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(
                listingsRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    // onDelete a listings
    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId))
            const updatedListings = listings.filter(
                (listing) => listing.id !== listingId
            )
            setListings(updatedListings)
            toast.success('Successfully deleted listing')
        }
    }

    // onEditing a listings
    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    // logout function
    const onClick = () => {
        // this function singout the current account
        auth.signOut();
        navigate('/');

    }

    // onSubmit function calls when change is occur
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // update profile in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })

                // update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid);

                await updateDoc(userRef, {
                    name,
                });

            }

        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    // onchange function when value is change in inputs
    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">
                    My Profile
                </p>
                <button type="button" className="logOut" onClick={onClick}>
                    Logout
                </button>
            </header>

            {/* details */}
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">
                        Personal Details
                    </p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prev) => !prev);
                    }}>
                        {changeDetails ? 'Done' : 'Change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form >
                        <input
                            type="text"
                            id="name"
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="email"
                            id="email"
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className='createListing' >
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="right" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
                            ))}
                        </ul>
                    </>
                )}

            </main>
        </div>
    )
}

export default Profile

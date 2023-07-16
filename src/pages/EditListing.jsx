import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { updateDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore'

function EditListing() {
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);

    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    });

    // destructuring formdata so that no use again n again formData...
    const
        {
            type,
            name,
            bedrooms,
            bathrooms,
            parking,
            furnished,
            address,
            offer,
            regularPrice,
            discountedPrice,
            images,
            latitude,
            longitude
        } = formData;

    const auth = getAuth();
    const params = useParams();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    //redirect if not it's user
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('You can not edit this listing');
            navigate('/');
        }
    }, []);

    // for previous Data that to be edit a list
    useEffect(() => {
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data(), address: docSnap.data().loacation, latitude: docSnap.data().latitude })
                setLoading(false);
            } else {
                navigate('/');
                toast.error("Listing does't exist");
            }
        }
        fetchListing();
    }, [params.listingId, navigate]);


    // sets userRef to firebase
    useEffect(() => {
        if (isMounted) {
            // if user is logged in or not
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // set the id of user in form data who is logged in
                    setFormData({ ...formData, userRef: user.uid });
                    setLoading(false);
                } else {
                    navigate('/sign-in');
                }
            })

        }

        return () => {
            isMounted.current = false;
        }
    }, [isMounted]);

    if (loading) {
        return <Spinner />
    }

    // onsubmit function 
    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        console.log(discountedPrice >= regularPrice);
        // checking some parameters
        if ((discountedPrice >= regularPrice) && type !== 'rent') {
            setLoading(false);
            toast.error("Discounte Price needs to be less than regular Price");
            return
        }

        if (images.length > 6) {
            setLoading(false);
            toast.error("Image Length is 6");
            return;
        }

        // gelocation
        // set image to firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                // giving the unique fileName to image;
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

                const storageRef = ref(storage, 'images/' + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                // console.log('Upload is paused');
                                break;
                            case 'running':
                                // console.log('Upload is running');
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            })
        }

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false);
            toast.error('Image size should be less than 5 MB');
            return;
        })
        // console.log(imageUrls);

        const formDataCopy = {
            ...formData,
            imageUrls,
            timestamp: serverTimestamp()
        }

        delete formDataCopy.images;
        formDataCopy.loacation = address;
        delete formDataCopy.address;

        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        const docRef = doc(db, 'listings', params.listingId);

        await updateDoc(docRef, formDataCopy);

        setLoading(false);

        toast.success("successfuly added!!");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }


    // onMutate function 
    const onMutate = (e) => {
        let boolean = null;
        if (e.target.value === 'true') {
            boolean = true;
        }
        if (e.target.value === 'false') {
            boolean = false;
        }

        // file\
        if (e.target.files) {
            setFormData((prev) => (
                {
                    ...prev,
                    images: e.target.files
                }
            ))
        }


        // text/boolean
        if (!e.target.files) {
            setFormData((prev) => (
                {
                    ...prev,
                    [e.target.id]: boolean ?? e.target.value,
                }
            ))
        }
    }

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">Edit Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className="formLabel">Sell/Rent</label>
                    <div className="formButtons">
                        <button type="button" id="type" value="sale" onClick={onMutate} className={type === 'sale' ? 'formButtonActive' : 'formButton'}>Sell</button>
                        <button type="button" id="type" value="rent" onClick={onMutate} className={type === 'rent' ? 'formButtonActive' : 'formButton'}>Rent</button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Bedrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Bathrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>

                    <label className='formLabel'>Parking spot</label>
                    <div className='formButtons'>
                        <button
                            className={parking ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !parking && parking !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='parking'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        <button
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !furnished && furnished !== null
                                    ? 'formButtonActive'
                                    : 'formButton'
                            }
                            type='button'
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    {!geoLocationEnabled && (
                        <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='latitude'
                                    value={latitude}
                                    step='any'
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='longitude'
                                    value={longitude}
                                    step='any'
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                            className={offer ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !offer && offer !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'>₹ / Month</p>}
                    </div>

                    {offer && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button type='submit' className='primaryButton createListingButton'>
                        Edit Listing
                    </button>
                </form>
            </main>
        </div>
    )
}

export default EditListing



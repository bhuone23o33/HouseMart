import React from 'react';
import { useNavigate, useLocation, useLoaderData } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {

    const location = useLocation();
    const navigate = useNavigate();

    const onGoogle = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // if user exist
            const docRef = doc(db, 'users', user.uid);
            const docS = await getDoc(docRef);

            // if user exist in database or not if not then
            if (!docS.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }

            navigate('/');

        } catch (error) {
            toast.error('Not Authorized by Google');
        }
    }
    return (
        <div className='socialLogin'>
            <p>
                sign {location.pathname == '/sign-in' ? 'in' : 'up'} with
            </p>
            <button onClick={onGoogle} className="socialIconDiv"> <img className='socialIconImg' src={googleIcon} alt="Google" /></button>
        </div>
    )
}

export default OAuth

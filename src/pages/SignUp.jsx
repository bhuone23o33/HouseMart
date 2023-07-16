import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../firebase.config';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignUp() {
    // to show password
    const [showPassword, setShowPassword] = useState(false);

    // storing form data
    const [FormData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // using form data
    const { name, email, password } = FormData;

    // navigate 
    const navigate = useNavigate();

    // onChange function

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }
        ))
    }

    // onSubmit function

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            // initializing auth 
            const auth = getAuth();

            // registoring user data and receive promise from that
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // accessing user data;
            const user = userCredential.user;

            // update currentUser
            updateProfile(auth.currentUser, {
                displayName: name,
            });


            const formDataCopy = { ...FormData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, "users", user.uid), formDataCopy);

            navigate('/');
        } catch (error) {
            toast.error("Something went wrong in SigningUp")
        }


    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back!
                    </p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input type="text" id="name" value={name} onChange={onChange} placeholder='Name' className="nameInput" />
                        <input type="email" id="email" value={email} onChange={onChange} placeholder='Email' className="emailInput" />
                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className='passwordInput' id="password" onChange={onChange} value={password} placeholder='Password' />
                            <img src={visibilityIcon} alt="showPassword" className="showPassword" onClick={() => setShowPassword((prev) => !prev)} />
                        </div>

                        <Link to="/forget-password" className="forgotPasswordLink">
                            Forget Password
                        </Link>

                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill="#ffffff" widht="34px" height="34px" />
                            </button>
                        </div>

                    </form>
                    {/* Google OAuth here */}
                    <OAuth />

                    {/* signup Page here */}
                    <Link to="/sign-in" className='registerLink'>
                        SignIn instead
                    </Link>
                </main>
            </div>
        </>
    )
}

export default SignUp

import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgetPassword() {
    const [email, setEmail] = useState('');

    const onChange = (e) => {
        setEmail(e.target.value);

    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Password Email Sent")
        } catch (error) {
            toast.error('Try after sometime!!');
        }
    }
    return (
        <div className='pageContainer '>
            <header>
                <p className="pageHeader">
                    Forget Password
                </p>
            </header>

            <form onSubmit={onSubmit}>
                <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={onChange} />

                <Link className="forgotPasswordLink" to="/sign-in">Sign In</Link>

                <div className="signInBar">
                    <div className="signInText">
                        Send Reset Link
                    </div>
                    <button type="submit" className="signInButton">
                        <ArrowRightIcon fill="#ffffff" widht="34px" height="34px" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ForgetPassword

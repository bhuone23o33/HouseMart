import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
    // to show password
    const [showPassword, setShowPassword] = useState(false);

    // storing form data
    const [FormData, setFormData] = useState({
        email: '',
        password: ''
    });

    // using form data
    const { email, password } = FormData;

    // navigate 
    const navigate = useNavigate();

    // onChange function

    const onChange = (e) => {
        setFormData((prev) => (
            {
                ...prev,
                [e.target.id]: e.target.value
            }
        ));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // initializing firebases sdk
            const auth = getAuth();

            // sign in with user credintial
            const userCredintial = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            if (userCredintial.user) {
                navigate('/');
            }

        } catch (error) {
            toast.error("Invalid User Credentiald");
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
                        <input type="email" id="email" value={email} onChange={onChange} placeholder='Email' className="emailInput" />
                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className='passwordInput' id="password" onChange={onChange} value={password} placeholder='Password' />
                            <img src={visibilityIcon} alt="showPassword" className="showPassword" onClick={() => setShowPassword((prev) => !prev)} />
                        </div>

                        <Link to="/forget-password" className="forgotPasswordLink">
                            Forget Password
                        </Link>

                        <div className="signInBar">
                            <p className="signInText">
                                Sign In
                            </p>
                            <button className="signInButton">
                                <ArrowRightIcon fill="#ffffff" widht="34px" height="34px" />
                            </button>
                        </div>
                    </form>
                    {/* Google OAuth here */}
                    <OAuth />
                    {/* signup Page here */}
                    <Link to="/sign-up" className='registerLink'>
                        Signup Instead
                    </Link>
                </main>
            </div>
        </>
    )
}

export default SignIn

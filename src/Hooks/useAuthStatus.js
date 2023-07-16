import React from 'react';
import { useEffect,useState,useRef } from 'react';
import { getAuth,onAuthStateChanged } from 'firebase/auth';

const useAuthStatus = () => {
    const [loggedIn,setLoggedIn] = useState(false);
    const [Checking,setChecking] = useState(true);
    const isMounted = useRef(true);

    useEffect(()=>{
        if(isMounted){
            // setting auth 
            const auth = getAuth();

            // it will fire off when singin or logout
            onAuthStateChanged(auth,(user)=>{
                if(user){
                    setLoggedIn(true);
                }
                setChecking(false);
            })
        }

        return ()=>{
            isMounted.current = false;
        }
    },[]);
    
    return {loggedIn,Checking};
}

export default useAuthStatus

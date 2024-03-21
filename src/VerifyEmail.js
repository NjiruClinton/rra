import { sendEmailVerification } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "./AuthContext";
import {auth, db} from "./firebase";
import {doc, getDoc} from "firebase/firestore";

const VerifyEmail = () => {
    const { currentUser } = useAuthValue()
    const [time, setTime] = useState(60)
    const { timeActive, setTimeActive } = useAuthValue()
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            currentUser?.reload()
                .then(() => {
                    if (currentUser?.emailVerified) {
                        clearInterval(interval)
                        navigate('/sign-in')
                    }
                })
                .catch((err) => {
                    alert(err.message)
                })
        }, 1000)
    }, [navigate, currentUser])

    useEffect(() => {
        let interval = null
        if (timeActive && time !== 0) {
            interval = setInterval(() => {
                setTime((time) => time - 1)
            }, 1000)
        } else if (time === 0) {
            setTimeActive(false)
            setTime(60)
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [timeActive, time, setTimeActive])

    const resendEmailVerification = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                setTimeActive(true)
            }).catch((err) => {
            alert(err.message)
        })
    }

    return (
        <div className='center h-[100vh] w-full p-1 flex flex-col justify-center items-center bg-gray-50'>
            <a href="/admin" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                {/*<img className="w-8 h-8 mr-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN-zZZh-tdCaHLdsqwil0vIA7s5M-0ngWMgkrQnlWSuZLHynKBHjozGWaMc-UPNXgtAys&usqp=CAU" alt="logo" />*/}
                Rescue Roadside Assistance
            </a>
            <div className='verifyEmail h-[20rem] border rounded-lg p-2 bg-white flex flex-col justify-center items-center'>
                <h1 className="text-xl font-[700] text-center p-2">Verify your Email Address</h1>
                <p className="pl-2">
                    <strong className="text-lg p-2 inline-flex mt-[0.3rem] font-[300]">A Verification email has been sent to:</strong><br />
                    <span
                        className="w-full flex justify-center items-center"
                    >
                    <span className="bg-slate-400/10 p-1 rounded-lg text-sky-500 text-[1.1rem]">
                        {currentUser?.email}
                    </span>
                    </span>
                </p>
                <div className="flex flex-col justify-center items-center p-1">
                    <span className="lg:text-[1rem] text-[0.6rem] italic w-full p-1">Follow the instruction in the email to verify your account</span>
                    <button
                        className={`${timeActive ? 'bg-blue-400' : 'hover:bg-blue-500 bg-blue-700'} mt-1 border p-2 pl-3 pr-3 rounded-full w-fit text-center text-white font-[700]`}
                        onClick={resendEmailVerification}
                        disabled={timeActive}
                    > Resend Email {timeActive && `in ${time}`}</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
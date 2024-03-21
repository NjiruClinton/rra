import Navbar from "./Components/Navbar";
import {initFlowbite} from "flowbite";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {auth} from "./firebase";
import {onAuthStateChanged} from "firebase/auth";
import {AuthProvider} from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import {CreateUser, RegisterMechanic} from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import VerifyEmail from "./VerifyEmail";
import Login from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Motorist from "./pages/Motorist";
import Services from "./pages/Services";
import RequestService from "./pages/RequestService";

function App() {
    initFlowbite();
    const [currentUser, setCurrentUser] = useState(null)
    const [timeActive, setTimeActive] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })
    }, [])

  return (
    <div className="App">
        <Router>
            <AuthProvider value={{currentUser, timeActive, setTimeActive}}>
                <Routes>

                    <Route path="/" element={<Welcome/>} />
                    <Route path="/sign-up" element={<CreateUser/>} />
                    <Route path="/sign-in" element={<Login/>} />
                    <Route path="/verify-email" element={<VerifyEmail/>} />
                    <Route path="/sign-up-mechanic" element={<RegisterMechanic/>} />

                    <Route path="/mechanic" element={
                        <PrivateRoute prevRoute = '/mechanic'>
                            <Dashboard mechanic={"mechanic"}/>
                        </PrivateRoute>
                    } />
                    <Route path="/motorist" element={
                        <PrivateRoute prevRoute = '/motorist'>
                            <Motorist motorist={"motorist"}/>
                        </PrivateRoute>
                    } />
                    <Route path="/request" element={
                        <PrivateRoute prevRoute = '/request'>
                            <RequestService/>
                        </PrivateRoute>
                    } />
                    {/*<Route path="/services" element={*/}
                    {/*    <PrivateRoute prevRoute = '/services'>*/}
                    {/*        <Services />*/}
                    {/*    </PrivateRoute>*/}
                    {/*} />*/}


                </Routes>

            </AuthProvider>
        </Router>
    </div>
  );
}

export default App;

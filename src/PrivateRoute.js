import {Navigate} from 'react-router-dom'
import {useAuthValue} from './AuthContext'

export default function PrivateRoute({children, prevRoute}) {
    const {currentUser} = useAuthValue()

    if(!currentUser?.emailVerified) {
        return <Navigate to={prevRoute} replace/>
    }
    if(!currentUser) {
        return <Navigate to="/sign-in" replace/>
    }

    return children
}
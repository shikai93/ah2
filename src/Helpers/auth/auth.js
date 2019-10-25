import React, { useState, useEffect } from "react"
import Model from "../../Models/Models.js"
const AuthContext = React.createContext()
function AuthProvider(props) {
    const [isAuthenticated, setAuthenticated] = useState({});

    useEffect(() => { 
        const api = new Model();
        api.postReq('/token/verify',{
            userId : localStorage.getItem("userId"),
            token : localStorage.getItem("authenticationToken")
        },(values) =>{
            if (values.success) {
                setAuthenticated(true)
            } else {
                setAuthenticated(false)
            }
        })
    }, [setAuthenticated,isAuthenticated])
    return (
        <AuthContext.Provider value={{isAuthenticated, setAuthenticated}} {...props} >
            {props.children}
        </AuthContext.Provider>
    )
}
function authenticate(username, password, authManager, callback) {
    const api = new Model();
    api.postReq('/login',{
        username: username,
        password : password
    },(values) => {
        if (values.success) {
            const val = values.value
            authManager.setAuthenticated(true)
            localStorage.setItem("userId",val.userId)
            localStorage.setItem("authenticationToken",val.token)
        } else {
            authManager.setAuthenticated(false)
        }
        callback(values.success)
    })
}
const useAuth = () => React.useContext(AuthContext)
export {AuthProvider, useAuth, AuthContext, authenticate}
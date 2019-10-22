import React, { useState, useEffect } from "react"
const AuthContext = React.createContext()
function AuthProvider(props) {
    const [isAuthenticated, setAuthenticated] = useState({});
    useEffect(() => { 
        setAuthenticated(localStorage.getItem("isAuthenticated") === "true")
    }, [setAuthenticated,isAuthenticated])
    return (
        <AuthContext.Provider value={{isAuthenticated, setAuthenticated}} {...props} >
            {props.children}
        </AuthContext.Provider>
    )
}
function authenticate(username, password, authManager, callback) {
    if (username === 'test' && password === 'test') {
        authManager.setAuthenticated(true)
        localStorage.setItem("isAuthenticated",true)
        callback(true)
    } else {
        authManager.setAuthenticated(false)
        localStorage.setItem("isAuthenticated",false)
        callback(false)
    }
}
const useAuth = () => React.useContext(AuthContext)
export {AuthProvider, useAuth, AuthContext, authenticate}
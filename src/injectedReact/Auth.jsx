import React from 'react';
import Login from './Login.jsx';
import './style.css'

export default function Auth(props) {
    // setState = { setState } userLogin = { userLogin }
    return (
        <>
            <div style={props.state === 'register' ? { display: 'none' } : null} className="authDiv" >
                <Login state={props.state} setState={props.setState} setIsLogin={props.setIsLogin} />
            </div>
            <div style={props.state === 'login' ? { display: 'none' } : null} className="authDiv" >
                <Login state={props.state} setState={props.setState} setIsLogin={props.setIsLogin} />
            </div>
        </>
    )
}
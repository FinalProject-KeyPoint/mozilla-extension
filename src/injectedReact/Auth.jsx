import React from 'react';
import Login from './Login.jsx';

export default function Auth(props) {
    // setState = { setState } userLogin = { userLogin }
    return (
        <>
            <div style={props.state === 'register' ? { display: 'none' } : null} >
                <Login state={props.state} setState={props.setState} isLogin={props.isLogin} />
            </div>
            <div style={props.state === 'login' ? { display: 'none' } : null} >
                <Login state={props.state} setState={props.setState} setIsLogin={props.setIsLogin} />
            </div>
        </>
    )
}
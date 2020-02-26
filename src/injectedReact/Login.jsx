import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';

const baseURL = `https://allh8project.japhendywijaya.xyz`
export default function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)

    const onSubmitForm = e => {
        e.preventDefault()
        console.log(props.state);
        if (props.state === "login") {

            Axios.post('/users/login', { email, password }, { baseURL })
                .then(({ data }) => browser.storage.local.set({ token: data.token }))
                .then(() => {
                    props.setIsLogin(true)
                    setError(null)
                })
                .catch(({ response }) => setError(response.data.message));
        } else {
            Axios.post('/users/register', newUser, { baseURL })
                .then(({ data }) => browser.storage.local.set({ token: data.token }))
                .then(() => {
                    props.setIsLogin(true)
                    setError(null)
                })
        }

    }

    // const userLogin = oldUser => {
    //     console.log(`OK`)
    //     Axios.post('/users/login', oldUser, { baseURL })
    //         .then(({ data }) => browser.storage.local.set({ token: data.token }))
    //         .then(() => setIsLogin(true))
    //         .catch(({ response }) => setError(response.data.message));
    // };

    // const userRegister = newUser => {
    //     Axios.post('/users/register', newUser, { baseURL })
    //         .then(({ data }) => browser.storage.local.set({ token: data.token }))
    //         .then(() => setIsLogin(true));
    // };


    return (
        <Form onSubmit={onSubmitForm}>
            <div className="login">
                <div className="heading">
                    <h2>{props.state.toUpperCase()}</h2>
                </div>
                {
                    props.state === "register"
                    && <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                }
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <div>
                    <Button type="submit" className="float">{props.state === "login" ? "Login" : "Submit"}</Button>
                    {
                        props.state === "login"
                            ? <small onClick={() => props.setState('register')} >Don't have account yet? Sign Up</small>
                            : <small onClick={() => props.setState('login')} >Already have account? Sign In</small>
                    }
                </div>
            </div>
        </Form>
        // <div className="login">
        //     <div className="heading">
        //         <h2>{props.state.toUpperCase()}</h2>
        //         <form onSubmit={onSubmitForm}>
        //             {/* <h1 class="animated infinite bounce delay-2s">Example</h1> */}

        //             {
        //                 props.state === "register"
        //                 && <div className="input-group input-group-lg">
        //                     <span className="input-group-addon"><i className="fa fa-tag"></i></span>
        //                     <input type="text" className="form-control" placeholder="Username" />
        //                 </div>
        //             }
        //             <div className="input-group input-group-lg">
        //                 <span className="input-group-addon"><i className="fa fa-user"></i></span>
        //                 <input type="text" className="form-control" placeholder="Email" />
        //             </div>

        //             <div className="input-group input-group-lg">
        //                 <span className="input-group-addon"><i className="fa fa-lock"></i></span>
        //                 <input type="password" className="form-control" placeholder="Password" />
        //             </div>
        //             <div>
        //                 <Button type="submit" className="float">{props.state === "login" ? "Login" : "Submit"}</Button>
        //                 {
        //                     props.state === "login"
        //                         ? <small onClick={() => props.setState('register')} >Don't have account yet? Sign Up</small>
        //                         : <small onClick={() => props.setState('login')} >Already have account? Sign In</small>
        //                 }
        //             </div>
        //         </form>
        //     </div>
        // </div>
    )
}
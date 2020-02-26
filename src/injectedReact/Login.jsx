import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import './style.css'
// import { FaSignInAlt } from "react-icons/fa";
// import { IoIosCreate } from "react-icons/io";

const baseURL = `https://allh8project.japhendywijaya.xyz`
export default function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)

    const onSubmitForm = e => {
        e.preventDefault()
        console.log(props.state, 'props.state');
        if (props.state === "login") {
            Axios.post('/users/login', { email, password }, { baseURL })
                .then(({ data }) => browser.storage.local.set({ token: data.token }))
                .then(() => {
                    console.log(props.state, 'props.state lagi');
                    props.setIsLogin(true)
                    setError(null)
                })
                .catch(({ response }) => setError(response.data.message));
        } else {
            Axios.post('/users/register', { email, password, username }, { baseURL })
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
        <div>
            <Form onSubmit={onSubmitForm}>
                <div className="w-100">
                    <div className="mb-3">
                        <h4 style={{ textAlign: 'center' }}>
                            {
                                props.state === 'login'
                                    ? <span style={{ textAlign: 'center' }}>Sign In</span>
                                    : <span style={{ textAlign: 'center' }}>Sign Up</span>
                            }
                        </h4>
                    </div>
                    <div className="px-4">
                        {
                            props.state === "register"
                            && <Form.Group controlId="formGroupPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control style={{ height: 30 }} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                        }
                        <Form.Group controlId="formGroupEmail">
                            {/* <Form.Label>Email address</Form.Label> */}
                            <Form.Control style={{ height: 30 }} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            {/* <Form.Label>Password</Form.Label> */}
                            <Form.Control style={{ height: 30 }} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                        <Button style={{ height: 35 }} type="submit" block className="float w-75">{props.state === "login" ? "Login" : "Submit"}</Button>
                        {
                            props.state === "login"
                                ? <Button variant="link" style={{ marginTop: 5, cursor: 'pointer', color: 'cornflowerblue', fontSize: 13 }} onClick={() => props.setState('register')} >Don't have account yet? Sign Up</Button>
                                : <Button variant="link" style={{ marginTop: 5, cursor: 'pointer', color: 'cornflowerblue', fontSize: 13 }} onClick={() => props.setState('login')} >Already have account? Sign In</Button>
                        }
                        <hr />
                        <p style={{ color: 'red', textAlign: 'center', width: 280, fontSize: 15, marginBottom: -10 }} >{error ? JSON.stringify(error) : null}</p>
                    </div>
                </div>
            </Form>
        </div>
    )
}
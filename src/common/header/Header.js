import React,{useState} from 'react';
import Modal from 'react-modal';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

import './Header.css';
import logo from "../../assets/logo.svg"


const TabContainer = function(props){
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}


const Header = (props) => {
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [loginForm,setLoginForm] = useState({
        username:"",
        loginpassword:""
    });
    const [registerForm,setRegisterForm] = useState({
        firstname:"",
        lastname:"",
        email:"",
        registerpassword:"",
        contact:""
    });
    
    const [requiredRegisterForm,setRequiredRegisterForm] = useState({
        firstname:"",
        lastname:"",
        email:"",
        registerpassword:"",
        contact:""
    });
    
    const [requiredLoginForm,setRequiredLoginForm] = useState({
        username:"",
        loginpassword:""
    });
    
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token")== null ? false : true);
   
    const openModalHandler = () => {
        setModalIsOpen(true);
        setValue(0);
        setLoginForm({username:"",loginpassword:""});
        setRegisterForm({
                            firstname:"",
                            lastname:"",
                            email:"",
                            registerpassword:"",
                            contact:""
                        })
        setRequiredLoginForm({username:"requiredChecked",loginpassword:"requiredChecked"});
        setRequiredRegisterForm({
                            firstname:"requiredChecked",
                            lastname:"requiredChecked",
                            email:"requiredChecked",
                            registerpassword:"requiredChecked",
                            contact:"requiredChecked"
                        })  
    }

   const closeModalHandler = () => {
        setModalIsOpen(false);
    }
  
    const tabChangeHandler = (event, value) => {
        setValue(value); 
    }

    const  loginClickHandler = () => {

        let emptyFieldCheck = false;
        for (const key in loginForm) {
            const state = requiredLoginForm;
            if(loginForm[key]===""){
                state[key] = "requiredEmpty";
                emptyFieldCheck = true;
            }
            else
                state[key] = "requiredChecked";
            setRequiredLoginForm({...state})
        }
        
        if(emptyFieldCheck){
            setLoggedIn('empty');
            return;
        }

        let dataLogin = null;
        fetch(props.baseUrl + "auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Basic " + window.btoa(loginForm.username + ":" + loginForm.loginpassword)
            },
            body: dataLogin,
        })
        .then(async(response) => {
            if(response.ok){
                sessionStorage.setItem("access-token",response.headers.get("access-token"));
                 return response.json();
        } else{
            let error = await response.json();
            throw new Error("Something Went Wrong"+error);
        }
        })
        .then((data) => {
            sessionStorage.setItem("uuid", data.id);
            setLoggedIn(true);
            closeModalHandler();

        }).catch((error) => {
            setLoggedIn("error");
            console.log(error);
        });
    };
    
    const loginInputChangedHandler = (e) => {
        const state = loginForm;
        state[e.target.id] = e.target.value;
        setLoginForm({...state})
    }

    const registerInputChangedHandler = (e) => {
        const state = registerForm;
        state[e.target.id] = e.target.value;
        setRegisterForm({...state})
    }
    
    const  registerClickHandler = () => {
        
        let emptyFieldCheck = false;
        for (const key in registerForm) {
            const state = requiredRegisterForm;
            if(registerForm[key]===""){
                state[key] = "requiredEmpty";
                emptyFieldCheck = true;
            }
            else
                state[key] = "requiredChecked";
            setRequiredRegisterForm({...state})
        }
        if(emptyFieldCheck){
            setRegistrationSuccess("empty");
            return;
        }

        let dataRegistered = JSON.stringify({
            email_address: registerForm.email,
            first_name: registerForm.firstname,
            last_name: registerForm.lastname,
            mobile_number:registerForm.contact,
            password: registerForm.registerpassword
        });
        fetch(props.baseUrl + "signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Basic" + window.btoa(loginForm.username + ":" + loginForm.loginpassword)
            },
            body: dataRegistered,
        }).then((data) => {setRegistrationSuccess(true)});
    }

    const logoutHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        setLoggedIn(false);
    }


    return (
        <div>
            <header className="header">
                <img src={logo} className="logo" alt="Logo" />
                {!loggedIn ?
                    <div className="headerButton"><Button variant="contained" color="default" onClick={openModalHandler}>Login</Button></div>
                    :
                    <div className="headerButton"><Button variant="contained" color="default" onClick={logoutHandler}>Logout</Button></div>
                }
                {props.showBookShowButton === "true" && !loggedIn ? 
                    <div className="bookshow-button headerButton"><Button variant="contained" color="primary" onClick={openModalHandler}>Book Show</Button></div>
                    : ""
                }
                {props.showBookShowButton === "true" && loggedIn ? 
                    <div className="bookshow-button headerButton">
                        <Link to={"/bookshow/" + props.id}>
                            <Button variant="contained" color="primary">Book Show</Button>
                        </Link>
                    </div>
                    : ""
                }
            </header>
            
            <Modal
                isOpen={modalIsOpen}
                ariaHideApp={false}
                contentLabel="Login"
                onRequestClose={closeModalHandler}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}>
                
                <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {value === 0 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" username={loginForm.username} onChange={loginInputChangedHandler} />
                            <FormHelperText className={requiredLoginForm.username}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="loginpassword">Password</InputLabel>
                            <Input id="loginpassword" type="password" loginpassword={loginForm.loginpassword} onChange={loginInputChangedHandler} />
                            <FormHelperText className={requiredLoginForm.loginpassword}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        {loggedIn === true &&
                            <FormControl><span className="successText">Login Successful!</span></FormControl>
                        }
                        {loggedIn === "error" &&
                            <FormControl><span className="successText">Invalid Credentials!</span></FormControl>
                        }
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                    </TabContainer>
                }
                {value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" firstname={registerForm.firstname} onChange={registerInputChangedHandler} />
                            <FormHelperText className={requiredRegisterForm.firstname}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" lastname={registerForm.lastname} onChange={registerInputChangedHandler} />
                            <FormHelperText className={requiredRegisterForm.lastname}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="text" email={registerForm.email} onChange={registerInputChangedHandler} />
                            <FormHelperText className={requiredRegisterForm.email}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="registerpassword">Password</InputLabel>
                            <Input id="registerpassword" type="password" registerpassword={registerForm.registerpassword} onChange={registerInputChangedHandler} />
                            <FormHelperText className={requiredRegisterForm.registerpassword}><span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="text" contact={registerForm.contact} onChange={registerInputChangedHandler} />
                            <FormHelperText className={requiredRegisterForm.contact}><span className="red">required</span></FormHelperText>
                        </FormControl>
                        <br /><br />
                        {registrationSuccess === true &&
                            <FormControl><span className="successText">Registration Successful. Please Login!</span></FormControl>
                        }
                        {registrationSuccess === "empty" &&
                            <FormControl><span className="successText">Registration Incomplete. Try Again!</span></FormControl>
                        }
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                    </TabContainer>
                }
            </Modal>
        </div>
    )
}

export default Header;
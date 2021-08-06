import React , { useState , useEffect  } from "react";
import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import axios from 'axios'

import {Navbar, Nav } from 'react-bootstrap';
import './Header.css';
import Login from "./Login";
import Signup from "./Signup";
import Logout from "./Logout";
import Home from "./Home";
import Blogwrite from "./Blogwrite";
import BlogUWrOte from "./BlogUWrOte";
import Settings from "./Settings";


const Header = () => {
  
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";

const [setJwt, UpdatesetJwt] = useState(null);
const [_image_name_, update_image_name_] = useState(null);
const [_url_, update_url_] = useState("https://localhost/image/");

useEffect(() => {

  if(setJwt != null){
  const interval = setInterval(() => {
    axios.get(backend_url+'/api/token/new/',{ headers: {'Authorization': `Bearer ${setJwt}`},withCredentials: true})
        .then((respose) => {
          // console.log(respose.data)
          try{
          UpdatesetJwt(respose.data["access"]);
          }catch(e)
          {
             UpdatesetJwt(null);
          }
          
        })
        .catch((error) => {
            // console.log(error)
            UpdatesetJwt(null);
        })
  }, 270000);
  return () => clearInterval(interval);
}

}, [setJwt]);

 useEffect(() => {
           axios.post(backend_url+'/api/access/refresh/',{
              payload:null
              }
              ,{ withCredentials: true })
        .then((respose) => {
          // console.log(res.data)
          try{
            UpdatesetJwt(respose.data["access"]);
            _call_with_response_(respose.data["access"])
          }catch(e)
          {
             UpdatesetJwt(null);
          }
        })
        .catch((error) => {
          // console.error(error)
          UpdatesetJwt(null);
          // window.location.href = '/login';
        })
    
  },[]);


function _call_with_response_(pass_token){

    // for temp upload isn't available
    update_image_name_("http://"+window.location.host+"/profile.png")
        axios.get(backend_url+'/api/get_data_of_user/',{ headers: {'Authorization': `Bearer ${pass_token}`}})
        .then((respose) => {
          // console.log(respose.data[0].["image_url"])
          
          // update_image_name_(_url_+respose.data[0].["image_url"])
          console.log(_image_name_)
        })
        .catch((error) => {
          // console.error(error)
          // UpdatesetJwt(null);
        })
    
}


return (
 	<>
   {
  (setJwt === null)
          ? 
 	<BrowserRouter>
	<Navbar bg="light" expand="sm">
	   <Nav><Link className="" to="/home"><img src="/home.jpg" alt='Opps something went wrong' widht='50px' height='50px;'/></Link></Nav>
	  <Navbar.Toggle aria-controls="basic-navbar-nav" />
	  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
	      <Nav><Link  style={{"textDecoration": "none"}} className="hover_effect" to="/home">Home</Link></Nav>
	      <Nav><Link   style={{"textDecoration": "none"}} className="hover_effect" to="/login">Login</Link></Nav>
	      <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  to="/Signup">Signup</Link></Nav>
	    </Nav>
	  </Navbar.Collapse>
	</Navbar>
		<Switch>
		<Route path="/home">
           <Home />
        </Route>
          <Route path="/login">
           <Login />
          </Route>
          <Route path="/Signup">
           	<Signup />
          </Route>
        </Switch>
</BrowserRouter>
:
<BrowserRouter>
	<Navbar bg="light" expand="sm">
	   <Nav><Link className="" to="/home"><img className="avatar" src={_image_name_} alt='Opps something went wrong' widht='50px' height='50px;'/></Link></Nav>
	  <Navbar.Toggle aria-controls="basic-navbar-nav" />
	  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
	      <Nav><Link  style={{"textDecoration": "none"}} className="hover_effect" to="/home">Home</Link></Nav>
        
        <div className="dropdown overlays_issue">
          <button className="dropbtn">Dashboard</button>
          <div className="dropdown-content">
           <Nav><Link  style={{"textDecoration": "none"}}  to="/Blogwrite">Write a Blog</Link></Nav>
           <Nav><Link  style={{"textDecoration": "none"}}  to="/BlogUWrOte">Blog you wrote</Link></Nav>
           <Nav><Link  style={{"textDecoration": "none"}}  to="/settings">Settings</Link></Nav>
          </div>
        </div>

	      <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  to="/logout">logout</Link></Nav>
	    </Nav>
	  </Navbar.Collapse>
	</Navbar>
		<Switch>
		    <Route path="/home">
           <Home />
        </Route>

        <Route path="/Blogwrite">
           <Blogwrite />
        </Route>

        <Route path="/BlogUWrOte">
           <BlogUWrOte/>
        </Route>

         <Route path="/settings">
           <Settings/>
        </Route>

        <Route path="/logout">
          <Logout />
        </Route>

        </Switch>
    </BrowserRouter>
}
 	</>
	);
};

export default Header;
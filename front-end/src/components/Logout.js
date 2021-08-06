import React , { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner , Alert } from 'react-bootstrap';
import './Form.css';
import axios from 'axios'

const Logout = () => {
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
const [setJwt, UpdatesetJwt] = useState(null);

 useEffect(() => {
          axios.post(backend_url+'/logout/',{
              payload:null
              }
              ,{ withCredentials: true })
        .then((res) => {
          UpdatesetJwt(null);
          window.location.href = "https://simple--blogger.herokuapp.com/login";
        })
        .catch((error) => {
         window.location.href = "https://simple--blogger.herokuapp.com/login";
        })
  },[]);



return (
  <> 
  {
  (setJwt === null)
  ? 
        <div>
        </div>
   :
     <div className="alert_center">
       <Alert variant="danger">You will be logged out .....</Alert>
       <div className="alert_center">
              <Spinner animation="grow" variant="success" />
        </div>
      </div>
 }
  </>
  );
};

export default Logout;
import React , { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Form , Button } from 'react-bootstrap';
import './Form.css';
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
const [errorsetresponse, Updateerrorsetresponse] = useState(null);
const [setJwt, UpdatesetJwt] = useState(null);
const [_reset_recapcha_, Update_reset_recapcha_] = useState(null);
const recaptchaRef = React.createRef();

  const loginsubmit = (evt) => {
      evt.preventDefault();
      const email = evt.target.elements.email.value;
      const password = evt.target.elements.password.value;
      const recaptchaValue = recaptchaRef.current.getValue();
      const _pass_value_ = evt.target.elements._pass_value_.value;
       if(email === "" || password === "")
      { 
        alert("Empty Fields")
        return
      }

        axios.post(backend_url+'/api/token/',{
          email:email,
          password:password,
          __key__id__ : _pass_value_,
          recapcha : recaptchaValue,
          url:backend_url
        }, { withCredentials: true })
        .then((response) => {
          try{
             Updateerrorsetresponse(null)
             UpdatesetJwt(response.data["access"]);
              
             // console.log(response.data["access"])
             window.location.href = '/home';
          }catch(e){
            Updateerrorsetresponse("something went wrong")
          }
          })
          .catch(err =>{
           // console.log(err.response.data.detail)
           try{
           UpdatesetJwt(null);
           Updateerrorsetresponse(err.response.data.detail)
          }catch(e){
            Updateerrorsetresponse("something went wrong")
          }
           
          }).finally(() => {
            Update_reset_recapcha_(Math.floor(Math.random() * 101))
            try{
              const button = document.getElementById("hide_first")
              button.disabled = true
              button.classList.remove("btn-primary");
              document.getElementById("hide_first").classList.add('btn-secondary');
            }catch(e){
              console.log("!!")
            }
            
            });

    }
    function onChange(value) {
      const button = document.getElementById("hide_first")
      button.classList.remove("btn-secondary");
      button.disabled = false
      document.getElementById("hide_first").classList.add('btn-primary');
      // console.log(value)
   }
   
   useEffect(() => {const recaptchaValue = recaptchaRef.current.reset();},[_reset_recapcha_]);

return (
  <>

  <div className="alert_center">{errorsetresponse?<Alert variant="danger">{errorsetresponse}</Alert>: null}
  </div>

  {
  (setJwt === null)
  ? 
  <div className="Form_div">
      <Form onSubmit={loginsubmit}>
      
       <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" />
      </Form.Group>
      <div className="alert alert-warning" role="alert">
			Solve capcha to enable login button
		  </div>
		  <ReCAPTCHA ref={recaptchaRef} sitekey="6LdjEeQaAAAAACb7HVp1MdIdTR_VbgRqO7hRqUjK" onChange={onChange}/>
		  <input type="hidden" defaultValue={Math.floor(Math.random() * 101)} name="_pass_value_"/><br/>

      <Button id="hide_first" className="btn btn-secondary" variant="primary" type="submit" disabled>
        Submit
      </Button>
      </Form>
      </div>
  :
  <div className="alert_center"><Alert variant="success">You are login wait for second</Alert></div>
}
  </>
  );
};

export default Login;
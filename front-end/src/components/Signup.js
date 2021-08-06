import React , { useEffect, useState } from "react";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert , Form , Button } from 'react-bootstrap';
import './Form.css';
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {


const backend_url = "https://api-v1-backend.herokuapp.com";
// const backend_url = "http://localhost:8000";
const [setresponse, Updatesetresponse] = useState("");
const [errorsetresponse, Updateerrorsetresponse] = useState("");
const [_reset_recapcha_, Update_reset_recapcha_] = useState(null);
const recaptchaRef = React.createRef();

	 const handleSubmit = (evt) => {
      evt.preventDefault();
      const firstname = evt.target.elements.firstname.value;
   	  const lastname = evt.target.elements.lastname.value;
      const email = evt.target.elements.email.value;
	  const password = evt.target.elements.password.value;
	  const _pass_value_ = evt.target.elements._pass_value_.value;
	  const recaptchaValue = recaptchaRef.current.getValue();
	  
	 if(firstname === "" || lastname === "" || email === "" || password === "")
	    {	
	    	alert("Empty Fields")
	    	return
	    }
	     axios.post(backend_url+'/register/',{
		      first_name:firstname,
		      last_name:lastname,
		      email:email,
			  password:password,
			  __key__id__ : _pass_value_,
			  recapcha : recaptchaValue
		    })
		    .then((response) => {
			     // console.log(response.data.message)
			     	try{
						// if(response.data.message)
						// {
							Updateerrorsetresponse(null);
							Updatesetresponse(response.data.message);
						// }
						evt.target.elements.firstname.value = '';
						evt.target.elements.lastname.value = '';
						evt.target.elements.email.value = '';
						evt.target.elements.password.value = '';
					 }catch(e){
							
						Updatesetresponse("something went wrong");
					 }
			    })
			    .catch(err =>{
				try{
					if(err.response.data.message)
						{
							Updatesetresponse(null);
							Updateerrorsetresponse(err.response.data.message)
						}
				}catch(e){
					Updateerrorsetresponse(null);	
					Updateerrorsetresponse("something went wrong");
				 }
				}).finally(() => {
					try{
						Update_reset_recapcha_(Math.floor(Math.random() * 101))
						const button = document.getElementById("hide_first")
						button.disabled = true
						button.classList.remove("btn-primary");
						document.getElementById("hide_first").classList.add('btn-secondary');
					}catch(e){
						Updateerrorsetresponse("something went wrong");
					}
				  });
	 } 
function onChange(value) {
   const button = document.getElementById("hide_first")
   button.classList.remove("btn-secondary");
   button.disabled = false
   document.getElementById("hide_first").classList.add('btn-primary');
//    console.log(value)
}

useEffect(() => {const recaptchaValue = recaptchaRef.current.reset();},[_reset_recapcha_]);
return (
 	<>
 	<div className="Form_div">
 	{setresponse?<Alert variant="success">{setresponse}</Alert>:null} 
 	{errorsetresponse?<Alert variant="danger">{errorsetresponse}</Alert>:null} 

  		<Form onSubmit={handleSubmit}>

		  <Form.Group controlId="firstname">
		    <Form.Label>First Name</Form.Label>
		    <Form.Control name="firstname" type="text" placeholder="Enter First name" />
		  </Form.Group>

		  <Form.Group controlId="lastname">
		    <Form.Label>last Name</Form.Label>
		    <Form.Control  name="lastname" type="text" placeholder="Enter last name" />
		  </Form.Group>

		   <Form.Group controlId="email">
		    <Form.Label>Email address</Form.Label>
		    <Form.Control  name="email" type="email" placeholder="Enter email" />
		  </Form.Group>
		  <Form.Group controlId="password">
		    <Form.Label>Password</Form.Label>
		    <Form.Control  name="password" type="password" placeholder="Password" />
		  </Form.Group>
		  <div className="alert alert-warning" role="alert">
			Solve capcha to enable Register button
		  </div>
		  <ReCAPTCHA ref={recaptchaRef} sitekey="6LdjEeQaAAAAACb7HVp1MdIdTR_VbgRqO7hRqUjK" onChange={onChange}/>
		  <input type="hidden" defaultValue={Math.floor(Math.random() * 101)} name="_pass_value_"/><br/>
		  
		  <Button id="hide_first" className="btn btn-secondary" variant="primary" type="submit" disabled>
		    Register
		  </Button>
      </Form>
      </div>
 	</>
	);
};

export default Signup;
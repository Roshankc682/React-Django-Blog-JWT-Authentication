import React , { useEffect } from "react";
import {Alert , Form , Button } from 'react-bootstrap';
import axios from 'axios'
import './settings.css';



function FileUpload() {
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
  const [file, setFile] = React.useState("");
  const [__upload_button_active, set__upload_button_active] = React.useState("");
  const [setJwt, UpdatesetJwt] = React.useState(null);
   const [_user_name_change_, Update_user_name_change_] = React.useState(null);
   const [_user_name_unchange_, Update_user_name_unchange_] = React.useState(null);
   const [_user_email_change_, Update_user_email_change_] = React.useState(null);
   const [_user_email_unchange_, Update_user_email_unchange_] = React.useState(null);
   const [_user_password_change_, Update_user_password_change_] = React.useState(null);
   const [_user_password_unchange_, Update_user_password_unchange_] = React.useState(null);
   const [_user_image_change_, Update_user_image_change_] = React.useState(null);
   const [_user_image_unchange_, Update_user_image_unchange_] = React.useState(null);


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
          try{
            // console.log(res.data)
            UpdatesetJwt(respose.data["access"]);
          }catch(e)
          {
             UpdatesetJwt(null);
          }
        })
        .catch((error) => {
          
        })
    
  },[]);



  function handleUpload(event) {

    setFile(event.target.files[0]);
    // console.log(event.target.files[0].["type"])
    set__upload_button_active(event.target.files)

  }

 useEffect(() => {},[set__upload_button_active,Update_user_image_change_,Update_user_image_unchange_,_user_name_change_,_user_name_unchange_,_user_email_change_,_user_email_unchange_,_user_password_change_,_user_password_unchange_]);


 useEffect(() => {},[_user_name_change_,_user_name_unchange_,_user_email_change_,_user_email_unchange_,_user_password_change_,_user_password_unchange_]);


//Now upload the file 
const _upload__ = (evt) => {
  const fd = new FormData();
  // console.log(file.name)
  fd.append('image',file,file.name)
  axios.post(backend_url+'/api/____/upload_profile/user/',fd,{ headers: {'Authorization': `Bearer ${setJwt}`}})
        .then((respose) => {
          console.log(respose.data.message)
          // window.location.href = '/settings';
          Update_user_image_change_(respose.data.message)

          Update_user_name_unchange_(null)
          Update_user_email_unchange_(null)
          Update_user_email_change_(null)
          Update_user_password_change_(null)
          Update_user_password_unchange_(null)
          Update_user_image_unchange_(null)
        })
        .catch((error) => {

          Update_user_image_unchange_(error.response.data.messagee)
          console.log(error.response.data.message)
          Update_user_name_unchange_(null)
          Update_user_email_unchange_(null)
          Update_user_email_change_(null)
          Update_user_password_change_(null)
          Update_user_password_unchange_(null)
          Update_user_image_change_(null)
          
        })
}

function _if_image_change(){
if(_user_image_change_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="success"><b>Profile change</b></Alert></div>
}
}function _if_image_unchange(){
if(_user_image_unchange_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="danger"><b>provide a valid file !!! </b></Alert></div>
}
}

function _upload_button_active(){

  if(__upload_button_active)
  {
      return (<div><Button variant="dark" onClick={_upload__}>Upload</Button></div>)
  }else
  {
    return null
  }
}

  const change_user_name = (evt) => {
     
     evt.preventDefault();
     const Username = evt.target.elements.Username.value;
     if(Username === "")
      { 
        alert("Empty Fields")
        return
      }
     axios.post(backend_url+'/api/____/change_user_name/',{Username:Username},{ headers: {'Authorization': `Bearer ${setJwt}`}})
        .then((respose) => {
          // console.log(respose.data)
          Update_user_name_change_(respose.data.message)
          // window.location.href = '/settings';
          Update_user_name_unchange_(null)
          Update_user_email_unchange_(null)
          Update_user_email_change_(null)

          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
          Update_user_password_change_(null)
          Update_user_password_unchange_(null)
        })
        .catch((error) => {
          // console.log(error.response.data.message)
          Update_user_name_change_(null)
          Update_user_email_unchange_(null)
          Update_user_email_change_(null)

          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
          Update_user_password_change_(null)
          Update_user_password_unchange_(null)
          Update_user_name_unchange_(error.response.data.message)
        })
  // 
}



function _if_name_change(){
if(_user_name_change_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="success"><b>User Name change</b></Alert></div>
}
}function _if_name_unchange(){
if(_user_name_unchange_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="danger"><b>{_user_name_unchange_}</b></Alert></div>
}
}


  const change_email_ = (evt) => {
     
     evt.preventDefault();
     const email = evt.target.elements.email.value;
     if(email === "")
      { 
        alert("Empty Fields")
        return
      }
     axios.post(backend_url+'/api/____/change_email_/',{email:email},{ headers: {'Authorization': `Bearer ${setJwt}`}})
        .then((respose) => {
          // console.log(respose.data)
          Update_user_email_change_(respose.data.message)
          // window.location.href = '/settings';
          Update_user_email_unchange_(null)
          Update_user_name_unchange_(null)
          Update_user_name_change_(null)
          Update_user_password_unchange_(null)
          Update_user_password_change_(null)
          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
        })
        .catch((error) => {
          // console.log(error.response.data.message)
          Update_user_email_change_(null)
          Update_user_email_unchange_(error.response.data.message)
          Update_user_name_unchange_(null)
          Update_user_name_change_(null)
          Update_user_password_change_(null)
          Update_user_password_unchange_(null)
          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
        })
  // 
}


function _if_email_change(){
if(_user_email_change_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="success"><b>Email change</b></Alert></div>
}
}function _if_email_unchange(){
if(_user_email_unchange_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="danger"><b>{_user_email_unchange_}</b></Alert></div>
}
}

// 

  const change_pass_ = (evt) => {
     
     evt.preventDefault();
     const password = evt.target.elements.password.value;
     if(password === "")
      { 
        alert("Empty Fields")
        return
      }
     axios.post(backend_url+'/api/____/change_pass_/',{password:password},{ headers: {'Authorization': `Bearer ${setJwt}`}})
        .then((respose) => {
          // console.log(respose.data)
          Update_user_password_change_(respose.data.message)
          // window.location.href = '/settings';
          Update_user_email_unchange_(null)
          Update_user_name_unchange_(null)
          Update_user_name_change_(null)
          Update_user_password_unchange_(null)
          Update_user_email_change_(null)
          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
        })
        .catch((error) => {
          // console.log(error.response.data.message)
          Update_user_email_change_(null)
          Update_user_email_unchange_(null)
          Update_user_password_unchange_(error.response.data.message)
          Update_user_name_unchange_(null)
          Update_user_name_change_(null)
          Update_user_password_change_(null)
          Update_user_image_unchange_(null)
          Update_user_image_change_(null)
        })
  // 
}


function _if_password_change(){
if(_user_password_change_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="success"><b>password change</b></Alert></div>
}
}function _if_password_unchange(){
if(_user_password_unchange_ === null)
{
  return null
}else{
  return  <div><br/><Alert style={{"fontSize": "11px"}} variant="danger"><b>{_user_password_unchange_}</b></Alert></div>
}
}

function _render_data_(){

        return <div className="text_area_center shadow-lg p-3 mb-5 bg-white rounded" > 
                <div className="clearfix">
                <div className="box" >
                    <div id="upload-box">
                    {_if_image_change()}{_if_image_unchange()}
                      <input type="file" className="input_file_choose" onChange={handleUpload} disabled />
                      <p></p>
                      {file && <ImageThumb image={file} />}
                    </div>
                    {_upload_button_active()}
                </div>
                <div className="box" >
                    <Form onSubmit={change_email_}>
                    {_if_email_change()}{_if_email_unchange()}
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                          Change your email 
                        </Form.Text>
                      </Form.Group>
                      <Button variant="info" type="submit">
                        Save
                      </Button>
                    </Form>
                    <Form onSubmit={change_user_name}>
                     {_if_name_change()}{_if_name_unchange()}
                      <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username </Form.Label>
                        <Form.Control type="text" name="Username" placeholder="Enter Username" />
                        <Form.Text className="text-muted">
                          Change your Username
                        </Form.Text>
                      </Form.Group>
                      <Button variant="info" type="submit">
                        Save
                      </Button>
                    </Form>
                </div>
                <div className="box" >
                   <Form onSubmit={change_pass_}>
                    {_if_password_change()}{_if_password_unchange()}
                      <Form.Group controlId="formBasicpassword">
                        <Form.Label>Change your Password </Form.Label>
                        <Form.Control type="password" name="password" placeholder="Enter new password" />
                        <Form.Text className="text-muted">
                          Change your password 
                        </Form.Text>
                      </Form.Group>
                      <Button variant="info" type="submit">
                        Save
                      </Button>
                    </Form>
                </div>
              </div>
              </div>

  }



  return (
            (_render_data_())
  );
}

const ImageThumb = ({ image }) => {
  return <img className="size_of_pic" src={URL.createObjectURL(image)} alt={image.name} />;
};


export default function Settings() {
  return <FileUpload />;
}

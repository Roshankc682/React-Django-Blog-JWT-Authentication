import React , { useState , useEffect} from "react";
import axios from 'axios'
import {Card , Spinner , Alert, Form , Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import './Form.css';
import ReCAPTCHA from "react-google-recaptcha";

const Blogwrite = () => {
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
  const [setJwt, UpdatesetJwt] = useState(null);
  const [errorsetresponse, Updateerrorsetresponse] = useState(null);
  const [created_response, Updatecreated_response] = useState(null);
  const [edit_data, Updateedit_data] = useState(null);
  const [edit_id, Updateedit_id] = useState(null);
  const [edit_title_of_blog, Updateedit_title_of_blog] = useState(null);
  const [edit_link, Updateedit_link] = useState(null);
  const [edit_blog_data, Updateedit_blog_data] = useState(null);
  const [Edit_Blog_and_pass, UpdateEdit_Blog_and_pass] = useState(null);

  const [_reset_recapcha_, Update_reset_recapcha_] = useState(null);
  const recaptchaRef = React.createRef();

  const [Load_tempalte_once, Update_Load_tempalte_once] = useState(null);
  const [Load_tempalte_Edit_First_edit, Update_Load_tempalte_Edit_First_edit] = useState(null);

const [If_edited_then_show_message, Update_If_edited_then_show_message] = useState(null);

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
            Update_Load_tempalte_once("yes_load")
            // window.location.href = "https://localhost:3000/login/";
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


 useEffect(() => {
    const script = document.createElement('script');
    let url = "https://"+window.location.host+"/tiny.js";
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    },[Load_tempalte_once]);



 const blog_data_submit = (evt) => {
      evt.preventDefault();
      const title_of_blog = evt.target.elements.title.value;
      const blog_data = evt.target.elements.blog_data.value;
      const _pass_value_ = evt.target.elements._pass_value_.value;
      const recaptchaValue = recaptchaRef.current.getValue();
      if(title_of_blog === "")
      { 
        alert("Title Fields Empty")
        return
      }
      if(blog_data === "")
      {
        alert("Blog Fields Empty")
        return
      }
      var confirm = window.confirm("Publish the Blog ");
      if (confirm) {
         // console.log(" yes ")
      }
      else {
         // console.log("No")
         return
      }
      axios.post(backend_url+'/api/data_insert/',{
          title_of_blog:title_of_blog,
          blog_data:blog_data,
			  __key__id__ : _pass_value_,
			  recapcha : recaptchaValue
        },{ headers: {'Authorization': `Bearer ${setJwt}` }})
        .then((response) => {

             Updateerrorsetresponse(null)
             Updatecreated_response(response.data.message)
             Updateedit_data(response.data.id)
            })
          .catch(err =>{
           // console.log(err.response.data.detail)
           UpdatesetJwt(null);
           Updateerrorsetresponse(err.response.data.detail)
           window.location.href = '/login';
          }).finally(() => {
            Update_reset_recapcha_(Math.floor(Math.random() * 101))
            });

    }

function onChange(value) {
      const button = document.getElementById("hide_first")
      button.classList.remove("btn-secondary");
      button.disabled = false
      document.getElementById("hide_first").classList.add('btn-primary');
    
   }
// useEffect(() => {const recaptchaValue = recaptchaRef.current.reset();},[_reset_recapcha_]);

  useEffect(() => {

    if(setJwt !== null)
    {
           axios.post(backend_url+'/api/single_blog_published/',{
                  'blog_id': `${edit_data}`,
                },{ headers: {'Authorization': `Bearer ${setJwt}` }})
                .then((response) => {

                    Updateedit_id(response.data.id)
                    Updateedit_title_of_blog(response.data.title_of_blog)
                    Updateedit_link(response.data.link)
                    Updateedit_blog_data(response.data.blog_data)

                    })
                  .catch(err =>{
                   UpdatesetJwt(null);
                   Updateerrorsetresponse(err.response.data.detail)
                   // window.location.href = '/login';
                   });
            }

  },[edit_data]);

function LoadTinyEditor(){
  if(setJwt === null)
  {
    return  <div className="alert_center">
              <Spinner animation="grow" variant="success" />
            </div>
  }
  else{
        
    return  (
            <div className="text_area_center shadow-lg p-3 mb-5 bg-white rounded" > 
             <Form onSubmit={blog_data_submit}>
              <center>
                <Form.Group controlId="forBasicTitle">
                  <Form.Label><b>Title of Blog</b></Form.Label>
                <Form.Control type="text" name="title" placeholder="Enter title" style={{"width": "500px"}} />
                </Form.Group><br></br>
                <textarea id="basic-conf" name="blog_data">

                </textarea>
                <br></br>
                <ReCAPTCHA ref={recaptchaRef} sitekey="6LdjEeQaAAAAACb7HVp1MdIdTR_VbgRqO7hRqUjK" onChange={onChange}/>
		            <input type="hidden" defaultValue={Math.floor(Math.random() * 101)} name="_pass_value_"/><br/>
                <Button id="hide_first" className="btn btn-secondary" variant="primary"  type="submit" disabled>Publish Blog </Button></center>
                </Form>
            </div>
            )
  }
}


function Load_Blog_Data(){
  return {__html: DOMPurify.sanitize(`${edit_blog_data}`)}; 
}
function LoadDataFromResponse(){

  if(edit_id || edit_title_of_blog || edit_link || edit_blog_data){
    return (<center>
            <Card style={{ width: '85%' }}>
            <Card.Body>
             <Card.Title>{edit_title_of_blog}</Card.Title>
              <Card.Text>
                 <div dangerouslySetInnerHTML={Load_Blog_Data()}/>
              </Card.Text>
             </Card.Body>
            </Card>
            </center>)
               
  }
  else
  {
    return null
  }
}

  const id_submit_to_edit = (evt) => {
      evt.preventDefault();
      const _id_ = evt.target.elements._id_.value;
      // console.log(_id_)
       axios.post(backend_url+'/api/single_blog_published/',{
                  'blog_id': `${_id_}`,
                },{ headers: {'Authorization': `Bearer ${setJwt}` }})
                .then((response) => {

                    Updateedit_id(response.data.id)
                    UpdateEdit_Blog_and_pass(edit_id)
                    Update_Load_tempalte_Edit_First_edit(response.data.key)
                    })
                  .catch(err =>{
                   UpdatesetJwt(null);
                   Updateerrorsetresponse(err.response.data.detail)
                   // window.location.href = '/login';
                   });
}

//Loading was fail so reload again before ed
useEffect(() => {
    const script = document.createElement('script');
    let url = "https://simple--blogger.herokuapp.com/tiny.js";
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    },[Load_tempalte_Edit_First_edit]);

const save_edit_blog_data = (evt) => {
      evt.preventDefault();
      const title_edited = evt.target.elements.title_edited.value;
      const blog_data_edited = evt.target.elements.blog_data_edited.value;
       axios.post(backend_url+'/api/data_edit/',{
                  'id': `${edit_id}`,
                  'title_of_blog': `${title_edited}`,
                  'blog_data': `${blog_data_edited}`,
                },{ headers: {'Authorization': `Bearer ${setJwt}` }})
                .then((response) => {
                      // console.log(response.data.message)
                    //   title_edited
                    //   blog_data_edited
                       Updateedit_title_of_blog(response.data.title_of_blog)
                    Updateedit_blog_data(response.data.blog_data)
                      Update_Load_tempalte_Edit_First_edit("load_edit_template")
                      Update_If_edited_then_show_message(response.data.message);

                      // window.location.href = '/Blogwrite';

                    })
                  .catch(err =>{
                   UpdatesetJwt(null);
                   Updateerrorsetresponse(err.response.data.detail)
                   window.location.href = '/login';
                   });

}


function LoadTinyEditor_for_edit(){
  if(setJwt === null)
  {
    return  <div className="alert_center">
              <Spinner animation="grow" variant="success" />
            </div>
  }
  else{
    return  (
            <div className="text_area_center shadow-lg p-3 mb-5 bg-white rounded" > 
             <Form onSubmit={save_edit_blog_data}>
              <center>
                <Form.Group controlId="forBasicTitle">

                  <Form.Label><b>Title of Blog</b></Form.Label>

                <Form.Control type="text" name="title_edited" placeholder="Enter title" style={{"width": "500px"}} defaultValue={edit_title_of_blog} />

                </Form.Group><br></br>

                <textarea id="basic-conf" name="blog_data_edited"  defaultValue={edit_blog_data}>

                </textarea>
                <br></br>
                <Button variant="primary"  name="_save_" type="submit" value="_save_">Save </Button>
                &nbsp;&nbsp;<Button  onClick={close_if_edit_finish} variant="warning"  name="_save_cancle_" type="submit" value="_save_cancle_">close</Button>
                </center>
                </Form>
            </div>
            )
  }
}
function close_if_edit_finish(){
  UpdateEdit_Blog_and_pass(null)
  Update_If_edited_then_show_message(null)
}

function Close_all_blog_redirect_write_blog(){
Updateedit_id(null)
 window.location.href = '/Blogwrite';
}

function Whole_Blog_before_edit(){
  if (created_response === null){
      return LoadTinyEditor()
  }else{
    return (<div>

      <Alert className="alert_center" variant="success">
        <center>{created_response}</center>
      </Alert><br></br>
   
      {LoadDataFromResponse()}

       <center><br></br>
          <Form onSubmit={id_submit_to_edit}>
            <Button type="submit" value={edit_id} variant="primary" name="_id_">Edit the Blog</Button>
            &nbsp;&nbsp;<Button  onClick={Close_all_blog_redirect_write_blog} variant="warning"  name="_save_cancle_" type="submit" value="_save_cancle_">close</Button>

          </Form>
         </center>
    </div>)
  }
}

return (
  <>
  {
    (If_edited_then_show_message === null)?
      null
    :
      <Alert className="alert_center" variant="success">
        <center>{If_edited_then_show_message}</center>
      </Alert>
    
  }

  {

  (Edit_Blog_and_pass === null)?

  Whole_Blog_before_edit()

  :
  LoadTinyEditor_for_edit()

}
 </>
  );
};

export default Blogwrite;
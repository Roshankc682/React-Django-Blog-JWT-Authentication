import React , { useState , useEffect} from "react";
import axios from 'axios'
import {Card , Form , Spinner , Button } from 'react-bootstrap';
import './BlogUWrOte.css';
import DOMPurify from 'dompurify';

const BlogUWrOte  = asyncFunc => {
// test
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
  
const [setJwt, UpdatesetJwt] = useState(null);
const [get_blog_data, Updateget_blog_data] = useState(null);
const [_delete_blog_, Update_delete_blog_] = useState(null);
const [_delete_blog_reload, Update_delete_blog_reload] = useState(null);
const [_details_of_single_blog_, Update_details_of_single_blog_] = useState(null);
const [_edit_click_then_you_can_edit_in_peace_, Update_edit_click_then_you_can_edit_in_peace_] = useState(null);


if(setJwt === null){}else{}

useEffect(() => {
  if(setJwt != null){
  const interval = setInterval(() => {
    axios.get(backend_url+'/api/token/new/',{ headers: {'Authorization': `Bearer ${setJwt}`},withCredentials: true})
        .then((respose) => {
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
            get_the_blog_written_by_user(respose.data["access"]);
          }catch(e)
          {
             UpdatesetJwt(null);
          }
        })
        .catch((error) => {
          
        })
    
  },[]);


function get_the_blog_written_by_user(token){
   axios.get(backend_url+'/api/blog_data/',{ headers: {'Authorization': `Bearer ${token}`}})
          .then((respose) => {
            // console.log(respose.data);
            Updateget_blog_data(respose.data);
          })
          .catch((error) => {
             console.log(error);
          })
}

 useEffect(() => {
           axios.post(backend_url+'/api/access/refresh/',{
              payload:null
              }
              ,{ withCredentials: true })
        .then((respose) => {
          // console.log(res.data)
          UpdatesetJwt(respose.data["access"]);
          get_the_blog_written_by_user(respose.data["access"]);
        })
        .catch((error) => {
          
        })
    
  },[_delete_blog_reload]);


const Delete_data = (evt) => {
    evt.preventDefault();
    const _id_key_ = evt.target.elements._value_for_action_delete.value;
    var confirm = window.confirm("Are you sure to Delete this Blog");
      if (confirm) {
          axios.post(backend_url+'/api/data_delete/',{
          __key__id__ : Math.floor(Math.random() * 101),
          id:_id_key_,
        },{ headers: {'Authorization': `Bearer ${setJwt}` }})
        .then((response) => {
             Update_delete_blog_(response.data.message)
             Update_delete_blog_reload(Math.floor(Math.random() * 101))
            })
          .catch(err =>{
           });
      }
      else {
         return
      }
    }


const Seemore_data = (evt) => {
    evt.preventDefault();
    const _id_key_ = evt.target.elements._value_for_action_see_more.value;

    axios.post(backend_url+'/api/single_blog_published/',{
          blog_id :_id_key_,
          id:Math.floor(Math.random() * 101),
        },{ headers: {'Authorization': `Bearer ${setJwt}` }})
        .then((response) => {
            Update_details_of_single_blog_(response.data)
            
            })
          .catch(err =>{
           });
}

const _cancle_see_more_details_ = (evt) => {
   evt.preventDefault();
   Update_details_of_single_blog_(null)
   Update_edit_click_then_you_can_edit_in_peace_(null)
   Update__id_key__(null)
   Update__title_for_action_edit_(null)
   Update_blog_data_for_action_edit(null)
}



function _load_user_all_list_blog_data_(){


if( _edit_click_then_you_can_edit_in_peace_ === null){

    if(_details_of_single_blog_ === null){

          if(get_blog_data === null){
            return <div className="alert_center">
                <Spinner animation="grow" variant="success" />
             </div>
          }
          else{

                 return <div className="width_by_cutome text-center shadow-lg p-3 mb-5 bg-white rounded">
                     {Object.keys(get_blog_data).map( (key)=> {
                       return <div  className="one_blog" key={get_blog_data[key].id}>
                              
                              <Card body><b>Title : </b>{get_blog_data[key].title_of_blog}</Card>

                              <div className="float-left">
                                <Form onSubmit={Edit_data}>
                                  <input type="hidden" defaultValue={get_blog_data[key].id} name="_value_for_action_edit"/>
                                  <input type="hidden" defaultValue={get_blog_data[key].title_of_blog} name="_title_for_action_edit"/>
                                  <input type="hidden" defaultValue={get_blog_data[key].blog_data} name="_blog_data_for_action_edit"/>
                                  <Button type="submit" className="button_design  btn-lg"  variant="secondary">Edit</Button>
                                </Form>
                              </div>

                              <div className="float-left">
                                <Form onSubmit={Delete_data}>
                                  <input type="hidden" defaultValue={get_blog_data[key].id} name="_value_for_action_delete"/>
                                  <Button type="submit" className="button_design  btn-lg"  variant="danger">Delete</Button>
                                </Form>
                              </div>

                              <div className="none">               
                                <Form onSubmit={Seemore_data}>
                                  <input type="hidden" defaultValue={get_blog_data[key].id} name="_value_for_action_see_more"/>
                                  <Button type="submit" className="button_design  btn-lg"  variant="primary">More details</Button>
                                </Form>
                              </div>
                           </div>
                          })
                    
                }
                </div> 
            }
        }
        else
        {
          return <div className="shadow-lg p-3 mb-5 bg-white rounded card_image">
                    <center><b>Title : </b> {_details_of_single_blog_.title_of_blog}</center>
                    <br/>
                    <div dangerouslySetInnerHTML={_render_one_data_without_dangerous_tag_(_details_of_single_blog_.blog_data)}/>
                    <br/>
                    <center>
                    <Form onSubmit={_cancle_see_more_details_}>
                        <Button type="submit" variant="danger">Go Back</Button>
                    </Form>
                     <Card.Footer className="text-mutedm m-4">Witten : {_details_of_single_blog_.date_created.slice(0, 10)}</Card.Footer>
                    </center>
                  </div>
        }
  }
  else
  {
    return  <div className="text_area_center shadow-lg p-3 mb-5 bg-white rounded" > 
             <center><Form onSubmit={_blog_data_submit_for_edit_}>
                <Form.Group controlId="forBasicTitle">
                <Form.Label><b>Title of Blog</b></Form.Label>
                <Form.Control type="text" defaultValue={__title_for_action_edit_} name="_title_for_action_edited_after_render__" placeholder="Enter title" style={{"width": "500px"}} />
                </Form.Group><br></br>
                <textarea id="basic-conf" name="blog_data" name="_blog_data_for_action_edited_after_render__" defaultValue={_blog_data_for_action_edit}>

                </textarea>
                <br></br>
                <Button className="float-left" variant="primary"  type="submit">Publish Blog </Button>
              </Form></center>
            
                <center><Form onSubmit={_cancle_see_more_details_}>
                   <Button className="float-right" type="submit" variant="danger">Go Back</Button>
                 </Form></center>
                 <br/><br/><br/>
            </div>
  }
}



const [__id_key__, Update__id_key__] = useState(null);
const [__title_for_action_edit_, Update__title_for_action_edit_] = useState(null);
const [_blog_data_for_action_edit, Update_blog_data_for_action_edit] = useState(null);


 useEffect(() => {
    const script = document.createElement('script');
    let url = "https://simple--blogger.herokuapp.com/tiny.js";
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    },[__id_key__]);

const Edit_data = (evt) => {

    evt.preventDefault();
    const _id_key_ = evt.target.elements._value_for_action_edit.value;
    const __title_for_action_edit_ = evt.target.elements._title_for_action_edit.value;
    const _blog_data_for_action_edit = evt.target.elements._blog_data_for_action_edit.value;

    Update__id_key__(_id_key_)
    Update__title_for_action_edit_(__title_for_action_edit_)
    Update_blog_data_for_action_edit(_blog_data_for_action_edit)
  
    Update_edit_click_then_you_can_edit_in_peace_("you can edit now")

    _load_user_all_list_blog_data_()

    }

const _blog_data_submit_for_edit_ = (evt) => {

  console.log("Edit has to be confirm")
  evt.preventDefault();
  // console.log(__id_key__)
  // console.log(__title_for_action_edit_)
  // console.log(_blog_data_for_action_edit)

  var confirm = window.confirm("Are you sure to Edit this Blog");
      if (confirm) {
         // console.log("yes")

        const __title_for_action_edit_ = evt.target.elements._title_for_action_edited_after_render__.value;
        const _blog_data_for_action_edit = evt.target.elements._blog_data_for_action_edited_after_render__.value;

        // console.log(__title_for_action_edit_)
        // console.log(_blog_data_for_action_edit)
        
          if(__title_for_action_edit_ === "")
          {
             alert("You forgot to write Title")
             return
          }
         
         if(_blog_data_for_action_edit === "")
         {
          alert("You forgot to write Content")
          return
         }
         console.log("All set")
         // ==========================================================================================
         axios.post(backend_url+'/api/data_edit/',{
                  'id': `${__id_key__}`,
                  'title_of_blog': `${__title_for_action_edit_}`,
                  'blog_data': `${_blog_data_for_action_edit}`,
                },{ headers: {'Authorization': `Bearer ${setJwt}` }})
                .then((response) => {
                      // console.log(response)
                      axios.get(backend_url+'/api/blog_data/',{ headers: {'Authorization': `Bearer ${setJwt}`}})
                                .then((___resp__) => {
                                  // console.log(respose.data);
                                  Updateget_blog_data(___resp__.data);
                                })
                                .catch((___error__) => {
                                   console.log(___error__);
                                })
                    })
                  .catch(err =>{
                    console.log(err)
                   UpdatesetJwt(null);

                   });
         // ==========================================================================================
      }
      else {
         console.log("Cancle Update ..... ")
         return
      }

}


function _render_one_data_without_dangerous_tag_(_temp_data_for_render_)
{
  return {__html: DOMPurify.sanitize(`${_temp_data_for_render_}`)}; 
}
return (
  <>
    {_load_user_all_list_blog_data_()}
  </>

  );
};

export default BlogUWrOte;
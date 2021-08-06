import React , { useState , useEffect  } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import {Spinner , Card , Button , Form} from 'react-bootstrap';
import './Home.css';
import DOMPurify from 'dompurify';

const Home = () => {
  const backend_url = "https://api-v1-backend.herokuapp.com";
  // const backend_url = "http://localhost:8000";
const [setJwt, UpdatesetJwt] = useState(null);
 const [data, Updatedata] = useState(null);
  const [_details_data_one_blog_, Update_details_data_one_blog_] = useState(null);
  const [_load_all_data_null, Update_load_all_data_null] = useState(null);

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
          // console.log(respose.data.access)
            try{
            UpdatesetJwt(respose.data["access"]);
          }catch(e)
          {
             UpdatesetJwt(null);
          }
        })
        .catch((error) => {
          // console.error(error)
          UpdatesetJwt(null);
        })
    
  },[]);


 useEffect(() => {
           axios.get(backend_url+'/api/list_blog/',{ withCredentials: true })
        .then((respose) => {
          // console.log(respose.data)
          Updatedata(respose.data)
        })
        .catch((error) => {
            // console.log(error)
        })
    
  },[]);
    




const more_details_data = (evt) => {
    evt.preventDefault();
    const _id_key_ = evt.target.elements._value_for_action_.value;
     axios.post(backend_url+'/api/single_blog_data/',{
          blog_id :_id_key_,
          id:Math.floor(Math.random() * 101),
        })
        .then((response) => {
            Update_details_data_one_blog_(response.data)
            Update_load_all_data_null("_close_the_div_")

            })
          .catch(err =>{
           });
    }

const _cancle_see_more_details_ = (evt) => {
   evt.preventDefault();
   Update_load_all_data_null(null)
}

function _load_all_data_in_home_page()
{

  if(_load_all_data_null === null)
  {
    return ( <div className="shadow-lg p-3 mb-5 bg-white rounded card_image">
      {Object.keys(data).map( (key)=> {
           return <div className="card_special" key={data[key].id} ><br></br>
          <Card className="text-center">
          <Card.Body>
            <Card.Title><b>Title : </b>{data[key].title_of_blog.slice(0, 20)}...</Card.Title>
             <Card.Text 
                dangerouslySetInnerHTML={
                    _render_all_data_with_dangeroud_tag_(data[key].blog_data.slice(0, 40))
            }>
            </Card.Text>
             <Form onSubmit={more_details_data}>
                <input type="hidden" defaultValue={data[key].id} name="_value_for_action_"/>
                <Button type="submit" variant="primary">See more</Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-muted">Witten : {data[key].date_created.slice(0, 10)}</Card.Footer>
        </Card>
        </div>
        })
      }
    </div>)

  }else
  {
    return ( <div className="shadow-lg p-3 mb-5 bg-white rounded card_image">
            <center><b>Title : </b> {_details_data_one_blog_.title_of_blog}</center>
            <br/>
            <div dangerouslySetInnerHTML={_render_one_data_without_dangerous_tag_()}/>
            <br/>
            <center><Form onSubmit={_cancle_see_more_details_}>
                <Button type="submit" variant="danger">Go Back</Button>
            </Form>
             <Card.Footer className="text-mutedm m-4">Witten : {_details_data_one_blog_.date_created.slice(0, 10)}</Card.Footer>
            </center>

          </div>)
  }
}


function _render_all_data_with_dangeroud_tag_(_temp_data_for_render_)
{
  return {__html: DOMPurify.sanitize(`${_temp_data_for_render_}`)}; 
}
function _render_one_data_without_dangerous_tag_(){

  return {__html: DOMPurify.sanitize(`${_details_data_one_blog_.blog_data}`)}; 

}
return (
  <>
{
  (data === null)
  ? 
   <div className="alert_center">
      <Spinner animation="grow" variant="success" />
   </div>
  :
     
   (_load_all_data_in_home_page())
}
  </>
  );
};

export default Home;
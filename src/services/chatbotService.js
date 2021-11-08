import request from "request";

require('dotenv').config();

const page_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN;

let callSendAPI = (response, sender_psid) =>{
     // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v12.0/me/messages",
    "qs": { "access_token": page_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}


    

let handleGetStarted = (sender_psid) =>{
    return new Promise(async (resolve, reject) =>{
        try{
            let response = { "text": "Xin chào bạn đến với trang web của mình" }
            await callSendAPI(response, sender_psid);
            resolve('done');
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    handleGetStarted: handleGetStarted
}
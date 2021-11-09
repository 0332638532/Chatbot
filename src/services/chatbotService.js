import request from "request";

require('dotenv').config();

const page_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://www.mentalhealthfirstaid.org/wp-content/uploads/2018/03/Jacksonville-Hospital-Collaborative-1.jpg';

let callSendAPI = (response, sender_psid) => {
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




let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = { "text": "Xin chào bạn đến với trang web của mình" }
      let response2 = sendGetStartedTemplate();
      //send text messenge
      await callSendAPI(response, sender_psid);

      //send generic template messenge
      await callSendAPI(response2, sender_psid);


      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let sendGetStartedTemplate = () => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Xin chào,chúng tôi sẽ hỗ trợ bạn ngay.",
          "subtitle": "bạn muốn chúng tôi hỗ trợ dịch vụ nào?",
          "image_url": IMAGE_GET_STARTED,
          "buttons": [
            {
              "type": "postback",
              "title": "Đặt lịch",
              "payload": "BOOK",
            },
            {
              "type": "postback",
              "title": "Tư vấn",
              "payload": "ADVISE",
            }
          ],
        }]
      }
    }
  }
  return response;
}

module.exports = {
  handleGetStarted: handleGetStarted
}
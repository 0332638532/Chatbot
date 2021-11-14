import request from "request";
import chatbotService from "../services/chatbotService.js";
require('dotenv').config();

const page_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) =>{
    return res.render('homepage.ejs');
};

let postWebhook= (req, res) =>{
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook= (req, res) =>{
  let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);

      } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
      }
  }
};

// Handles messages events
async function handleMessage (sender_psid, received_message){
    let response;

    if (received_message && received_message.quick_reply && received_message.quick_reply.payload) {
      let payload = received_message.quick_reply.payload;
      if (payload === "GET_STARTED") {
          await chatbotService.handleGetStarted(sender_psid);
      } 

      return;
  }
  
    // Checks if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
      }
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
    } 
    
    // Send the response message
    callSendAPI(sender_psid, response);      
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  switch(payload) {
    case 'yes':
      response = { "text": "Thanks!" }
      // code block
      break;
    case 'no':
      response = { "text": "Oops, try sending another image." }
      // code block
      break;

    case 'RESTARTED_BOT':  
    case 'GET_STARTED':
      await chatbotService.handleGetStarted(sender_psid);
      break;

    case 'LOOK_BOOKING':
      await chatbotService.handleSendBooking(sender_psid);
      break;

    case 'MORNING':
      await chatbotService.handleSendMoring(sender_psid);
      break;
    
    case 'NOON':
      await chatbotService.handleSendNoon(sender_psid);
      break;

    case 'RETURN':  
      await chatbotService.handleBacktoBooking(sender_psid);
      break;

    case 'RETURN_NOON':  
      await chatbotService.handleBacktoNoon(sender_psid);
      break;
    
    case 'RETURN_MORNING':
      await chatbotService.handleBacktoMorning(sender_psid);
      break;
      
    case 'DETAIL':
      await chatbotService.handleShowDetail(sender_psid);
      break;
      
    case 'RETURN_TO_BEGIN':
      await chatbotService.handleGetStarted(sender_psid);
      break;  
    
    default:
      response = { "text": `Tôi không biết trả lời như thế nào ${payload}` }
      // code block
  }

  
  // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
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

let setupProfile = async(req, res) =>{
    //call profile facebook api
    let request_body = {
      "get_started": { "payload": "GET_STARTED" },
      "whitelisted_domains": ["https://chatbot-benh-vien1.herokuapp.com/"]
    }
  // template string
    // Send the HTTP request to the Messenger Platform
    await request({
      "uri": `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${page_ACCESS_TOKEN}`,
      "qs": { "access_token": page_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log(body)
      if (!err) {
        console.log('Setup user profile suceeds')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
    return res.send("Setup user profile suceeds");

};


let setupPersistentMenu = async(req, res) =>{
    //call profile facebook api
    let request_body = {
      "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "web_url",
                    "title": "Trang Facebook của ISOFCARE",
                    "url": "https://www.facebook.com/B%E1%BB%87nh-vi%E1%BB%87n-Isofhcare-108849608268818/",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "postback",
                    "title": "Khởi động lại bot",
                    "payload": "RESTARTED_BOT"
                }
            ]
        }
    ]
    }
  // template string
    // Send the HTTP request to the Messenger Platform
    await request({
      "uri": `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${page_ACCESS_TOKEN}`,
      "qs": { "access_token": page_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log(body)
      if (!err) {
        console.log('Setup persistent menu succeeds')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
    return res.send("Setup persistent menu succeeds");
  

}

let handleBooking = (req, res) =>{
  return res.render('booking.ejs');
}

let handlePostBooking = async (req, res) =>{
  try {
    let customerName = "";
    if (req.body.customerName === "") {
        customerName = "Để trống";
    } else customerName = req.body.customerName;

    // I demo response with sample text
    // you can check database for customer order's status

    let response1 = {
        "text": `---Thông tin khách hàng đặt khám---
        \nHọ và tên: ${customerName}
        \nĐịa chỉ Email: ${body.email}
        \nSố điện thoại: ${body.phoneNumber}
        `
    };

    await chatbotService.callSendAPI(response1, body.psid);
    
    return res.status(200).json({
        message: "ok"
    });
  } catch (e) {
  console.log('Lỗi post booking',e);
  return res.status(500).json({
    message: "Server error"
  });
}
}

let handleAdvise = (req, res) =>{
  return res.render('advise.ejs');
}

let handlePostAdvise = async (req, res) =>{
  let body = req.body;
  try {
    let customerName = "";
    if (body.customerName === "") {
        customerName = "Để trống";
    } else customerName = body.customerName;

    // I demo response with sample text
    // you can check database for customer order's status

    let response1 = {
        "text": `---Thông tin khách hàng đặt khám---
        \nHọ và tên: ${customerName}
        \nĐịa chỉ Email: ${body.email}
        \nSố điện thoại: ${body.phoneNumber}
        `
    };

    await chatbotService.callSendAPI(response1, body.psid);
    
    return res.status(200).json({
        message: "ok"
    });
  } catch (e) {
  console.log('Lỗi post advise',e);
  return res.status(500).json({
    message: "Server error"
  });
}
}

module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu: setupPersistentMenu,
    handleBooking: handleBooking,
    handlePostBooking: handlePostBooking,
    handlePostAdvise: handlePostAdvise,
    handleAdvise: handleAdvise 
}
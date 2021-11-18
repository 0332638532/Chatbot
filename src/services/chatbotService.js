import request from "request";

require('dotenv').config();

const page_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://www.mentalhealthfirstaid.org/wp-content/uploads/2018/03/Jacksonville-Hospital-Collaborative-1.jpg';
const IMAGE_LOOK_BOOKING = 'https://thumbayhospital.com/wp-content/uploads/2017/12/book-1.jpg';
const IMAGE_BOOKING = 'https://media.alobacsi.com/Images/Uploaded/Share/2017/03/20/c85dat-lich-kham.jpg';
const IMAGE_ADVISE = 'https://cdn.123job.vn/123job/uploads/2019/09/27/2019_09_27______5517c730b837d9907a214976fe4fbef7.jpg';
const IMAGE_DETAIL = 'http://linconlaw.vn/wp-content/uploads/2019/04/IMG_0937-e1520912568890.jpg';
const IMAGE_MORING = 'http://image.vietnamnews.vn/uploadvnnews/Article/2021/8/2/167184_hoanmy.jpg';
const IMAGE_EVENING = 'https://assets.thehansindia.com/hansindia-bucket/7481_Doctors.jpg';
const IMAGE_DETAIL_WEB = 'https://www.halton.com/wp-content/uploads/2020/05/Patient_HiRes_01-1366x768.jpg';
var IMAGE='/images/picture.png'

let callSendAPI = async (response, sender_psid) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  await SendMarkReadMessage(sender_psid);
  await SendTypingOn(sender_psid);
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

let SendTypingOn = (sender_psid) =>{
  // Construct the message body
  let request_body = {
   "recipient": {
     "id": sender_psid
   },
   "sender_action":"typing_on"
 }

 // Send the HTTP request to the Messenger Platform
 request({
   "uri": "https://graph.facebook.com/v12.0/me/messages",
   "qs": { "access_token": page_ACCESS_TOKEN },
   "method": "POST",
   "json": request_body
 }, (err, res, body) => {
   if (!err) {
     console.log('SendTypingOn sent!')
   } else {
     console.error("Unable to send SendTypingOn:" + err);
   }
 }); 
 };



 let SendMarkReadMessage = (sender_psid) =>{
  // Construct the message body
  let request_body = {
   "recipient": {
     "id": sender_psid
   },
   "sender_action":"mark_seen"
 }

  // Send the HTTP request to the Messenger Platform
  request({
  "uri": "https://graph.facebook.com/v12.0/me/messages",
  "qs": { "access_token": page_ACCESS_TOKEN },
  "method": "POST",
  "json": request_body
  }, (err, res, body) => {
  if (!err) {
    console.log('SendTypingOn sent!')
  } else {
    console.error("Unable to send SendTypingOn:" + err);
  }
  }); 
}

 let handleGetStarted = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
      try{
          let response = { "text": `Xin chào bạn đến với trang web ISOFCARE` }
          let response3 = {
            "text": "Anh/chị đang cần hỗ trợ về:",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Đặt khám",
                    "payload": "LOOK_BOOKING",
                },
                {
                    "content_type": "text",
                    "title": "Giấy tờ",
                    "payload": "PAPER",
                },
                {
                    "content_type": "text",
                    "title": "Giá",
                    "payload": "PRICE",
                },
            ]
        };
          await callSendAPI(response, sender_psid);
          await callSendAPI(response3,sender_psid);
          resolve('done');
      }catch(e){
          reject(e);
      }
  })
}


let handlePaper = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        let response2 = {
          "text": `Trước khi đưa con đến khám, anh/ chị vui lòng mang theo:
          \nSổ y bạ (nếu có)
          \nThẻ bảo hiểm y tế (nếu có)
           \nChứng minh thư hoặc hộ chiếu hoặc thẻ học sinh, giấy khai sinh (với trẻ dưới 6 tuổi) hoặc các giấy tờ tùy thân tương đương 
           \nGiấy chuyển tuyến hợp lệ (nếu có)
           \nĐơn thuốc hoặc các thuốc đang dùng (nếu có)
           \nCác kết quả xét nghiệm, chụp chiếu (nếu có)
           `
        };
        let response3={
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text": `Hi vọng các thông tin này rất hữu ích cho các bạn
                      \nQuý vị có thể liên hệ chúng tôi qua 
                      \nSố điện thoại (84)-0968679272 hoặc 0243 9420055
                      \nTrân trọng cám ơn!`,
              "buttons":[
                { 
                  "type": "postback",
                  "title": "Quay về",
                  "payload": "RETURN_TO_BEGIN",
                }
              ]
            }
          }
        }
        await callSendAPI(response2,sender_psid);
        await callSendAPI(response3,sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
  });
}

let handlePrice = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        let response2 = {
          "text": `Bệnh nhân có bảo hiểm y tế và có giấy chuyển đúng tuyến đều được hưởng bảo hiểm y tế như quy định.
           \nCó 2 mức phí khám:
           `
        };
        let response3={
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "image_url": IMAGE,
              "buttons":[
                { 
                  "type": "postback",
                  "title": "Quay về",
                  "payload": "RETURN_TO_BEGIN",
                }
              ]
            }
          }
        }
        await callSendAPI(response2,sender_psid);
        await callSendAPI(response3,sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
  });
}

let handleSendBooking = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        let response1 = getBookingTemplate();
        await callSendAPI(response1, sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
  });
}

let getBookingTemplate = () =>{
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Lịch khám của chúng tôi.",
          "subtitle": `Trang web mang đến cho bạn lịch khám cho buổi sáng lẫn buổi chiều để các bạn chọn`,
          "image_url": IMAGE_LOOK_BOOKING,
          "buttons": [
            {
              "type": "postback",
              "title": "BUỔI SÁNG",
              "payload": "MORNING",
            },
            {
              "type": "postback",
              "title": "BUỔI CHIỀU",
              "payload": "NOON",
            }
          ],
        }, 
      ]
      }
    }
  }
  return response;
}

let getMoringTemplate = () =>{
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Giờ mở cửa buổi sáng",
          "subtitle": "T2-T6: 7h00 - 11h00  | T7-CN: 6h30 - 11h30",
          "image_url": IMAGE_MORING,
        },
        {
          "title": "dsds",
          "subtitle": "DAADASAS",
          "image_url": IMAGE_BOOKING,
          "buttons": [
            {
              "type": "postback",
              "title": "Đặt khám",
              "payload": "BOOKING",
            },
            
            {
              "type": "postback",
              "title": "Quay về đầu",
              "payload": "RETURN_TO_BEGIN",
            },
            {
              "type": "postback",
              "title": "Xem lịch buổi chiều",
              "payload": "RETURN_NOON",
            },
          ],
        } 
      ]
      }
    }
  }
  return response;
}

let handleSendMoring = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        let response1 = getMoringTemplate();
        await callSendAPI(response1, sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
})
}

let getNoonTemplate = () =>{

  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
        {
          "title": "Giờ mở cửa ở buổi chiều",
          "subtitle": "T2-T6: 13h00 - 16h30  | T7-CN: 13h30 - 16h30",
          "image_url": IMAGE_EVENING,
        },
        {
          "title": "DSADS",
          "subtitle": "DASDAS",
          "image_url": IMAGE_BOOKING,
          "buttons": [
            
            {
              "type": "postback",
              "title": "Quay về đầu",
              "payload": "RETURN_TO_BEGIN",
            },
            {
              "type": "postback",
              "title": "Xem lịch buổi sáng",
              "payload": "RETURN_MORNING",
            },
          ],
          }  
        ]
      }
    }
  }
  return response;
}

let handleSendNoon = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        let response1 = getNoonTemplate();
        await callSendAPI(response1, sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
})

}

let handleBacktoBooking = async (sender_psid) =>{
  await handleSendBooking(sender_psid);
}

let handleBacktoNoon = async (sender_psid) =>{
  await handleSendNoon(sender_psid);
}

let handleBacktoMorning = async (sender_psid) =>{
  await handleSendMoring(sender_psid);
}

let getImageWebTemplate = () =>{
  let response = {
    "attachment":{
      "type":"image", 
      "payload":{
        "url": IMAGE_DETAIL_WEB, 
        "is_reusable":true
      }
    }
  }
  return response;
}

let GetButtonWebTemplate = () =>{
  let response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Bệnh viện phục vụ tối đa khoảng 200 người ",
        "text":"Bao gồm những dụng cụ công nghệ tiên tiến và máy lạnh ",
        "buttons":[
          { 
             "type": "postback",
            "title": "Quay về",
            "payload": "RETURN_TO_BEGIN",
          }
        ]
      }
    }
  }
  return response;
}

let handleShowDetail = (sender_psid) =>{
  return new Promise(async (resolve, reject) =>{
    try{
        // send an image
        let response1 = getImageWebTemplate()

        //send a button template
        let response2 = GetButtonWebTemplate();
        await callSendAPI(response1, sender_psid);
        await callSendAPI(response2, sender_psid);
        resolve('done');
    }catch(e){
        reject(e);
    }
})

}


module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendBooking: handleSendBooking,
    handleSendMoring: handleSendMoring,
    handleSendNoon: handleSendNoon,
    handleBacktoBooking: handleBacktoBooking,
    handleBacktoMorning: handleBacktoMorning,
    handleBacktoNoon: handleBacktoNoon,
    handleShowDetail: handleShowDetail,
    callSendAPI: callSendAPI,
    handlePaper: handlePaper,
    handlePrice: handlePrice
}
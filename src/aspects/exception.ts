import { afterMethod, beforeMethod, onException } from "kaop-ts";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import SGmail = require('@sendgrid/mail');

export const handleException = ():any => onException( meta => {
  let response = meta.args[1];
  sendResponse(new BasicResponse(Status.ERROR), response);
});

export const saveNewRecord = (schemaName: string): any =>
  afterMethod(meta => {
    let response = meta.args[1];
    let next = meta.args[2];
    meta.result.then(model => {
      model.save().then(async result => {
        if (result) {
          await sendEmailNotification(result);
          sendResponse(new BasicResponse(Status.CREATED, result), response);
          return next();
        } else {
          sendResponse(new BasicResponse(Status.ERROR, result), response);
          return next();
        }
      });
    });
  });


   async function sendEmailNotification(result) {
    SGmail.setApiKey(process.env.SEND_GRID_KEY)
    console.log('confirm', result.secret);
    const { recipient, from, subject, content } = result.secret;
    const data = { to: recipient, from, subject, html: content };
    console.log('result', data);
    SGmail.send(data);
}

function sendResponse(serviceResponse: BasicResponse, responseObj): any {
  var clientResponse = {
    status: serviceResponse.getStatusString(),
    data: serviceResponse.getData()
  }

  responseObj.status(getHttpStatus(serviceResponse.getStatusString()));

  console.log('responding with', clientResponse);
  responseObj.json(clientResponse);
}



function getHttpStatus(status: string): number {
  switch (status) {
    case 'SUCCESS':
      return 200;
    case 'CREATED':
      return 201;
    case 'FAILED_VALIDATION':
      return 400;
    default:
      return 500;
  }
}
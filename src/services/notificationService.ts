import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { validateSync } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { INotificationModel } from '../models/notification';
import { createNotificationDTO } from '../dto/input/notificationDTO';
import { handleException, saveNewRecord } from "../aspects/exception";
import SGmail = require('@sendgrid/mail');

export class NotificationService extends BaseService {

  @handleException()
  public async createNotification(req: Request, res: Response, next: NextFunction) {
    const { recipient, from, subject, content } = req.body;
    let dto = new createNotificationDTO(recipient, from, subject, content);
      let errors = await this.validateNewNotificationData(dto, req);
      if (this.hasErrors(errors)) {
          this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
          return next();
      }
      await this.saveNewNotificationData(req, res, next, dto)
  }  

  // @saveNewRecord("notification")
  public async saveNewNotificationData(req: Request, res: Response, next: NextFunction, dto: createNotificationDTO) {

    let { recipient, from, subject, content } = dto
    const secret = { recipient, from, subject, content }
    for(let e of recipient) {
      this.sendMail(e, subject, content)
    }
    this.sendResponse(new BasicResponse(Status.CREATED, secret), res);
  }

  async sendMail(email, subject, content) {

    SGmail.setApiKey(process.env.SEND_GRID_KEY);


    const msg = {
        to: email,
        from: 'email@noreply.com',
        subject: subject,
        html: `<p>${content}</p>`
    };

    SGmail.send(msg);
}

  async validateNewNotificationData(dto: createNotificationDTO, req: Request) {
    let errors = validateSync(dto, { validationError: { target: false } });
    if (this.hasErrors(errors)) {
        return errors;
    }
        return errors;
  }

}  
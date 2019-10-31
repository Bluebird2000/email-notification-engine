import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./baseController";
import { NotificationService } from '../services/notificationService';

export class NotificationController extends BaseController {

  public loadRoutes(prefix: String, router: Router) {

    this.createNotification(prefix, router);
  }
 
  public createNotification(prefix: String, router: Router): any {
    router.post(prefix + "/send_email", (req: Request, res: Response, next: NextFunction) => {
        new NotificationService().createNotification(req, res, next);
    });
  }

  constructor() {
    super();
  }
}
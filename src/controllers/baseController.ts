import { NextFunction, Request, Response } from "express";
import { BasicResponse } from "../dto/output/basicresponse";

/**
 * Constructor
 *
 * @class BaseController
 */
export class BaseController {

  protected systemErrorMsg: object = { "message": "Sorry your request could not be completed at the moment" };
  protected noResults: object = { 'message': 'No results available' };


  protected sendResponse(serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
    let response = {
      status: serviceResponse.getStatusString(),
      data: serviceResponse.getData()
    }

    res.status(this.getHttpStatus(serviceResponse.getStatusString()));
    res.json(response);
    next();
  }

  private getHttpStatus(status: string): number {
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

  protected sendError(req: Request, res: Response, next: NextFunction, data?: Object) {
    let dat = {
      status: 401,
      data: data
    }
    res.status(401);
    res.send(dat);

    //return next();
  }

}


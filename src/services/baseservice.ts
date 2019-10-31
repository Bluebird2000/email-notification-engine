import { Validator } from "validator.ts/Validator";
import chalk = require("chalk");
import { BasicResponse } from "../dto/output/basicresponse";
import crypto = require("crypto");
import { NextFunction, Request, Response } from "express";

export class BaseService {
  protected errors;

  protected hasErrors(input: any): boolean {
    let errors = new Validator().validate(input);
    this.errors = errors;
    return !(errors === undefined || errors.length == 0);
  }

  protected sha256(data) {
    return crypto
      .createHash("sha256")
      .update(data, "utf8")
      .digest("base64");
  }

  protected sendError(
    req: Request,
    res: Response,
    next: NextFunction,
    data?: Object
  ) {
    let dat = {
      status: 401,
      data: data
    };
    res.status(401);
    res.send(dat);
  }

  public sendResponse(serviceResponse: BasicResponse, res: Response): any {
    var response = {
      status: serviceResponse.getStatusString(),
      data: serviceResponse.getData()
    };

    res.status(this.getHttpStatus(serviceResponse.getStatusString()));

    console.log("responding with", response);
    res.json(response);
  }

  protected sendException(
    ex,
    serviceResponse: BasicResponse,
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    console.log(chalk.default.blue.bgRed.bold(ex));
    this.sendResponse(serviceResponse, res);
  }

  private getHttpStatus(status: string): number {
    switch (status) {
      case "SUCCESS":
        return 200;
      case "CREATED":
        return 201;
      case "FAILED_VALIDATION":
        return 400;
      case "NOT_FOUND":
        return 404;
      case "CONFLICT":
        return 409;
      case "UNPROCESSABLE_ENTRY":
        return 422;
      default:
        return 500;
    }
  }

  protected logInfo(info: string) {
    console.log(chalk.default.blue.bgGreen.bold(info));
  }

  protected logError(error: string) {
    console.log(chalk.default.blue.bgRed.bold(error));
  }

}


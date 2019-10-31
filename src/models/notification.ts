import { Document } from "mongoose";
import { INotification } from "../interfaces/notification";

export interface INotificationModel extends INotification, Document {
    //custom methods for your model would be defined here
}
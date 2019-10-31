import { IsEmail, IsArray, IsNotEmpty } from "class-validator";

export class createNotificationDTO {
  // @IsArray()
  @IsNotEmpty({
    message: 'recipient field cannot be empty'
  })
  recipient?: string[];
  
  @IsNotEmpty({
    message: 'from field cannot be empty'
  })
  from?: string;
  
  @IsNotEmpty({
    message: 'subject field cannot be empty'
  })
  subject?: string;

  @IsNotEmpty({
    message: 'content field cannot be empty'
  })
  content: string;


  constructor( recipient?: string[], from?: string, subject?: string, content?: string) {
    this.recipient = recipient;
    this.from = from;
    this.subject = subject;
    this.content = content;
  }
}
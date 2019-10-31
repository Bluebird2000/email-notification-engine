import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as dotenv from "dotenv";
import * as cors from "cors";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import encrypt = require('mongoose-encryption');

dotenv.config();

//routes
import { NotificationController } from './controllers/notificationController';
//models
//import { IModel } from "./models/order";
import { INotificationModel } from './models/notification';
//schemas
import chalk = require('chalk');
import { notificationSchema } from './schemas/notification';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  private connection: mongoose.Connection;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    this.runners(this.connection);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    const MONGODB_CONNECTION: string = process.env.MONGODB_HOST + process.env.DB_NAME;

    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount cookie parser
    this.app.use(cookieParser());

    //mount override
    this.app.use(methodOverride());

    //cors error allow
    this.app.options('*', cors());
    this.app.use(cors());

    //use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;

    //connect to mongoose
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    this.connection = connection;

    //enable encryption

    var encKey = process.env.db_encryption_key;
    var sigKey = process.env.db_signing_key;
    mongoose.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['secret'] });
    //create models

    this.app.locals.notification = connection.model<INotificationModel>("Notification", notificationSchema);

    // catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    let swaggerUi = require('swagger-ui-express'),
      swaggerDocument = require('../swagger.json');


      console.log(chalk.default.yellow.bgBlack.bold(`Loading notification controller routes on port ${process.env.PORT}`));
      new NotificationController().loadRoutes('/notification', router);

    //use router middleware
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.use('/v1', router);


    // this.app.all('*', (req, res)=> {
    //   return res.status(404).json({ status: 404, error: 'Page not found' });
    // });
  }

  private runners(connection: mongoose.Connection): any {
    //register and fire scheduled job runner classes
  }

}

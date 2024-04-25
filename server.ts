import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
const xss = require("xss-clean");
import compression from "compression";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./server/routes/v1";
import session from "express-session";
import { config, logger } from "./server/config";
import { RootErrorHandler } from "./server/errorHandler";
import { TokenVerifyMiddleware, setApiResponse } from "./server/middlewares";
import { testDBConnections } from "./server/InitialDBSetup";
import http from "http";
import https from "https";
import fs from "fs";
import { NODE_MODE } from "./server/constants";
import moment from "moment";

const app: Application = express();
const port = config.port;

// enable cors
app.use(cors());

// parse cookies
app.use(cookieParser());
app.use(
	session({
		secret: "F23e12WF",
		resave: true,
		saveUninitialized: true,
	})
);

//socket start
var httpServer: any;
var httpsServer: any;
var io: any;

/* ---------------------------------------- Server Config -------------------------------------------- */
try {
	if (config.env == NODE_MODE.PRODUCTION) {
		try {
			const options = {
				key: fs.readFileSync(config.ssl.key_path) || null,
				cert: fs.readFileSync(config.ssl.cert_path) || null,
			};

			httpsServer = https.createServer(options, app);
		} catch (error) {
			console.log(error);
		}
	} else {
		httpServer = http.createServer(app);
	}
} catch (error) {
	logger.error(`Error occurred: ${error}`);
}

app.use(express.static(path.resolve("./public")));

// set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Body parsing Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// file upload
app.use(fileUpload({ createParentPath: true }));

// Middleware
setApiResponse(app);
// addLogs(app);

// Root Route
app.get("/", async (req: Request, res: Response) => {
	let baseUrl: string = req.protocol + "://" + req.headers.host;
	res.api.create({
		message: `Welcome to the Jewelry Catelog Project API!`,
		api_base_url: `${baseUrl}/api/v1`,
	});
});

/* download logs files */
app.get("/download/:name", function (req, res) {
	let fileName: string = req.params.name;
	fileName = fileName.replace(".txt", "");
	const file = `${__dirname}//logs/${fileName}.log`;
	res.download(file);
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
	req.socketIo = io;
	next();
});

// v1 api routes
app.use(express.static("./public"));
app.use(
	"/api/v1",
	(req: Request, res: Response, next: NextFunction) => {
		if (config.env == "development")
			logger.info(
				`${req.protocol}://${req.get("host")}${req.originalUrl} --- METHOD -> ${req.method} --- Time -> ${moment().format("YYYY-MM-DD HH:mm:ss")}`
			);
		next();
	},
	routes
);

// Error Handling & Not Found Page
app.use(RootErrorHandler);
app.use((req: Request, res: Response) => {
	return res.api.notFound({
		message: "Page Not Found",
	});
});

try {
	if (config.env == "production") {
		try {
			httpsServer.listen(port, async () => {
				// Test DB Connection and init relations
				await testDBConnections();
				logger.info(`Server running on http://localhost:${port}`);
			});
		} catch (error) {
			console.log(error);
		}
	} else {
		httpServer.listen(port, async () => {
			// Test DB Connection and init relations
			await testDBConnections();
			logger.info(`Server running on http://localhost:${port}`);
		});
	}
} catch (error) {
	logger.error(`Error occurred: ${error}`);
}

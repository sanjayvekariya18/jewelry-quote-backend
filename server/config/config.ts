import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

// get the intended host and port number, use localhost and port 3000 if not provided
const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid("production", "development", "test").required(),
		PORT: Joi.number().default(6363),

		JWT_SECRET: Joi.string().required().description("JWT secret key"),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description("minutes after which access tokens expire"),
		// JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("days after which refresh tokens expire"),

		RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description("minutes after which reset password expire"),

		DB_HOST: Joi.string().required().description("Database Host"),
		DB_PORT: Joi.string().required().description("Database Port"),
		DB_USERNAME: Joi.string().required().description("Database Username"),
		DB_PASSWORD: Joi.string().required().description("Database Password"),
		DB_NAME: Joi.string().required().description("Account Database Name"),
		DB_DIALECT: Joi.string().required().description("Database Dialect"),

		SYS_EMAIL: Joi.string().required().description("company email for email send"),
		SYS_EMAIL_PASSWORD: Joi.string().required().description("app password for email send"),

		SEND_NOTIFICATION_EMAIL: Joi.string().required().description("Email for Notification send"),

		CAPTCHA_SITE_KEY: Joi.string().required().description("paypal CAPTCHA_SITE_KEY is required"),
		CAPTCHA_SECRET_KEY: Joi.string().required().description("paypal CAPTCHA_SECRET_KEY is required"),

		FILEPATH: Joi.string().default("$../../public"),
		FRONTEND_URL: Joi.string().required(),
		BACKEND_URL: Joi.string().required(),

		SSL_KEY_PATH: Joi.string().required().description("SSL_KEY_PATH is required"),
		SSL_CERT_PATH: Joi.string().required().description("SSL_CERT_PATH is required"),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		// refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
	},
	resetPasswordExpirationMinutes: envVars.RESET_PASSWORD_EXPIRATION_MINUTES,
	db: {
		host: envVars.DB_HOST,
		username: envVars.DB_USERNAME,
		password: envVars.DB_PASSWORD,
		dbname: envVars.DB_NAME,
		dialect: envVars.DB_DIALECT,
		port: envVars.DB_PORT,
	},
	sys_email_details: {
		email: envVars.SYS_EMAIL,
		password: envVars.SYS_EMAIL_PASSWORD,
	},
	send_notification_email: envVars.SEND_NOTIFICATION_EMAIL,
	file_path: envVars.FILEPATH,
	frontend_url: envVars.FRONTEND_URL,
	backend_url: envVars.BACKEND_URL,
	ssl: {
		key_path: envVars.SSL_KEY_PATH,
		cert_path: envVars.SSL_CERT_PATH,
	},
	captcha: {
		site_key: envVars.CAPTCHA_SITE_KEY,
		secret_key: envVars.CAPTCHA_SECRET_KEY,
	},
};

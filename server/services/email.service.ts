import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";
import { BadResponseHandler } from "../errorHandler";
const fs = require("fs");

interface EmailData {
	to: string;
	subject: string;
	html: string;
}

export default class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport(
			{ service: "Gmail", auth: { user: config.sys_email_details.email, pass: config.sys_email_details.password } },
			{ from: config.sys_email_details.email }
		);
	}

	private sendEmail = async (emailData: EmailData) => {
		// Send the email
		return await this.transporter.sendMail(emailData).catch((error) => {
			console.error("Error sending email: ", error);
			throw new BadResponseHandler(error);
		});
	};

	public sendLoginIdPassword = async (data: any, to: string) => {
		const emailHtml = `Your Login id is ${data.login_id} and password is ${data.password}`;

		const emailData: EmailData = {
			html: emailHtml,
			subject: "Login id and password",
			to,
		};
		await this.sendEmail(emailData);
	};
}

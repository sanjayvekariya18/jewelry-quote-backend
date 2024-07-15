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
			{
				port: 587,
				service: "Gmail",
				host: "smtp.gmail.com",
				auth: {
					user: config.sys_email_details.email,
					pass: config.sys_email_details.password,
				},
				secure: true,
			},
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
		const backend_url = config.backend_url;

		const emailHtml = `
        <body bgcolor="#0D3C45" style="margin-top:20px;margin-bottom:20px">
            <!-- Main table -->
            <table border="0" align="center" cellspacing="0" cellpadding="0" bgcolor="white" width="650" style="background: #f0f8ffa3;border: 1px solid #0f346236;">
                <tr>
                    <td>
                        <!-- Child table -->
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="color:#0f3462; font-family: sans-serif;display: flex;justify-content: center;align-items: center">
                            <tr>
                                <td>
                                    <img src="${backend_url}/venezia-logo.png" height="60px"
                                        style="display:block; margin:auto;padding-bottom: 25px;padding-top: 30px; ">
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    <span
                                        style="margin: 0px;padding-bottom: 25px; text-transform: uppercase;font-size: 30px;font-weight: 500;font-family: system-ui;color:#0F3462;">Email
                                        and
                                        password
                                    </span>
                                    <p
                                        style=" margin: 0px 32px;padding-bottom: 25px;line-height: 33px; font-size: 18px;padding-top: 20px;font-family: system-ui;color:#0F3462;">
                                        Please use the following email and password to access the system. If you encounter any
                                        issues during the login process,
                                        feel free to reach out for assistance. Thank you for your cooperation.

                                    </p>
                                    <h2
                                        style="margin: 0px; padding-bottom: 20px;font-family: system-ui;font-weight: 500;font-size: 21px;color:#0F3462;">
                                        Email: <span style="text-decoration: underline;">${to}</span></h2>
                                    <h2
                                        style="margin: 0px; padding-bottom: 30px;font-family: system-ui;font-weight: 500;font-size: 21px;color:#0F3462;">
                                        Password:
                                        <span>${data.password}</span>
                                    </h2>
                                </td>
                            </tr>

                        </table>
                        <!-- /Child table -->
                    </td>
                </tr>
            </table>
            <!-- / Main table -->
        </body>`;

		const emailData: EmailData = {
			html: emailHtml,
			subject: "Email and password",
			to,
		};
		await this.sendEmail(emailData);
	};
}

import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";
import { BadResponseHandler } from "../errorHandler";
import moment from "moment";
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

	public sendThankYouForRegistration = async (data: any, to: string) => {
		const backend_url = config.backend_url;

		const emailHtml = `
        <body>
            <div style="background-color:#0D3C45; padding: 0px 50px; border-radius: 30px;max-width: 800px;margin: 0 auto;">
                <div style="background-color: #fefbf5;margin: 0 auto; ">
                    <div style="width: 100%;text-align: center;padding-top: 4px">
                        <img src="${backend_url}/venezia-logo.png" alt="" height="120" />
                    </div>
                    <div style="background-color:#0D3C45; padding: 12px 45px; border-radius: 50px;max-width: 450px;margin: 20px auto;text-align: center;">
                        <span style="color: white; font-size: 28px; font-family:monospace, sans-serif; font-weight: 700;">
                            Thank You for Signing Up
                        </span>
                    </div>
                    <div
                        style="margin-top: 20px; padding: 0 35px 30px 35px; font-size: 17px; line-height: 28px; letter-spacing: 0.3px; font-family: sans-serif; font-weight: 400;">
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            Thank you for your interest in Venezia Jewels DMCC!
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            At Venezia Jewels DMCC, We are passionate about crafting exquisite fine jewelry and providing exceptional B2B services.
                            We are here to cater to your needs.
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            This is to inform you that our admin team at Venezia Jewels DMCC is currently reviewing the account details provided during registration. it's take 24-48 hours.
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            Sorry for taking more details but this to ensure the accuracy of you doing jewelry business and we don't deal in retails with wholesale price. If any updates or corrections are necessary, kindly provide the revised information.
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            Your prompt response will help expedite the verification process. If you have any questions or need further assistance, please so not hesitate to contact our admin team at
                            <a style="color: blue;" href="https://mail.google.com/mail/?view=cm&fs=1&to=veneziajewelsdmcc@gmail.com" target="_blank">veneziajewelsdmcc@gmail.com</a>
                            or
                            <a style="color: blue;" href="tel:+971 52 134 8277" target="_blank"> +971 52 134 8277 </a>
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            Thank you for you cooperation. Once verified, we will proceed to approve your account promptly.
                        </p>
                        <p style="margin-bottom: 0; padding-bottom: 2px;">
                            We look forward to welcoming you to Veneia Jewels DMCC soon.
                        <p style="margin-bottom: 0; padding-bottom: 2px;">Best regards,</p>
                        Venezia Jewels DMCC
                    </div>
                </div>
            </div>
        </body>
        `;

		const emailData: EmailData = {
			html: emailHtml,
			subject: "Welcome to Venezia Jewels – Thank You for Registering!",
			to,
		};
		await this.sendEmail(emailData);
	};

	public sendRegistrationUpdateToAdmin = async (data: any, to: string) => {
		const emailHtml = `
        Hi Admin,

        Hope this email finds you well.
        This is to inform you that a new customer has recently registered with us. Here are the details:

        Company Name: ${data.company_name}
        Customer Name: ${data.customer_name}
        Email Address: ${data.customer_email}
        Phone Number: ${data.country_code} ${data.mobile_number}
        Registration Date: ${moment(data.createdAt).format("Do MMM, YYYY h:mm A")}
        `;

		const emailData: EmailData = {
			html: emailHtml,
			subject: "New Customer Registration Notification",
			to,
		};
		await this.sendEmail(emailData);
	};

	public sendLoginIdPassword = async (data: any, to: string) => {
		const backend_url = config.backend_url;

		const emailHtml = `
        <body>
            <div style="background-color:#0D3C45; padding: 0px 50px; border-radius: 30px;max-width: 800px;margin: 0 auto;">
                <div style="background-color: #fefbf5;margin: 0 auto; ">
                    <div style="width: 100%;text-align: center;padding-top: 40px">
                        <img src="${backend_url}/venezia-logo.png" alt="" height="120" />
                    </div>
                    <div style="background-color:#0D3C45; padding: 12px 45px; border-radius: 50px;max-width: 450px;margin: 20px auto;text-align: center;">
                        <span style="color: white; font-size: 28px; font-family:monospace, sans-serif; font-weight: 700;">Welcome Dashboard</span>
                    </div>
                    <div style="margin-top: 20px; padding: 0 35px 30px 35px; font-size: 17px; line-height: 28px; letter-spacing: 0.3px; font-family: sans-serif; font-weight: 400; color:black;">
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">Dear ${data.customer_name},</p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">On behalf of Venezia Jewels DMCC, I extend you a warm
                            welcome! We are thrilled
                            to have you join our esteemed clientele and look forward to a fruitful partnership
                            ahead. Below are your log in details to access your account
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            User name: ${to}
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            Password: ${data.password}
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            Please use the provided credentials to log in at <a style="color: blue;"
                                href="https://www.veneziajewels.com/login" target="_blank">www.veneziajewels.com/login.</a> We
                            recommend changing yourr password after your first login for security reasons.
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            At Venezia Jewels DMCC, We are committed to delivering exceptional quality and
                            service that exceeds your expectations. Your trust in us is greatly appreciated, and
                            we are dedicated to ensuring your experience with us is nothing short of excellent.
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            Please take moment to explore our collections on www.veneziajewels.com. and let
                            us know how we can assist you further. Should you have any questions or require
                            assistance, do not hesitate to contact us. We are here to serve you. feel free to
                            reach out to us at veneziajewelsdmcc@gmail.com or +971 52 134 8277.
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">
                            Thank you once again for choosing Venezia Jewels DMCC. We are excited to embark
                            on this journey with you and create beautiful memorable experiences together.
                        </p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">Best regards,</p>
                        <p style="color:black; margin-bottom: 0; padding-bottom: 2px;">Venezia Jewels DMCC</p>
                        
                    </div>
                </div>
            </div>
        </body>`;
		const emailData: EmailData = {
			html: emailHtml,
			subject: "Email and password",
			to,
		};
		await this.sendEmail(emailData);
	};

	public sendForgotPasswordEmail = async (data: any, to: string) => {
		const frontend_url = config.frontend_url;
		const backend_url = config.backend_url;

		const logo = `${backend_url}/venezia-logo.png`;
		const emailHtml = `
            <body>
                <div style="background-color:#0D3C45; padding: 0px 50px; border-radius: 30px;max-width: 800px;margin: 0 auto;">
                    <div style="background-color: #fefbf5;margin: 0 auto; ">
                        <div style="width: 100%;text-align: center;padding-top: 40px">
                            <img src="${logo}" alt="" height="120" />
                        </div>
                        <div
                            style="background-color:#0D3C45; padding: 13px 45px; border-radius: 50px;max-width: 620px;margin: 20px auto;text-align: center;">
                            <span style="color: white; font-size: 23px; font-family:monospace, sans-serif; font-weight: 700;">
                                You have requested to reset your password.
                            </span>
                        </div>
                        <div style="  border-radius: 50px;max-width: 650px;margin: 0 auto;text-align: center;">
                            <span style="color: #0D3C45; font-size: 17px; font-family:monospace, sans-serif; font-weight: 700;">
                                Click on below button to reset your password.
                            </span>
                        </div>
                        <div style="padding-bottom: 50px;text-align: center;padding-top: 60px;">
                            <a href="${frontend_url}/reset-password?code=${data}" target="_blank"
                                style="text-decoration: none ;cursor: pointer;text-transform: uppercase;padding: 14px 21px;color: white;background: green;outline: none;border: none;border-radius: 5px;font-size: 16px;font-weight: 600;font-family: monospace;">
                                Reset Password
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        `;

		const emailData: EmailData = {
			html: emailHtml,
			subject: "Forget Password",
			to,
		};
		await this.sendEmail(emailData);
	};

	public sendEnquiryThankYouToCustomer = async (data: any, to: string) => {
		const emailHtml = `
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Dear ${data.customer_name},</p>
                <p>Thank you for reaching out to us and placing an enquiry. We truly appreciate your interest in our products, and we're excited about the opportunity to assist you.</p>

                <p>Our team is currently reviewing the details of your enquiry and will get back to you shortly with the information you need. In the meantime, if you have any additional questions or require further assistance, please don’t hesitate to contact us.</p>

                <p>Once again, thank you for considering us. We look forward to helping you find the best solution for your needs.</p>
            </body>
        `;
		const emailData: EmailData = {
			html: emailHtml,
			subject: "Thank You for Your Enquiry",
			to,
		};
		await this.sendEmail(emailData);
	};

	public sendEnquiryUpdateToAdmin = async (data: any, to: string) => {
		const emailHtml = `
        <body>
            <p>Dear Admin,</p>

            <p>This is to inform you that we have received a new enquiry from ${data.customer_name}. Below are the details:</p>

            <ul>
                <li><strong>Customer Name:</strong> ${data.customer_name}</li>
                <li><strong>Customer Email:</strong> ${data.email}</li>
                <li><strong>Contact Information:</strong> ${data.contact_number}</li>
                <li><strong>Enquiry For products:</strong> ${data.product_ids}</li>
                <li><strong>Date and Time of Enquiry:</strong> ${moment(data.createdAt).format("Do MMM, YYYY h:mm A")}</li>
                <li><strong>Enquiry Notes:</strong> ${data.notes}</li>
            </ul>
        </body>
        `;
		const emailData: EmailData = {
			html: emailHtml,
			subject: "New Enquiry Notification",
			to,
		};
		await this.sendEmail(emailData);
	};
}

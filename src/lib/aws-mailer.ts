import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

/*
The SDK automatically detects AWS credentials set as variables in your environment and uses them for SDK requests, eliminating the need to manage credentials in your application. The environment variables that you set to provide your credentials are:

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

AWS_SESSION_TOKEN
*/
type SendEmailTypePlain = {
	toAddress: string[];
	emailSubject: string;
	emailText: string;
};

export class SesMailerService {
	SES_CLIENT: SESClient;

	AWS_REGION: string;
	FROM_EMAIL_ADDRESS: string;

	constructor(AWS_REGION: string, FROM_EMAIL_ADDRESS: string) {
		this.AWS_REGION = AWS_REGION;
		this.FROM_EMAIL_ADDRESS = FROM_EMAIL_ADDRESS;
		this.SES_CLIENT = new SESClient({
			region: this.AWS_REGION
		});
	}

	private createSendEmailCommand({
		toAddress,
		fromAddress,
		emailSubject,
		emailText
	}: {
		toAddress: string[];
		fromAddress: string;
		emailSubject: string;
		emailText: string;
	}) {
		return new SendEmailCommand({
			Destination: {
				/* required */
				CcAddresses: [
					/* more items */
				],
				ToAddresses: toAddress
			},
			Message: {
				/* required */
				Body: {
					/* required */
					Html: {
						Charset: 'UTF-8',
						Data: emailText
					},
					Text: {
						Charset: 'UTF-8',
						Data: emailText
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: emailSubject
				}
			},
			Source: fromAddress,
			ReplyToAddresses: [
				/* more items */
			]
		});
	}
	async sendPlainTextMail(payload: SendEmailTypePlain) {
		return await this.SES_CLIENT.send(
			this.createSendEmailCommand({
				toAddress: payload.toAddress,
				fromAddress: this.FROM_EMAIL_ADDRESS,
				emailSubject: payload.emailSubject,
				emailText: payload.emailText
			})
		);
	}
}

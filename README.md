# SvelteKit Email Password Authentication Utilities

This package provides utility functions for authentication, JWT signing, and sending emails via AWS SES.

## Functions

### JWT Functions

- `generateJwtToken(payload: any, secret: string, duration: string)`: This function generates a JWT token with a given payload, secret, and duration. The payload can be any data that you want to include in the token. The secret is used to sign the token and the duration is the time after which the token will expire.

- `verifyJwtToken(token: string, secret: string)`: This function verifies a JWT token with a given secret and returns the payload without the issued at (`iat`) and expiration (`exp`) properties.

### Bcrypt Functions

- `hashPasswordBcrypt(password: string, saltRounds: number)`: This function hashes a password using bcrypt. The `saltRounds` parameter determines the complexity of the salt.

- `comparePasswordBcrypt(password: string, hash: string)`: This function compares a password with a hashed password and returns `true` if they match, `false` otherwise.

### SES Mailer Service

The `SesMailerService` class provides methods to send emails using AWS SES. It requires AWS region and the email address from which emails will be sent as parameters in the constructor.

- `sendPlainTextMail(payload: SendEmailTypePlain)`: This method sends a plain text email. The payload should be an object containing `toAddress` (array of recipient email addresses), `emailSubject` (subject of the email), and `emailText` (content of the email).

## Requirements

- Node.js and npm installed.
- AWS credentials set as environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`).
- AWS SES verified email address for sending emails.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Set the required environment variables.
4. Use the functions and methods as per your requirements.
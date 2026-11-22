# Advanced Identity

### AWS Security Token Service (STS)

- Enables you to create temporary, limited-privileges credentials to access your AWS resources.
- Short-term credentials: you can configure the expiration date.
- **Use Cases**:
	- Identity federation: manage use identities in external systems, and provide them with STS tokens to access AWS resources.
	- IAM Roles for cross/same account access.
	- IAM Roles for AmazonEC2: provide temporary credentials for EC2 instances to access AWS resources.

### Amazon Cognito

- **Identify** for your Web and Mobile applications users.
- Instead of creating them an IAM user, you create a user in Cognito.

### Microsoft Active Directory (AD)

- Is found on any Windows Server with AD Domain Services.
- Is a database of objects: user accounts, computers, printers, file shares, security groups.
- Centralized security management, create account, assign permissions.

### AWS Directory Services

- **AWS Managed Microsoft AD**:
	- Create your own AD in AWS, manage users locally, supports MFA.
	- Establish "trust" connections with your on-premise AD.
- **AD Connector**:
	- Directory Gateway (proxy) to redirect to on-premise AD, supports MFA.
	- Users are managed on the on-premise AD.
- **Simple AD**:
	- AD-compatible managed directory on AWS.
	- Cannot be joined with on-premise AD.

### AWS IAM Identity Center

- One login for all your:
	- AWS accounts in AWS Organizations.
	- Business cloud applications (eg. Salesforce, Microsoft 365, etc.)
	- SAML2.0-enabled applications.
	- EC2 Windows Instances.
- Identity providers:
	- Built-in identity store in IAM Identity Center.
	- 3rd party: Active Directory (AD), OneLogin, Okta, etc.

### Summary

- **IAM**:
	- Identity and Access Management inside your AWS account.
	- For users that you trust and belong to your company.
- **Organizations**: Manage multiple accounts.
- **Security Token Service (STS)**: temporary, limited-privileges credentials to access AWS resources.
- **Cognito**: create a database of users for your mobile & web applications.
- **Directory Services**: integrate Microsoft Active Directory in AWS.
- **IAM Identity Center**: one login for multiple AWS accounts & applications.

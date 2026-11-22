# IAM

### Users and Groups
- **Global Service**
- Root account created by default and should NOT be used or shared.
- Groups can't contain other groups.
- Users can be in a group, multiple groups, or no groups
- Users are people within the organization and can be grouped.
- Creating a user:
	- Go to Users in the IAM console and create the user.
	- Auto generate a password and require a change on next sign in (if the user isn't for you).
	- Give the user permissions (usually done by assigning them to a group).

### Permissions
- Users or Groups can be assigned policies (JSON documents).
- Apply the **principle of least privilege**
#### Policies
- Policies applied to groups pass those permissions to all users in that group (inheritance).
- It is recommended to apply permissions through a policy attached to a group, as it is easier to manage.
- A policy can also be assigned inline to a specific user.
```json
{
	"Version": "2026-10-17",
	"Id": "Account Permissions",
	"Statement": [
		{
			"Sid": "1",
			"Effect": "Allow",
			"Principal": {
				"AWS": ["arn:aws:iam::123456789:root"]
			},
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": ["arn:aws:S3:::myBucket/*"]
		}
	]
}
```
PARTS (* required):
- Version*: policy language version
- Id: identifier
- Statement*: one or more individual statements.
	- Sid: Identifier for the statement.
	- Effect* (Allow/Deny).
	- Principal*: account/user/role to which this policy is applied to.
	- Action*: list of actions the policy allows or denies.
	- Resource*: list of resources the actions apply to.
	- Condition: for when the policy is in effect.

### Roles
- Some services need to perform actions on your behalf.
- To do this, we assign permissions to AWS services with IAM Roles.
- Essentially a way of giving permissions to a service.
- Common roles: EC2 instance roles, Lambda function roles, CloudFormation roles.

### Security

- Found under `Account Settings`.
- You can setup a **password policy** in AWS:
	- Set a min password length.
	- Require specific character types.
	- Allow all IAM users to change their own passwords.
	- Require users to change their password after some time (password expiration).
	- Prevent password re-use.
- **Multi Factor Authentication** (MFA) service is essential for security.
	- Users that have access to your account and can possibly change configurations or delete resources in your AWS account.
	- MFA = password you know + security device you own.
	- MFA device options in AWS:
		- Virtual MFA device: Google authenticator (phone only), Authy (multi-device)
		- Universal 2nd Factor (2UF) Security Key: YubiKey (Support for multiple root users and IAM users using a single security key)
	- Hardware Key Fob MFA Device
	- Hardware Key Fob MFA Device fore AWS GovCloud

### How Can Users Access AWS?

- Three Options:
	- AWS Management Console: protected by password + MFA.
	- AWS Command Line Interface (CLI): protected by access keys.
		- Interact with AWS services using commands in command-line shell.
		- Direct access to the public APIs of AWS services.
		- You can develop scripts to manage your resources.
		- It's open-source.
	- AWS Software Development Kit (SDK): for code and is protected by access keys.
		- Language-specific APIs.
		- Enables you to access and manage AWS services programmatically.
		- Embedded within your application.
		- Supports SDKs (JavaScript, Python, PHP, .NET, Ruby, Java, GO, Node.js, C++), Mobile SDKs (Android and iOS), IoT Device SDKs (Embedded C, Arduino).
- Access Keys are generated through the AWS console.
- Users manage their own keys.
- Don't Share your access keys!!
	- Access Key ID ~= username
	- Secret Access Key ~= password

### Security Tools

- Credentials Report (account-level).
	- A report that lists all your account's users and the status of their various credentials.
- Access Advisor (user-level).
	- Shows the service permissions granted to a user and when those services were last accessed.
	- You can use this info to revise your policies.

### Best Practices

- Don't use root account except for AWS account setup.
- Assign users to groups and assign permissions to groups.
- Create a strong password policy.
- Use and enforce the use of MFA.
- Create and use roles for giving permissions to AWS services.
- Use Access Keys for programmatic access (CLI/SDK)
- Audit permissions with IAM credentials report & IAM access advisor.

### Shared Responsibility Model

- AWS is Responsible for:
	- Infrastructure (global network security).
	- Configuration and vulnerability analysis.
	- Compliance validation.
- You are Responsible for:
	- Users, Groups, Roles, Policies management and monitoring.
	- Enabling MFA on all accounts.
	- Rotate all of your keys often.
	- Use IAM tools to apply appropriate permissions.
	- Analyze access patterns & review permissions.

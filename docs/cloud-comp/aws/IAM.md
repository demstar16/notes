- **Global Service**
- Root account created by default and should NOT be used or shared.
- Groups can't contain other groups.
- Users can be in a group, multiple groups, or no groups

### Permissions
- Users or Groups can be assigned policies (JSON documents).
- Apply the **principle of least privilege**
#### Policies
- Policies applied to groups pass those permissions to all users in that group (inheritance).
- It is recommended to apply permissions through a policy attached to a group, as it is easier to manage.
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
	- Condition: for when the policy is in effect.

### Roles
- Some services need to perform actions on your behalf.
- To do this, we assign permissions to AWS services with IAM Roles.
- Essentially a way of giving permissions to a service.
- Common roles: EC2 instance roles, Lambda function roles, CloudFormation roles.
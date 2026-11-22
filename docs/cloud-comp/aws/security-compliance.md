# Security & Compliance

### AWS Shared Responsibility Model

- AWS Responsibility is the security **of** the cloud:
	- Protecting infrastructure that runs all the AWS services.
	- Managed services like S3, DynamoDB, RDS, etc.
- Customer responsibility is the security **in** the cloud.
	- For an EC2 instance, customer is responsible for management of the guest OS (security patches and updates), firewall & network config, IAM.
	- Encrypting application data.
- Shared controls:
	- Patch management, configuration management, awareness & training.

**Examples**

_RDS_

- AWS responsibilities:
	- Manage the underlying EC2 instance, disable SSH access.
	- Automated DB patching.
	- Automated OS patching.
	- Audit the underlying instance and disks & guarantee it functions.
- Your responsibility:
	- Check the ports / IP / security group inbound rules in DB's SG.
	- In-database user creation and permissions.
	- Creating a database with or without public access.
	- Ensure parameter groups or DB is configured to only allow SSL connections.
	- Database encryption.

_S3_

- AWS responsibilities:
	- Guarantee you get unlimited storage.
	- Guarantee you get encryption.
	- Ensure separation of the data between different customers.
	- Ensure AWS employees can't access your data.
- Your responsibility:
	- Bucket configuration.
	- Bucket policy / public setting.
	- IAM user and roles.
	- Enabling encryption.

### DDoS Protection on AWS

- **AWS Shield Standard**: protects against DDoS attacks for your website and applications, for all customers at no additional costs.
- **AWS Shield Advanced**: 24/7 premium DDoS protection.
- **AWS WAF**: Filter specific requests based on rules.
- **CloudFront and Route 53**:
	- Availability protection using global edge network.
	- Combined with AWS Shield, provides attack mitigation at the edge.
- Leverage AWS Auto Scaling

### AWS Shield

- **Standard**
	- Free service that is activated for every AWS customer.
	- Provides protection from attacks such as SYN/UDP Floods, Reflection attacks and other layer 3/layer 4 attacks.
- **Advanced**
	- Optional DDoS mitigation service ($3000 per month per organisation)
	- Protect against more sophisticated attacks on Amazon EC2, Elastic Load Balancing, Amazon CloudFront, AWS Global Accelerator, and Route 53.
	- 24/7 access to AWS DDoS response team.
	- Protect against higher fees during usage spikes due to DDoS.

### Firewalls

**AWS Web Application Firewall (WAF)**

- Protects your web applications from common web exploits (Layer 7).
- **Layer 7** is HTTP (vs Layer 4 which is TCP).
- Deploy an Application Load Balancer, API Gateway , CloudFront.
- Define Web AC: (Web Access Control List):
	- Rules can include IP addresses, HTTP headers, HTTP body, or URI strings.
	- Protects from common attacks - SQL injection and Cross-Site Scripting (XSS).
	- Size constraints, geo-match (block countries).
	- Rate-based rules (to count occurrences of events) - for DDoS protection.

**AWS Network Firewall**

- Protect your entire Amazon VPC.
- From Layer 3 to Layer 7 protection.
- Any direction, you can inspect: VPC to VPC traffic, outbound to internet, inbound to internet, to and from direct connect & site-to-site VPN.

**AWS Firewall Manager**

- Manage security rules in all accounts of an AWS organization.
- Security policy: common set of security rules;
	- VPC Security Groups for EC2, ALB, etc.
	- WAF rules.
	- AWS Shield Advanced.
	- AWS Network Firewall.
- Rules are applied to new resources as they are created (good for compliance) across and future accounts in your organisation.

### Penetration Testing on AWS Cloud

- AWS customers can carry out security assessments or penetration tests without permission on 8 services:
	- Amazon EC2 instances, NAT Gateways, and Elastic Load Balancers.
	- Amazon RDS.
	- Amazon CloudFront.
	- Amazon Aurora.
	- Amazon API Gateway.
	- AWS Lambda and Lambda Edge Functions.
	- Amazon Lightsail resources.
	- Amazon Elastic Beanstalk environments.
- This won't be tested in exam!
- **Prohibited Activities**
	- DNS zone walking via Amazon Route53 Hosted Zones.
	- Denial of Service (DoS), Distributed Denial of Service (DDoS), Simulated DoS, Simulated DDoS.
	- Port flooding.
	- Protocol flooding.
	- Request flooding.

### AWS Encryption

**Data at Rest vs Data in Transit**

- **At rest:** data stored or archived on a device (on a hard disk, RDS instance, S3 Glacier Deep Archive, etc.)
- **In transit:** data being moved from one location to another (transfer from on-premises to AWS, data transferred on the network.)
- We want to encrypt data in both states to protect it.
- We leverage **encryption keys** to do this.

**AWS Key Management Service (KMS)**

- Encryption in AWS almost always refers to this service.
- AWS manages the encryption keys for us with this service.
- Encryption Opt-in:
	- EBS Volumes: encrypt volumes.
	- S3 buckets: Server-side encryption of objects.
	- Redshift database: encryption of data.
	- RDS database: encryption of data.
	- EFS drives: encryption of data.
- Encryption Automatically enabled:
	- CloudTrail Logs.
	- S3 Glacier.
	- Storage Gateway.
- **Types of KMS Keys:**
	- Customer Managed Key:
		- Create, manage and used by the customer, can enable or disable.
		- Possibility of rotation policy (new key generated every year, old key preserved).
		- Possibility to bring-your-own-key.
	- AWS Managed Key:
		- Created, managed and used on the customer's behalf by AWS.
		- Used by AWS services (aws/s3, aws/ebs, aws/redshift).
	- AWS Owned Key:
		- Collection of CMKs that an AWS service owns and manages to use in multiple accounts.
		- AWS can use those to protect resources in your account (but you can't view the keys).
	- CloudHSM Keys (custom keystore):
		- Keys generated from your own CloudHSM hardware device.
		- Cryptographic operations are performed within the CloudHSM cluster.

**Cloud HSM**

- HSM -> Hardware Security Model.
- KMS: AWS manages the software for encryption.
- Cloud HSM: AWS provisions encryption hardware.
- Allows you to manage your own encryption keys entirely.
- HSM device is tamper resistance, FIPS 140-2 Level 3 compliance.

### AWS Certificate Manager

- Lets you easily provision, manage, and deploy SSL/TLS Certificates.
- Used to provide in-flight encryption for websites (HTTPS).
- Supports both public and private TLS certificates.
- Free of charge for public TLS certificates.
- Automatic TLS certificate renewal.
- Integrations with (load TLS certificates on):
	- Elastic Load Balancers.
	- CloudFront Distributions.
	- APIs on API Gateway.

### AWS Secrets Manager

- Newer service meant for storing secrets.
- Capability to force rotation of secrets every X days.
- Automate generation of secrets on rotation using Lambda.
- Integration with Amazon RDS (MySQL, PostgreSQL, Aurora).
- Secrets are encrypted using KMS.
- Mostly meant for RDS integration.

### AWS Artifact

- Not really a service but is a portal that provides customers with on-demand access to AWS compliance documentation and AWS agreements.
- **Artifact reports**: Allows you to download AWS security and compliance documents from third-party auditors, like AWS ISO certifications, Payment Card Industry (PCI), and System and Organisation (SOC) reports.
- **Artifact agreements**: Allows you to review, accept, and track the status of AWS agreements such as the Business Associate Addendum (BAA) or the Health Insurance Portability and Accountability Act (HIPAA) for an individual account or in your organisation.
- Can be used to **support internal audits or compliance.**

### Amazon GuardDuty

- Intelligent Threat discovery to protect your AWS Account.
- Uses Machine Learning algorithms, anomaly detection, 3rd party data.
- Input data includes:
	- CloudTrail Events Logs (unusual API calls, unauthorized deployments).
		- CloudTrail Management Events (create VPC subnet, create trail, etc.)
		- CloudTrail S3 Data Events (get object, list objects, delete objects, etc.)
	- VPC Flow Logs (unusual internal traffic, unusual IP address.)
	- DNS Logs (compromised EC2 instances sending encoded data within DNS queries.)
	- Optional Features (EKS Audit Logs, RDS & Aurora, EBS, Lambda, S3 Data events, etc.)
- Can setup **EventBridge** rules to be notified in case of findings.
- Can protect against CryptoCurrency attacks.

### Amazon Inspector

- Automated Security Assessments
- For **EC2 instances**:
	- Leveraging the AWS System Manger agent.
	- Analyze against unintended network accessability.
	- Analyze the running OS against known vulnerabilities.
- For **Container Images pushed to Amazon ECR**:
	- Assessment of Container Images as they are pushed.
- For **Lambda functions**:
	- Identifies software vulnerabilities in function code and package dependencies.
	- Assessment of functions as they are developed.
- Reporting & integration with AWS Security Hub.
- Send findings to Amazon Event Bridge.
- The inspector (only for the 3 described above) evaluates:
	- continuous scanning of the infrastructure.
	- Package vulnerabilities - database of CVE.
	- Network reachability.
	- A risk score is associated with all vulnerabilities for prioritization.

### AWS Config

- Helps with auditing and recording compliance of your AWS resources.
- Helps record configurations and changes over time.
- Possibility of storing the configurations data into S3 (analyzed by Athena).
- AWS Config helps answer these questions:
	- Is there unrestricted SSH access to my security groups?
	- Do my buckets have any public access?
	- How has my ALB configuration changed over time?
- You can receive alerts for any changes.
- AWS Config is a per-region service.
- Can be aggregated across regions and accounts.
- You can view the compliance and configuration of a resource over time.

### AWS Macie

- Is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.
- Macie helps identify and alert you to sensitive data, such as personally identifiable information (PII)

### AWS Security Hub

- Central security tool to manage security across several AWS accounts and automate security checks.
- Automatically aggregates alerts in predefined or personal findings formats from various AWS services & AWS partner tools:
	- Config.
	- GuardDuty.
	- Inspector.
	- Macie.
	- IAM Access Analyzer.
	- AWS Systems Manager.
	- AWS Firewall Manager.
	- AWS Health.
	- AWS Partner Network Solutions.
- You must first enable the AWS Config Service.

### AWS Detective

- Analyzes, investigates, and quickly identifies the root cause of security issues or suspicious activities using ML and graphs.
- Automatically collects and processes events from VPC Flow Logs, CloudTrail, GuardDuty and create a unified view.
- Produces visualizations with details and context to get to the root cause.

### AWS Abusive Behaviors

- Spam.
- Port scanning.
- DoS or DDoS attacks.
- Intrusion attempts.
- Hosting objectionable or copyrighted content.
- Distributing malware.

### IAM Access Analyzer

- Find out which resources are shared externally:
	- S3 buckets.
	- IAM roles.
	- KMS keys.
	- Lambda functions and layers.
	- SQS queues.
	- Secrets Manager Secrets.
- Define Zone of Trust (AWS Account or AWS Organisation)
- Access outside zone of trusts is what the Access Analyzer will find.

### Summary

- Shared Responsibility on AWS.
- **Shield**: Automatic DDoS Protection + 24/7 support for advanced.
- **WAF**: Firewall to filter incoming requests based on rules.
- **KMS**: Encryption keys managed by AWS.
- **CloudHSM**: Hardware encryption, we manage encryption keys.
- **AWS Certificate Manager**: provision, manage, and deploy SSL/TLS Certificates.
- **Artifact**: Get access to compliance reports such as PCI, ISO, etc…
- **GuardDuty**: Find malicious behavior with VPC, DNS & CloudTrail Logs.
- **Inspector**: find software vulnerabilities in EC2, ECR Images, and Lambda functions.
- **Network Firewall**: Protect VPC against network attacks.
- **Config**: Track config changes and compliance against rules.
- **Macie**: Find sensitive data (ex: PII data) in Amazon S3 buckets.
- **CloudTrail**: Track API calls made by users within account.
- **AWS Security Hub**: gather security findings from multiple AWS accounts.
- **Amazon Detective**: find the root cause of security issues or suspicious activities.
- **AWS Abuse**: Report AWS resources used for abusive or illegal purposes.
- **Root user privileges**:
	- Change account settings.
	- Close your AWS account.
	- Change or cancel your AWS Support plan.
	- Register as a seller in the Reserved Instance Marketplace.
- **IAM Access Analyzer**: identify which resources are shared externally.
- **Firewall Manager**: manage security rules across an Organization (WAF, Shield…).

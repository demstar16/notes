# Account Management, Billing & Support

### AWS Organizations

- Global service for managing multiple AWS accounts.
- Cost Benefits:
	- Consolidating Billing across all accounts.
	- Pricing benefits from aggregated usage.
	- Pooling of reserved EC2 instances for optimal savings.
- API is available to automate AWS account creation.
- You can Restrict account privileges using Service Control Policies (SCP).

**Multi Account Strategies**

Create accounts in organizational units to help with handing out policies and authorization. Some example of organizational units (OU) could be business units (sales, retail, finance), code environment units (production, development, test), or project units (project 1, project 2, project 3).

- Use tagging standards for billing purposes.
- Enable CloudTrail on all accounts, send logs to central S3 account.
- Send CloudWatch Logs to central logging account.

**Consolidated Billing**

When enabled provides you with:

- Combined usage for volume pricing, reserved instances and saving plans discounts.
- One bill.
	The management account can turn off reserved instances discount sharing for any account in the AWS organization, including itself.

### AWS Control Tower

- For setting up and governing a secure and compliant multi-account AWS environment based on best practices.
- Runs on top of AWS Organizations: automatically sets up AWS Organizations to organize accounts and implement SCPs.
- **Benefits**:
	- Automate the set up of your environment in a few clicks.
	- Automate ongoing policy management using guardrails.
	- Detect policy violations and remediate them.
	- Monitor compliance through an interactive dashboard.

### Service Control Policies (SCP)

- Whitelist or blacklist IAM actions.
- Applied to the organizational unit (OU) or account level.
- Does not apply to the master account.
- SCP is applied to all the users and roles of the account, including the root user!
- The SCP does not affect service-linked roles: service linked roles enable other AWS services to integrate with AWS organizations and can't be restricted by SCPs.
- SCP must have an explicit Allow as it doesn't allow anything by default.
- Use Cases:
	- Restrict access to certain services (eg. can't use EMR.)
	- Enforce PCI compliance by explicitly disabling services.
- In terms of Hierarchy, if a OU is DENIED access to something with an SCP and then a user within that OU is ALLOWED access via another SCP, that user still won't be able to access it as that thing is not allowed in that OU. So OU takes precedence.
- You can assign a SCP to the Master Account but it won't apply.

### Pricing

**Pricing Models**

- **Pay as you go:** pay for what you use, remain agile, responsive, and meet scale demands.
- **Save when you reserve:** minimize risks, predictably manage budgets, comply with long-term requirements.
- **Pay less by using more:** volume-based discounts.
- **Pay less as AWS grows**

**Compute Pricing - EC2**

- Only charged for what you use.
- Number of instances.
- Instance config: physical capacity, region, OS and software, instance type, instance size.
- ELB running time and amount of data processed.
- Detailed monitoring.
- **On-demand instances**:
	- Minimum of 60s.
	- Pay per second (Linux/Windows) or per hour.
- **Reserved instances**:
	- Up to 75% discount compared to On-demand on hourly rate.
	- 1 or 3 years commitment.
	- All upfront, partial upfront, no upfront.
- **Spot instances**:
	- Up to 90% discount compared to On-demand on hourly rate.
	- Bid for unused capacity.
- **Dedicated Host**:
	- On-demand.
	- Reservation for 1 year or 3 years commitment.
- Savings plans as an alternative to save on sustained usage.

**Compute Pricing - Lambda & ECS**

- **Lambda**:
	- Pay per call.
	- Pay per duration.
- **ECS**:
	- EC2 Launch Type Model: No additional fees, you pay for AWS resources stored and created in your application.
- **Fargate**:
	- Fargate Launch Type Model: Pay for vCPU and memory resources allocated to your applications in your containers.

**Storage Pricing - S3**

- **Storage classes**: S3 Standard, S3 Infrequent Access, S3 One-Zone IA, S3 Intelligent Tiering, S3 Glacier and S3 Glacier Deep Archive.
- Number and size of objects: Price can be tiered (based on volume).
- Number and type of requests.
- Data transfer OUT of the S3 region.
- S3 Transfer Acceleration.
- Lifecycle transitions.

**Storage Pricing - EBS**

- Volume type (based on performance).
- Storage volume in GB per month provisioned.
- IOPS:
	- General purpose SSD: included.
	- Provisioned IOPS SSD: provisioned amount in IOPS.
	- Magnetic: number of requests.
- Snapshots:
	- Added data cost per GB per month.
- Data Transfer:
	- Outbound data transfers are tiered for volume discounts.
	- Inbound is free.

**Database Pricing - RDS**

- Per hour billing.
- Database characteristics: Engine, Size, Memory Class.
- Purchase type:
	- On-demand.
	- Reserved instances (1 or 3 years) with required up-front.
- Backup storage: no additional charge for backup storage, up to 100% of your total database storage for a region.
- Additional storage (per GB per month).
- Number of input and output requests per month.
- Deployment type (storage and I/O are variable):
	- Single AZ.
	- Multi AZ.
- Data transfer:
	- Outbound data transfer are tiered for volume discounts.
	- Inbound is free.

**Networking Costs**

- Transfers within a region across AZ using a private IP costs $0.01.
- Transfers within a region within same AZ using a private IP is free.
- Transfers within a region across AZ using a public IP costs $0.02.
- Transfers across a region costs $0.02.

**Savings Plan**

- Commit a certain $ amount per hour for 1 or 3 years.
- Easiest way to setup long-term commitments on AWS.
- Setup from the AWS Cost Explorer console.

### AWS Resource Access Manager (RAM)

- Share AWS resources that you own with other AWS accounts within your organisation.
- Avoid resource duplication.
- Supported resources include Aurora, VPC Subnets, Transit Gateway, Route 53, EC2 Dedicated Hosts, License Manager Configurations.

### AWS Service Catalog

- Acts as a quick self-service portal to launch a set of authorized products pre-defined by admins.

### AWS Compute Optimizer

- Reduce costs and improve performance by recommending optimal AWS resources for your workloads.
- Helps you choose optimal configurations and right-size your workloads.
- Uses ML to analyze your resources' configurations and their utilization CloudWatch metrics.
- Supported resources:
	- EC2 instances.
	- EC2 Auto Scaling Groups.
	- EBS Volumes.
	- Lambda functions.
- Lower costs by up to 25%.
- Recommendations can be exported to S3.

### Billing and Costing Tools

- Estimating costs in the cloud: Pricing Calculator.
- Tracking costs in the cloud:
	- Billing Dashboard.
	- Cost Allocation Tags:
		- Track AWS costs on a detailed level.
		- AWS generated tags: automatically applied to the resource you create and start with aws prefix.
		- User-defined tags: starts with user prefix.
	- Cost and Usage Reports.
	- Cost Explorer.
- Monitoring against costs plans:
	- Billing Alarms.
	- Budgets.

**Tagging and Resource Groups**

- Tags are used for organizing resources:
	- EC2 instances, images, load balancers, security groups...
	- RDS, VPC resources, Route 53, IAM users, etc.
	- Resources created by CloudFormation are all tagged the same way.
- Free naming, common tags are: Name, Environment, Team.
- Tags can be used to create Resource Groups.
	- Create, maintain, and view a collection of resources that share common tags.
	- Manage these tags using the **Tag Editor**.

**Cost and Usage Reports**

- Contains the most comprehensive set of AWS cost and usage data available.
- Lists AWS usage for each service category used by an account and its IAM users in hourly or daily line items.
- Can be integrated with Athena, Redshift or QuickSight.

**Cost Explorer**

- Visualize, understand, and manage your AWS costs and usage over time.
- Create custom reports that analyze cost and usage data.
- Analyze your data at a high level: total costs and usage across all accounts.
- Choose an optimal savings plan.
- Forecast usage up to 12 months based on previous usage.

**AWS Budgets**

- Create a budget and send alarms when costs exceeds the budget.
- 4 Types of Budgets: Usage, Cost, Reservation, Savings Plans.
- For Reserved Instances (RI) you can track utilization and they support EC2, ElastiCache, RDS, Redshift.
- Up to 5 SNS notifications per budget.
- 2 budgets are free, then $0.02/day/budget.

### AWS Cost Anomaly Detection

- Continuously monitor your cost and usage using ML to detect unusual spends.
- It learns your unique, historic spend patterns to detect one-time cost spikes and continuous cost increases.
- Monitor AWS services, member accounts, cost allocation tags, or cost categories.
- Sends you the anomaly detection report with root-cause analysis.
- Get notified with individual alerts or daily/weekly summary (using SNS).

### AWS Service Quotas

- Notify you when you're close to service quota value threshold.
- Create CloudWatch alarms on the Service Quotas console.
- Request a quota increase from AWS Service Quotas or shutdown resources before limit is reached.

### Trusted Advisor

- High level AWS account assessment.
- Analyze your AWS accounts and provides recommendations on 6 categories:
	- Cost optimizations.
	- Performance.
	- Security.
	- Fault tolerance.
	- Service limits.
	- Operational Excellence.
- Business & Enterprise Support plan.

### Support Plans

**Basic Support Plan**

- _Customer Service & Communities_: 24x7 access to customer service, docs, whitepapers, and support forums.
- _AWS Trusted Advisor_: Access to the 7 core Trusted Advisor checks and guidance to provision your resources following best practices to increase performance and improve security.
- _AWS Personal Health Dashboard_: A personalized view of the health of AWS services, and alerts when your resources are impacted.

**Developer Support Plan**

- All Basic Support Plan +
- Business hours email access to Cloud Support Associates.
- Case severity / response times:
	- General guidance: < 24 business hours.
	- System impaired: < 12 business hours.

**Business Support Plan**

- Intended to be used if you have production workloads.
- Trusted Advisor: Full set of checks + API access.
- 24/7 phone, email, and chat access to Cloud Support Engineers.
- Unlimited cases / unlimited contacts
- Access to Infrastructure Event Management for additional fee.
- Case Severity / response times:
	- General guidance: < 24 business hours.
	- System impaired: < 12 business hours.
	- Production system impaired: < 4 hours.
	- Production system down: < 1 hour.

**Enterprise On-Ramp Support Plan**

- Intended to be used if you have production or business critical workloads.
- All of Business Support Plan +.
- Access tp a pool of Technical Account Managers (TAM).
- Concierge Support Team (for billing and account best practices.)
- Infrastructure Event Management, Well-Architected & Operations Reviews.
- Case Severity / response times:
	- Same as above +.
	- Business-critical system down: < 30 minutes.

**Enterprise Support Plan**

- Intended to be used if you have mission critical workloads.
- All of Business Support Plan +.
- Access to designated Technical Account Manager (TAM).
- Concierge Support Team.
- Infrastructure Event Management, Well-Architected & Operations Reviews.
- Case severity / response times:
	- Same as above, except.
	- Business-critical system down: < 15 minutes.

### Account Best Practices Summary

- Operate multiple accounts using **Organizations**.
- Use **SCP** (service control policies) to restrict account power.
- Easily setup multiple accounts with best-practices with **AWS Control Tower**.
- Use **Tags & Cost Allocation Tags** for easy management & billing.
- **IAM guidelines**: MFA, least-privilege, password policy, password rotation.
- **Config** to record all resources configurations & compliance over time.
- **CloudFormation** to deploy stacks across accounts and regions.
- **Trusted Advisor** to get insights, Support Plan adapted to your needs.
- Send Service Logs and Access Logs to **S3 or CloudWatch Logs**.
- **CloudTrail** to record API calls made within your account.
- **If your Account is compromised**: change the root password, delete and rotate all passwords / keys, contact the AWS support.
- Allow users to create pre-defined stacks defined by admins using **AWS Service Catalog**.

### Billing and Costing Tools Summary

- **Compute Optimizer**: recommends resources' configurations to reduce cost.
- **Pricing Calculator**: cost of services on AWS.
- **Billing Dashboard**: high level overview - free tier dashboard.
- **Cost Allocation Tags**: tag resources to create detailed reports.
- **Cost and Usage Reports**: most comprehensive billing dataset.
- **Cost Explorer**: View current usage (detailed) and forecast usage.
- **Billing Alarms**: in us-east-1 - track overall and per-service billing.
- **Budgets**: more advanced - track usage, costs, RI, and get alerts.
- **Savings Plans**: easy way to save based on long-term usage of AWS.
- **Cost Anomaly Detection**: detect unusual spends using Machine Learning.
- **Service Quotas**: notify you when you’re close to service quota threshold.

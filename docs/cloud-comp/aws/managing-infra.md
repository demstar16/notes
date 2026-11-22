# Managing Infrastructure

### CloudFormation

- Is a declarative way of outlining your AWS infrastructure.
- For example you can say; "I want a security group, 2 EC2 instances using this security group, a S3 bucket, and a ELB in front of these machines."
- CloudFormation will then create these for you in the **right order** with the **exact configuration** that you specify.
- **Benefits**:
	- Infrastructure as code (resources aren't manually created, which is good for control).
	- Cost:
		- Easy to see how much a stack costs you as its tagged with an identifier
		- You can estimate costs of resources using CloudFormation template.
		- **Savings strategy**: In development you could automate deletion of templates at 5PM and recreate at 8AM safely.
	- Productivity: destroy and re-create infrastructure with ease on the go.
	- Don't re-invent the wheel: leverage existing templates on the web.
	- Supports just about all AWS resources.
- **CloudFormation Stack Designer** allows us to see all our resources and the relations between components.

### AWS Cloud Development Kit (CDK)

- Allows us to define our cloud infrastructure in a familiar language (JavaScript, Python, Java, .NET).
- This code is then compiled into a CloudFormation Template (JSON/YAML).
- This allows is to deploy infrastructure and application runtime code together.

### AWS Elastic Beanstalk

- Is a developer centric view of deploying an application on AWS.
- Beanstalk is a PaaS and is free but you pay for the underlying instances.
- Managed Service:
	- Instance configuration / OS handled by Beanstalk.
	- Deployment strategy is configurable but performed by Elastic Beanstalk.
	- Capacity provisioning.
	- Load balancing & auto-scaling.
	- Application health-monitoring & responsiveness.
- Only the **application code is the responsibility of the developer.**
- 3 Architecture models:
	- Single instance deployment: good for development.
	- LB + ASG: good for production or pre-production web apps.
	- ASG only: great for non-web apps in production (ie. workers).
- **Health Monitoring**
	- Health Agent pushes metrics to CloudWatch.
	- Checks for app health, publishes health events.

### AWS CodeDeploy

- Good for when we want to deploy our application automatically.
- Is a Hybrid service.
- Works with EC2 Instances and On-Premises Servers.
- Servers / Instances must be configured ahead of time with the CodeDeploy Agent.

### AWS CodeCommit

- We need to store the code somewhere before publishing it to servers.
- Similar to GitHub but for AWS.
- Source-control service to host git-based repos.
- **Benefits**
	- Fully managed.
	- Scalable & highly available.
	- Private, Secured, Integrated with AWS.

### AWS CodeBuild

- Code building service in the cloud.
- Compiles source code, run tests, and produces packages that are ready to be deployed.
- Think of it as the middle man, it gets the code from CodeCommit, builds it and gets it ready for CodeDeploy.
- **Benefits**:
	- Fully managed and serverless.
	- Continuously scalable & highly available.
	- Secure.
	- Pay as you go pricing.

### AWS CodePipeline

- Orchestrate the different steps to have the code automatically pushed to production.
- Code -> Build -> Test -> Provision -> Deploy
- Basis for Continuous Integration & Continuous Delivery.
- **Benefits**
	- Fully managed.
	- Compatible with CodeCommit, CodeBuild, CodeDeploy, Elastic Beanstalk, CloudFormation, 3rd-party services (GitHub), custom plugins...
	- Fast delivery & rapid updates.

### AWS CodeArtifact

- Storing and Retrieving dependencies is called **artifact management**.
- CodeArtifact is a secure, scalable, and cost-effective way to manage artifacts for software development.
- Works with common dependency management tools like Maven, Gradle, npm, yarn, pip, etc.
- Developers and CodeBuild can then retrieve dependencies straight from CodeArtifact.

### AWS CodeStar

- Unified UI to easily manage software development activities in one place.
- Is a nice way to make sure you are getting started correctly when setting up all your development services.
- Can edit the code "in the cloud" using **AWS Cloud9**.

### AWS Cloud9

- Is a cloud IDE for writing, running and debugging code.
- Cloud9 also allows for code collaboration in real time (pair programming).

### AWS Systems Manager (SSM)

- Helps you manage your EC2 and On-Premises systems at scale.
- A hybrid AWS service.
- Get operational insights about the state of your infrastructure.
- **Most import features**:
	- Patching automation for enhanced compliance.
	- Run commands across entire fleet of servers.
	- Store parameter configuration with SSM Parameter Store.
- Works for Linux, Windows, MacOS, Raspbian.

**How Does a Systems Manager Work?**

- You need to install the System Manager (SSM) agent onto the systems we control.
- Installed by default on Amazon Linux AMI & some Ubuntu AMI.
- If an instance can't be controlled with SSM, it's probably an issue with the SSM agent.
- Thanks to the SSM agent we can run commands, patch & configure our servers.

**SSM Session Manager**

- Allows you to start a secure shell on your EC2 and on-premises servers.
- No SSH access, bastion hosts, or SSH keys needed.
- No port 22 needed (better security).
- Supports Linux, macOS, and Windows.
- Send session log data to S3 or CloudWatch Logs.
- We want to give our instance a role with `AmazonSSMManagedInstanceCore` permissions.

**Systems Manager Parameter Store**

- Secure storage for configuration and secrets.
- API keys, passwords, configurations...
- Serverless, scalable, durable, easy SDK.
- Control access permissions using IAM.
- Version tracking & encryption.

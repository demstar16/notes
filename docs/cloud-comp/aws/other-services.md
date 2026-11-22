# Other Services

### Docker

- Software development platform to deploy apps.
- Apps are packaged in containers that can be run on any OS.
- Big benefit is apps run the same regardless of where they are run.
	- Any machine.
	- No compatibility issues.
	- Predictable behavior.
	- Less work.
	- Easier to maintain and deploy.
	- Works with any language, any OS, any technology.
- Scale containers up and down very quickly.
- Docker images are stored in Docker repositories.
	- Public: Docker Hub.
	- Private: Amazon ECR.
- In Docker resources are shared with the host, meaning many containers on one server.

### ECS

- Elastic Container Service.
- Allows us to launch docker containers on AWS.
- You must provision and maintain the infrastructure (the EC2 instances).
- AWS takes care of starting / stopping containers.
- Has integrations with the Application Load Balancer.

### Fargate

- Also allows us to launch docker containers on AWS.
- You don't provision the infrastructure (no EC2s to manage.)
- Serverless offering.
- AWS just runs containers for you based on the CPU / RAM you need.

### ECR

- Elastic Container Registry.
- Private docker registry on AWS.
- This is where you store your **Docker Images** so they can be run on Fargate.

### Serverless

- Serverless is a new paradigm in which the developers don't have to manage servers anymore.
- They just deploy code.
- Serverless was pioneered by AWS Lambda but now also includes anything that's managed.
- Serverless does not mean there are no servers! It just means you don't manage / provision / see them.
- As examples of what is serverless: Amazon S3, DynamoDB, Fargate, Lambda.

### Lambda

- Virtual Functions - no servers to manage.
- Limited by time - short executions.
- Run on-demand.
- Scaling is automated.
- Benefits:
	- [Easy pricing](https://aws.amazon.com/lambda/pricing/): pay per request and compute time.
	- Integrated with the whole AWS suite of services.
	- Event-driven: functions get invoked by AWS when needed.
	- Integrated with many programming languages.
	- Easy monitoring through AWS CloudWatch.
	- Easy to get more resources per functions.
	- Increasing RAM will also improve CPU and network.
- Lambda supports: Node.js, Python, Java, C#, Golang, Ruby, Custom Runtime API
- Lambda Container Image:
	- The image must implement the Lambda Runtime API.
	- ECS / Fargate is preferred for running arbitrary Docker images.

### API Gateway

- Fully managed service for developers to easily create, publish, maintain, monitor, and secure APIs.
- Serverless and scalable.
- Supports RESTful APIs and WebSocket APIs.
- Support for security, user authentication, API throttling, API keys.

### Batch

- Fully managed batch processing at any scale.
- Efficiently run 100,000s of computing batch jobs on AWS.
- A batch job is a job with a start and an end.
- Batch will dynamically launch EC2 instances or Spot instances.
- AWS batch provisions the right amount of compute / memory.
- You submit or schedule batch jobs and AWS batch does the rest.
- Batch jobs are defined as docker images and run on ECS.
- Helpful for cost optimisations and focusing less on the infrastructure.

### Batch vs Lambda

Lambda:

- Time Limit.
- Limited runtimes.
- Limited temporary disk space.
- Serverless.

Batch:

- No time limit.
- Any runtime as long as it's packaged as a docker image.
- Rely on EBS / instance store for disk space.
- Relies on EC2 (can be managed by AWS).

### Lightsail

- Virtual servers, storage, databases, and networking.
- Low and predictable pricing.
- Simpler alternative to using EC2, RDS, ELB, EBS, or Route 53.
- Great for people with little cloud experience.
- Can setup notifications and monitoring of your lightsail resources.
- Use cases:
	- Simple web apps.
	- Websites.
	- Dev / Test environment.
- Has high availability but no auto-scaling, limited AWS integrations.

### Summary

- **Docker**: container technology to run applications
- **ECS**: run Docker containers on EC2 instances
- **Fargate**:
	- Run Docker containers without provisioning the infrastructure
	- Serverless offering (no EC2 instances)
- **ECR**: Private Docker Images Repository
- **Batch**: run batch jobs on AWS across managed EC2 instances
- **Lightsail**: predictable & low pricing for simple application & DB stacks
- **Lambda**:
	- Serverless, Function as a Service, seamless scaling, reactive
	- **Billing**:
		- By the time run x by the RAM provisioned
		- By the number of invocations
	- **Language Support**: many programming languages except (arbitrary) Docker
	- **Invocation time**: up to 15 minutes
	- **Use cases**:
		- Create Thumbnails for images uploaded onto S3
		- Run a Serverless cron job
- **API Gateway**: expose Lambda functions as HTTP

### Amazon Workspaces

- Managed Desktop as a Service (DaaS) solution to easily provision Windows or Linux desktops.
- Great to eliminate management of on-premise VDI (Virtual Desktop Infrastructure).
- Fast and quickly scalable to thousands of users.
- Secured data - integrates with Key Management System (KMS).
- Pay-as-you-go service with monthly or hourly rates.

### Amazon AppStream 2.0

- Desktop Application Streaming Service.
- Deliver to any computer, without acquiring, provisioning infrastructure.
- The application is delivered from within a web browser.

**Differences between Workspaces and AppStream 2.0**
Workspaces:

- Fully managed VDI and desktop available.
- The users connect to the VDI and open native or WAM applications.
- Workspaces are on-demand or always on.

AppStream 2.0:

- Stream a desktop application to web browsers (no need to connect to a VDI).
- Works with any device (that has a web browser).
- Allow to configure an instance type per application type (CPU, RAM, GPU).

### AWS IoT Core

- IoT: Internet of Things, the network of internet-connected devices that are able to collect and transfer data.
- This service allows you to easily connect IoT devices to the AWS Cloud.
- It's serverless, secure & scalable to billions of devices and trillions of messages.
- Your apps can communicate with your devices even when they aren't connected.
- Integrates with a lot of AWS services.
- Build IoT applications that gather, process, analyze, and act on data.

### AWS AppSync

- Store and sync data across mobile and web apps in real-time.
- Makes use of GraphQL.
- Client Code can be generated automatically.
- Integrations with DynamoDB / Lambda.
- Real-time subscriptions.
- Offline data synchronization.
- Fine grained security.
- AWS Amplify can leverage AWS AppSync in the background.

### AWS Amplify

- A set of tools and services that helps you develop and deploy scalable full stack web and mobile applications.
- Authentication, Storage, API (REST, GraphQL), CI/CD, PubSub, Analytics, AI/ML Predictions, GitHub, etc.

### AWS Application Composer

- Visually design and build serverless applications quickly on AWS.
- Deploy AWS infrastructure code without needing to be an expert in AWS.
- Configure how your resources interact with each other.
- Generates Infrastructure as Code (IaC) using CloudFormation.
- Ability to import existing CloudFormation / SAM templates to visualize them.

### AWS Device Farm

- Fully-managed service that tests your web and mobile apps against desktop browsers, real mobile devices, and tablets.
- Run tests concurrently on multiple devices (speed up execution).
- Ability to configure device settings (GPS, language, Wi-Fi, Bluetooth, ...)

### AWS Backup

- Fully-managed service to centrally manage and automate backups across AWS services.
- On-demand and scheduled backups.
- Supports PITR (Point-in-time Recovery).
- Retention Periods, Lifecycle Management, Backup Policies, etc.
- Capable of Cross-Region and Cross-Account (uses AWS Organizations) Backups.
- Automatically backed up to Amazon S3.

### Disaster Recovery Strategies

- Backup and Restore: low-cost.
	- Restore from an S3 bucket which holds the data.
- Pilot Light: moderately low-lost.
	- Restore an EC2 instance which just has the core functions of the app and is ready to scale.
- Warm Standby: moderate cost.
	- Restore the full version of the app but at minimum size.
- Multi-Site / Hot-Site: high cost.
	- Restore the full version of the app at full size.

### AWS Elastic Disaster Recovery (DRS)

- Used to be called "CloudEndure Disaster Recovery.
- Quickly and easily recover your physical, virtual, and cloud-based servers into AWS.
- Continuous block-level replication for your servers.

### AWS DataSync

- Move large amounts of data from on-premises to AWS.
- Can synchronize to: Amazon S3, Amazon EFS, Amazon FSx.
- Replication tasks can be scheduled hourly, daily, weekly.
- The replication tasks are incremental after the first full load.

### AWS Application Discovery Service

- Plan migration projects by gathering information about on-premises data centers.
- Server utilization data and dependency mapping are important for migrations.
- Agentless Discovery (AWS Agentless Discovery Connector): VM inventory, configuration, and performance history such as CPU, memory, and disk usage.
- Agent-based Discovery (AWS Application Discovery Agent): System config, system performance, running processes, and details of the network connections between systems.
- The resulting data can be viewed within AWS Migration Hub.

### AWS Application Migration Service (MGN)

- Lift-and-shift (rehost) solution which simplify migrating applications to AWS.
- Converts your physical, virtual, and cloud-based servers to run natively on AWS.
- Supports wide range of platforms, OSs, and databases.
- Minimal downtime, reduced costs.

### AWS Migration Evaluator

- Helps you build a data-driven business case for migration to AWS.
- Provides a clear baseline of what your organization is running today.
- Install Agentless Collector to conduct broad-based discovery.
- Take a snapshot of on-premises foot-print, server dependencies.
- Analyze current state, define target state, then develop migration plan.

### AWS Migration Hub

- Central location to collect servers and apps inventory data for the assessment, planning, and tracking of migrations to AWS.
- Helps accelerate your migration to AWS, automate lift-and-shift.
- **AWS Migration Hub Orchestrator** provides pre-built templates to save time and effort migrating enterprise apps.
- Supports migrations status updates from **Application Migration Service** and **Database Migration Service**.

### AWS Fault Injection Simulator (FIS)

- A fully managed service for running fault injection experiments on AWS workloads.
- Based on Chaos Engineering: stressing a application by creating disruptive events, observing how the system responds, and implementing improvements.
- Helps you uncover hidden bugs and performance bottlenecks.
- Supports: EC2, ECS, EKS, RDS...
- Use pre-built templates that generate the desired disruptions.

### AWS Step Functions

- Build serverless visual workflow to orchestrate your Lambda functions.
- Features: sequence, parallel, conditions, timeouts, error handling,...
- Can integrate with EC2, ECS, On-premises servers, API Gateways, SQS queues, etc...
- Possibility of implementing human approval feature.
- **Use Cases:** order fulfillment, data processing, web applications, any workflow.

### AWS Ground Station

- Fully managed service that lets you control satellite communications, process data, and scale your satellite operations.
- Provides a global network of satellite ground stations near AWS regions.
- Allows you to download satellite data to your AWS VPC within seconds.
- Send satellite data to S3 or EC2 instance.
- **Use Cases:** weather forecasting, surface imaging, communications, video broadcasts.

### Amazon Pinpoint

- Scalable 2-way (outbound/inbound) marketing communications service.
- Ability to segment and personalize messages with the right content to customers.
- Possibility to revive replies.
- Scales to billions of messages per day.
- **Use Cases**: run campaigns by sending marketing, bulk, transactional SMS messages.

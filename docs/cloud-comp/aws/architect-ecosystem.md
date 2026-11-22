# Architecting & Ecosystem

**Well Architected Framework General Guiding Principles**

- Stop guessing your capacity needs.
- Test systems at production scale.
- Automate to make architectural experimentation easier.
- Allow for evolutionary architectures: design based on changing requirements.
- Drive architectures using data.
- Improve through game days: simulate apps for flash sale days.

**AWS Cloud Best Practices - Design Principles**

- **Scalability**: vertically and horizontally.
- **Disposable Resources**: servers should be disposable & easily configured.
- **Automation**: Serverless, Infrastructure as a Service, Auto Scaling.
- **Loose Coupling**:
	- Monolith are applications that do more and more over time and become bigger.
	- Break it down into smaller, loosely coupled components.
	- A change or a failure in one component should not cascade to other components.
- **Services, not Servers**: Don't just use EC2, use managed services, databases, serverless, etc.

### Well Architected Framework 6 Pillars

- They are not something to balance, or trade-offs, they're a synergy.

1. Operational Excellence.

- Includes the ability to run and monitor systems to deliver business value and to continually improve supporting processes and procedures.
- Design Principles:
	- Perform operations as code.
	- Annotate documentation.
	- Make frequent, small, reversible changes.
	- Refine operations and procedures frequently.
	- Anticipate failure.
	- Learn from all operational failures.
- Services to achieve this:
	- **Prepare**: AWS CloudFormation, AWS Config.
	- **Operate**: AWS CloudFormation, AWS Config, AWS CloudTrail, Amazon CloudWatch, AWS X-Ray.
	- **Evolve**: AWS CloudFormation, AWS CodeBuild, AWS CodeCommit, AWS CodeDeploy, AWS CodePipeline.

2. Security.

- Being able to deliver whilst protecting your information, systems and assets.
- Design Principles:
	- Implement a strong identity foundation.
	- Enable traceability.
	- Apply security at all layers.
	- Automate security best practices.
	- Protect data in transit and at rest.
	- Keep people away from data.
	- Prepare for security events.
	- Shared responsibility model.
- Services too achieve this:
	- **Identity and Access Management**: IAM, AWS-STS, MFA Token, AWS Organizations.
	- **Detective Controls**: AWS Config, AWS CloudTrail, Amazon CloudWatch.
	- **Infrastructure Protection**: Amazon CloudFront, Amazon VPC, AWS Shield, AWS WAF, Amazon Inspector.
	- **Data Protection**: KMS, S3, Elastic Load Balancing, Amazon EBS, Amazon RDS.
	- **Incident Response**: IAM, AWS CloudFormation, Amazon CloudWatch Events.

3. Reliability.

- Ability of a system to recover from infrastructure or service disruptions, dynamically acquire computing resources to meet demand, and mitigate disruptions such as misconfigurations or transient network issues.
- Design Principles:
	- Test recovery procedures.
	- Automatically recover from failure.
	- Scale horizontally to increase aggregate system availability.
	- Stop guessing capacity.
	- Manage change in automation.
- Services to achieve this:
	- **Foundations**: IAM, Amazon VPC, Services Quotas, AWS Trusted Advisor.
	- **Change Management**: AWS Auto Scaling, Amazon CloudWatch, AWS CloudTrail, AWS Config.
	- **Failure Management**: Backups, AWS CloudFormation, Amazon S3, Amazon S3 Glacier, Amazon Route53.

4. Performance Efficiency.

- The ability to use computing resources efficiently to meet system requirements, and to maintain that efficiency as demand changes and technologies evolve.
- Design Principles:
	- Democratize advanced technologies.
	- Go global in minutes.
	- Use serverless architectures.
	- Experiment more often.
	- Mechanical sympathy.
- Services to achieve this:
	- **Selection**: AWS Auto Scaling, AWS Lambda, Amazon Elastic Block Store, Amazon Simple Storage Service, Amazon RDS.
	- **Review**: AWS CloudFormation, AWS News blog.
	- **Monitoring**: Amazon CloudWatch, AWS Lambda.
	- **Tradeoffs**: Amazon RDS, Amazon ElastiCache, AWS Snowball, Amazon CloudFront.

5. Cost Optimization.

- Ability to run systems to deliver business value at the lowest price points.
- Design Principles:
	- Adopt a consumption mode.
	- Measure overall efficiency.
	- Stop spending money on data center operations.
	- Analyze and attribute expenditure.
	- Use managed and application level services to reduce cost of ownership.
- Services to achieve this:
	- **Expenditure Awareness**: AWS Budgets, AWS Cost and Usage Report, AWS Cost Explorer, Reserved Instance Reporting.
	- **Cost-Effective Resources**: Spot instance, Reserved instance, Amazon S3 Glacier.
	- **Matching supply and demand**: AWS Auto Scaling, AWS Lambda.
	- **Optimizing Over Time**: AWS Trusted Advisor, AWS Cost and Usage Report.

6. Sustainability.

- Focuses on minimizing the environmental impacts of running cloud workloads.
- Design Principles:
	- Understand your impact.
	- Establish sustainability goals.
	- Maximize utilization.
	- Anticipate and adopt new, more efficient hardware and software offerings.
	- Use managed services.
	- Reduce the downstream impact of your cloud workloads.
- Services to achieve this:
	- EC2 Auto Scaling, Serverless Offerings (Lambda, Fargate).
	- Cost Explorer, AWS Graviton 2, EC2 T instances, Spot instances.
	- EFS-IA, Amazon S3 Glacier, EBS Cold HDD volumes.
	- S3 Lifecycle Configurations, S3 Intelligent Tiering.
	- Amazon Data Lifecycle Manager.
	- Read Local, Write Global: RDS Read Replicas, Aurora Global DB, DynamoDB Global Table, CloudFront.

### AWS Well-Architected Tool

- A free tool to review your architecture against the 6 pillars above.
- You just select your workload and answer questions, then review your answers against the 6 pillars.

### AWS Cloud Adoption Framework

- Helps you build and execute a comprehensive plan for your digital transformation through the use of AWS.
- AWS CAF identifies specific organizational capabilities that underpin successful cloud transformations.
- AWS CAF groups its capabilities in six perspectives: **Business, People, Governance, Platform, Security, and Operations.**

**Perspective Breakdown:**

- _Business Perspective_ helps ensure that your cloud investments accelerate your digital transformation ambitions and business outcomes.
- _People Perspective_ serves as a bridge between technology and business, accelerating the cloud journey to help organizations more rapidly evolve to a culture of continuous growth, learning, and where change becomes business-as-normal, with focus on culture, organizational structure, leadership, and workforce.
- _Governance Perspective_ helps you orchestrate your cloud initiatives while maximizing organizational benefits and minimizing transformation related risks.
- _Platform Perspective_ helps you build an enterprise-grade, scalable, hybrid cloud platform; modernize existing workloads; and implement new cloud-native solutions.
- _Security Perspective_ helps you achieve the confidentiality, integrity, and availability of your data and cloud workloads.
- _Operations Perspective_ helps ensure that your cloud services are delivered at a level that meets the needs of your business.

**Transformation Domains**

- **Technology**: using the cloud to migrate and modernize legacy infrastructure, apps, data and analytic platforms.
- **Process**: digitizing, automating, and optimizing your business operations.
- **Organization**: re-imagining your operating model. Organizing your teams around products and value streams. Leveraging agile methods to rapidly iterate and evolve.
- **Product**: re-imagining your business model by creating new value propositions and revenue models.
- **Envision**: demonstrate how the cloud will accelerate business outcomes by identifying transformation opportunities and create a foundation gor your digital transformation.
- **Align**: identify capability gaps across the 6 AWS CAF perspectives which results in an action plan.
- **Launch**: build and deliver pilot initiatives in production and demonstrate incremental business value.
- **Scale**: expand pilot initiatives to the desired scale while realizing the desired business benefits.

### AWS Right Sizing

- Refers to the process of matching instance types and sizes to your workload performance and capacity requirements at the lowest possible cost.
- Scaling up is easy but always start small.
- It's important to right size before a cloud migration and continuously after the cloud onboarding process.

### AWS Ecosystem - Resources

- [AWS Blogs](https://aws.amazon.com/blogs/aws/)
- [AWS Forums](https://forums.aws.amazon.com/index.jspa)
- [AWS Whitepapers & Guides](https://aws.amazon.com/whitepapers)
- [AWS Partner Solutions](https://aws.amazon.com/quickstart/)
- [AWS Solutions](https://aws.amazon.com/solutions/)

### AWS IQ

- Quickly find professional help for your AWS projects.
- Engage and pay AWS Certified 3rd party experts for on-demand project work.

### AWS Managed Services (AMS)

- Provides infrastructure and application support on AWS.
- AMS offers a team of AWS experts who manage and operate your infrastructure for security, reliability, and availability.
- Helps organizations offload routine management tasks and focus on their business objectives.
- Fully managed service.
- Implements best practices and maintains your AWS infrastructure to reduce your operational overhead and risk.
- AMS business hours are 24/365.

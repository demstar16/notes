# Cloud Monitoring

### Amazon CloudWatch Metrics

- CloudWatch provides metrics for every service in AWS.
- Metric is a variable to monitor and they have timestamps.
- Can create CloudWatch dashboards of metrics.
- **Important Metrics**:
	- EC2 Instances: CPU utilization, status checks, network
		- Default metrics every 5 minutes.
		- Option for detailed monitoring ($$$): metrics every 1 minute.
	- EBS Volumes: Disk read/writes.
	- S3 buckets: BucketSizeBytes, NumberOfObjects, AllRequests.
	- Billing: Total Estimated Charge (only in us-east-1).
	- Service Limits: how much you've been using a service API.
	- Custom metrics: push your own metrics.

### Amazon CloudWatch Alarms

- Used to trigger notifications.
- Alarms actions:
	- Auto scaling increase or decrease EC2 instances desired count.
	- EC2 Actions: stop, terminate, reboot, or recover an EC2 instance.
	- SNS Notifications: send a notification into an SNS topic.
- Can choose the period on which to evaluate the alarm.
- **Alarm States**: OK, INSUFFICIENT_FUNDS, ALARM

### Amazon CloudWatch Logs

- Can collect logs from:
	- Elastic Beanstalk: from application.
	- ECS: from containers.
	- AWS Lambda: function logs.
	- CloudTrail based on filter.
	- CloudWatch log agents: on EC2 machines or on-premises servers.
	- Route53: Log DNS queries.
- Enables real-time monitoring of logs.
- Adjustable CloudWatch Logs retention.
- Example: To do logs for EC2.
	- By default no logs from your instance will go to CloudWatch.
	- You need to run a CloudWatch agent on EC2 to push the log files you want.
	- Make sure IAM permissions are correct.
	- The CloudWatch log agent can be setup on-premises too.

### Amazon EventBridge

- Schedule: Cron jobs (scheduled scripts).
- Event pattern: Event rules to react to a service doing something.
	- Schedule a script to run on a lambda function every hour.
- Trigger lambda functions, send SQS/SNS messages.
	- IAM root user sign in event triggers an email notification.
- Schema Registry: model event schema.
- You can archive events sent to an event bus (indefinitely or set period).

### AWS CloudTrail

- Provides governance, compliance and audit for your AWS Account.
- It's enabled by default.
- Get a history of events / API calls made with your AWS Account by: Console, SDK, CLI, AWS Services.
- Can put logs from CloudTrail into CloudWatch or S3.
- A trail can be applied to All Regions or a single region.
- If a resource is deleted in AWS, investigate CloudTrail first!

### AWS X-Ray

- Debugging in production:
	- Test locally.
	- Add log statements everywhere.
	- Re-deploy in production.
- Log formats differ across applications and log analysis is hard.
- Debugging distributed services can be difficult.
- **Advantages**
	- Troubleshooting performance (bottlenecks).
	- Understand dependencies in a microservice architecture.
	- Pinpoint service issues.
	- Review request behavior.
	- Find errors and exceptions.
	- Are we meeting time SLA?
	- Where am I throttled?
	- What users are impacted?

### Amazon CodeGuru

- An ML-powered service for automated code reviews and application performance recommendations.
- Provides two functionalities:
	- CodeGuru Reviewer: automated code reviews for static code analysis. (development)
	- CodeGuru Profiler: visibility/recommendations about application performance during runtime. (production)
- **CodeGuru Reviewer**
	- Identify critical issues, security vulnerabilities, and hard-to-find bugs.
	- Some examples: resource leaks, security detection, input validation.
	- Uses machine learning and automated reasoning.
	- Hard-learned lessons across millions of code reviews on 1000s of open-source and Amazon repos.
	- Supports Java and Python.
	- Integrates with GitHub, BitBucket and AWS CodeCommit.
- **CodeGuru Profiler**
	- Helps understand the runtime behavior of your application.
	- Example: Identify if your app is consuming excessive CPU capacity on a logging routine.
	- Features:
		- Identify and remove code inefficiencies.
		- Improve application performance.
		- Decrease computes costs.
		- Provide heap summary (identify which objects are using up memory).
		- Anomaly detection.
	- Supports applications running on AWS or-premise.
	- Minimal overhead on application.

### AWS Health Dashboard

- Shows all regions, all services health.
- Shows historical information for each day.
- Has an RSS feed you can subscribe to.
- Provides alerts and remediation guidance when AWS is experiencing events that may impact you.
- It's a personalized view into the performance and availability of the AWS services underlying your AWS resources.
- It displays relevant and timely information to help you manage events in progress and provides proactive notifications to help you plan for scheduled activities.
- Can aggregate data from an entire AWS organization.
- It's a global service.

### Summary

- **CloudWatch**:
	- Metrics: monitor the performance of AWS services and billing metrics
	- Alarms: automate notification, perform EC2 action, notify to SNS based on metric
	- Logs: collect log files from EC2 instances, servers, Lambda functions…
	- Events (or EventBridge): react to events in AWS, or trigger a rule on a schedule
- **CloudTrail**: audit API calls made within your AWS account
- **CloudTrail Insights**: automated analysis of your CloudTrail Events
- **X-Ray**: trace requests made through your distributed applications
- **AWS Health Dashboard**: status of all AWS services across all regions
- **AWS Account Health Dashboard**: AWS events that impact your infrastructure
- Amazon CodeGuru: automated code reviews and application performance
	recommendations

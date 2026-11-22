# EC2

### What Is It?

- Infrastructure as a Service (IaaS).
- A good grasp on EC2 is essential in understanding how the Cloud works.
- It consists in the capability of:
	- Renting VMs (EC2).
	- Storing data on virtual drives (EBS), see [Storage](./storage).
	- Distributing load across machines (ELB).
	- Scaling the services using an auto-scaling group (ASG).

### Sizing and Config Options

- Operating System: Linux, Windows or MacOS.
- How much compute power and cores (CPU).
- How much random-access memory (RAM).
- How much storage space:
	- Network-attached (EBS & EFS).
	- Hardware (EC2 instance store).
- Network card: speed of the card, public IP address.
- Firewall rules: security group.
- Bootstrap script (configure at first launch): EC2 User Data.

### User Data

- When creating an EC2 instance this field is located at the bottom of advanced settings, this is where you put your script.
- We can bootstrap our instances using an EC2 User data script.
- Bootstrapping means launching commands when a machine starts.
- That script is only run once at the instance first start.
- EC2 user data is used to automate boot tasks such as:
	- Installing updates and software.
	- Downloading common files from the internet.
	- Basically anything you can think of.
- The EC2 user data script runs with the root user.

### Instances

- Create an instance will allow us to host applications on it.
- This is us creating our infrastructure.
- When creating an instance we go through the [config options](#sizing-and-config-options) and set it up accordingly.
- When not using an instance we can change its state to stopped, this will avoid us incurring costs when not using it.
- Different Types of instances are optimised for different use cases.
	- AWS has the following naming convention (`m5.2xlarge`):
		- `m`: instance class.
		- `5`: generation (AWS improves them over time).
		- `2xlarge`: size within the instance class.
	- [Instance Types](https://aws.amazon.com/ec2/instance-types/) & [Another Handy Reference](https://instances.vantage.sh/)
		- General Purpose: great for diversity of workloads such as code repos or web servers and good for balance between computing power, memory and networking.
		- Computer Optimised: great for compute-intensive tasks that require high performance processors (media transcoding, machine learning, batch processing, etc.)
		- Memory Optimised: fast performance for workloads that process large data sets in memory. (distributed web scale cache stores, In-memory databases optimised for business intelligence)
		- Storage Optimised: great for storage-intensive tasks that require high, sequential read and write access to large data sets on local storage. (data warehousing applications, distributed file systems, relational & NoSQL databases, etc.)

### Security Groups

- Security groups are the fundamental of network security in AWS.
- They control how traffic is allowed into or out of EC2 Instances.
- Security Groups can only contain **allow** rules.
- Security group rules can reference by IP or by security group.
- They are a firewall on EC2 instances.
- They regulate:
	- Access to ports.
	- Authorised IP ranges - IPv4 and IPv6.
	- Control of inbound network (from other to the instance).
	- Control of outbound network (from instance to the other).
- **Good to Knows**:
	- Can be attached to multiple instances.
	- Locked down to a region/VPC combination.
	- Live "outside" the EC2 - if traffic is blocked the EC2 instance won't see it.
	- It's good to maintain one separate security group for SSH access.
	- If your application is not accessible (time out), then it's a security group issue.
	- If your app gives a "connection refuse" error, then it's an application error or it's not launched.
	- All inbound traffic is blocked by default.
	- All outbound traffic is authorised by default.

### Classic Ports to Know

- 22 = SSH (Secure Shell) - log into a Linux instance.
- 21 = FTP (File Transfer Protocol) - upload files into a file share.
- 22 = SFTP (Secure File Transfer Protocol) - upload files using SSH.
- 80 = HTTP - access unsecured websites.
- 443 = HTTPS - access secured websites.
- 3389 = RDP (Remote Desktop Protocol) - log into a Windows instance.

### SSH

- To connect run `ssh ec2-user@<IPv4>` in the same directory as your `.pem` file you generated with your key-pair.

### EC2 Instance Connect

- Never enter personal information in the cloud terminal.
- Use IAM Roles.

### SSH Connection Compatibility Summary

- SSH: Mac, Linux, Windows >= 10.
- Putty: Windows.
- EC2 Instance Connect: All.

### EC2 Purchasing Options

- On-Demand Instances - short workload, predictable pricing, pay by second.
- Reserved (1 & 3 years)
	- Reserved Instances - long workloads.
	- Convertible Reserved Instances - long workloads with flexible instances.
- Saving Plans (1 & 3 years) - commitment to an amount of usage, long workload.
- Dedicated Hosts - book an entire physical server, control instance placement.
- Dedicated Instances - no other customers will share your hardware.
- Capacity Reservations - reserve capacity in a specific AZ for any duration.
- **What's right for me?** Hotel Analogy
	- On Demand: coming and staying in a resort whenever we like, we pay the full price.
	- Reserved: like planning ahead and if we plan to stay for a long time, we may get a good discount.
	- Savings Plans: pay a certain amount per hour for certain period and stay in any room type.
	- Spot instances: the hotel allows people to bid for the empty rooms and the highest bidder keeps the rooms. You can get kicked out at any time.
	- Dedicated Hosts: We book an entire building of the resort.
	- Capacity Reservations: you book a room for a period with full price even if you don't stay in it.

### Shared Responsibility Model for EC2

- AWS is responsible for:
	- Infrastructure (global network security).
	- Isolation on physical hosts.
	- Replacing faulty hardware.
	- Compliance validation.
- What are you responsible for:
	- Security group rules.
	- Operating-system patches and updates.
	- IAM Roles assigned to EC2 & IAM user access management.
	- Data security on your instance.

### Amazon Machine Images (AMIs)

- Are a customization of an EC2 instance.
	- You add your own software, config, OS, monitoring, ...
	- Faster boot / config time because all your software is pre-packaged.
- Are built for a specific region (can be copied across regions).
- You can launch EC2 instances from:
	- A public AMI: AWS provided.
	- Your own AMI: you make and maintain them yourself.
	- An AWS marketplace AMI: an AMI made by someone else.

- **AMI Process** from an EC2 Instance:
	- Start an EC2 instance and customize it.
	- Stop the instance (for data integrity).
	- Build an AMI - this will also create EBS snapshots.
	- Launch instances from other AMIs.
- **Creating an AMI**:
	- Right click on instance.
	- Image and template > Create image.
	- Give it a name.
	- Use defaults.
	- Create the image.
	- We can then launch instances from an AMI from the instances tab or the AMI tab.

### EC2 Image Builder

- Used to automate the creation of Virtual Machines or container images.
- Automates the creation, maintain, validate and test EC2 AMIs.
- Can be run on a schedule.
- Free service (only pay for the underlying resources).
- **How it works**:
	- EC2 Image Builder creates a Builder EC2 instance
		- this builds components and customizes software on the instance.
	- This Builder EC2 instance will then create a new AMI.
	- This AMI will then be tested through a test EC2 instance which is where the test suite is run.
	- The AMI is then distributed.

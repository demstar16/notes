# Cloud Computing

### Traditional IT

- **Terminology**:
	- Network: cables, routers and servers connected with each other.
	- Router: A networking device that forwards data packets between computer networks. They know where to send packets on the internet.
	- Switch: Takes a packet and send it to the correct server / client on the network.
- **How Websites Work**:
	- Client uses a network to get access to a server
	- The network routes our requests to the server which can then send back through the server what we want.
	- Both client and server have IP addresses, this is how the network knows how to do direct the traffic.
- **What is in a Server**:
	- CPU: Computations
	- RAM: Memory
	- Storage: Data
	- Database: Structured Storage
	- Network: Routers, switches, DNS server
- **Avoids a lot of traditional issues** that come with a traditional approach of having a data center.
	- Don't need to pay for power, physical security, or people to watch over or provide maintenance.
	- Don't need to worry about disasters like fires or earthquakes that could damage the servers.

### What Is Cloud Computing

- On-demand delivery of computing power, database storage, apps, and other IT resources.
- Pay as you go pricing.
- You can provision exactly the right type and size of computing resources you need.
- You can access as many resources as you need instantly.
- Simple way to access servers, storage, databases and application services

### Deployment Models of the Cloud

**Private Cloud**:

- Cloud services used by a single org, not exposed to public.
- Complete control.
- Security for sensitive apps.
- Meets specific business needs.

**Public Cloud**:

- Cloud resources owned and operated by a third-party over the internet.
- [Six advantages](#six-advantages-of-cloud-computing) of cloud computing.

**Hybrid Cloud**:

- Keep some servers on premises and extend some capabilities to the cloud.
- Control over sensitive assets in your private infrastructure.
- Flexibility and cost-effectiveness of the public cloud.

### Five Characteristics of Cloud Computing

- **On-demand self service**.
	- Can provision resources and use them without interacting with the service provider.
- **Broad Network access**.
	- Resources available over the network, and can be accessed by diverse client platforms.
- **Multi-tenancy and resource pooling**.
	- Multiple customers can share infrastructure and applications with security and privacy.
	- Multiple customers are serviced from the same physical resources.
- **Rapid elasticity and scalability**.
	- Automatically acquire and dispose resources quickly.
	- Easily scalable on demand.
- **Measured service**.
	- Usage is measured, users pay for exactly what they use.

### Six Advantages of Cloud Computing

- **Trade capital expense (CAPEX) for operational expense (OPEX)**
	- Pay On-Demand
	- Reduced total cost of ownership and operational expense.
- **Benefit from massive economies of scale**.
	- Prices are reduced as AWS is more efficient due to large scale.
- **Stop guessing capacity**.
	- Scale is based on actual measured usage.
- **Increase speed and agility**.
- **Stop spending money running and maintaining data centers**
- **Go global in minutes**

### Types of Cloud Computing

- **Infrastructure as a Service (IaaS)**
	- Provide building blocks for cloud IT.
	- Provides networking, computers, data storage space.
	- Highest level of flexibility.
	- Easy parallel with traditional on-premises IT.
	- On AWS this is _Amazon EC2_
- **Platform as a Service (PaaS)**
	- Removes need for the org to manage underlying infrastructure.
	- Focuses on deploying and managing applications
	- On AWS this is _Elastic Beanstalk_
- **Software as a Service (SaaS)**
	- Completed product that is run and managed by the service provider.
	- Many AWS services exist for different applications (example: Rekognition for Machine Learning)

### Pricing of the Cloud

- 3 Pricing Fundamentals:
	- **Computing**: Pay for compute time.
	- **Storage**: Pay for data stored in the cloud.
	- **Data Transfer OUT** of the cloud: Data transfer IN is free!

### AWS Regions Breakdown

- **AWS Regions:**
	- AWS has regions all around the world.
	- Names can be stuff like us-east-1, eu-west-3,...
	- A region is a cluster of data centers.
	- Most AWS services are region scoped.
	- **Factors to help you choose a region**:
		- Compliance with data governance and legal requirements: data never leaves a region without your explicit permission.
		- Proximity to customers: latency.
		- Available services within a region: ner services and features aren't available in every region.
		- Pricing: pricing can vary from region to region.
- **AWS Availability Zones:**
	- Each region has many availability zones (usually 3, min is 3 and max is 6)
	- Region: ap-southeast-2 -> ap-southeast-2a, ap-southeast-2b, ap-southeast-2c.
	- Each availability zone (AZ) is one or more discrete data centers with redundant power, networking, and connectivity.
	- They're separate from each other so they're isolated from disasters.
	- Connected with high bandwidth and ultra low latency between them.
- **AWS Points of Presence:**
	- Content is delivered to end users with lower latency.

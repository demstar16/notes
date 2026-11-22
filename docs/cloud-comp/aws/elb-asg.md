# Load Balancing & Auto Scaling

### Scalability and High Availability

- Scalability means that an application can handle greater loads by adapting.
	- Two Types: Vertical and Horizontal.
		- Vertical means increasing the size of the instance. Common for non-distributed systems.
		- Horizontal means increasing the number of instances / systems for your application. Common for distributed systems.
	- It is linked but different to High Availability.
- High Availability goes hand in hand with horizontal scaling.
	- It means running your app / system in at least 2 Availability Zones.
	- The goal is to survive a data center loss.
- In terms of EC2:
	- Vertical Scaling (scale up / down) from t2.nano (0.5G of RAM, 1 vCPU) to u-12tb1.metal (12.3TB of RAM, 448 vCPUs)
	- Horizontal Scaling (scale out / in):
		- Auto Scaling Group.
		- Load Balancer.
	- High Availability: Run instances for the same application across multi AZ.
		- Auto Scaling Group multi AZ.
		- Load Balancer multi AZ.
- Scalability vs Elasticity vs Agility
	- **Scalability**: ability to accommodate a larger load by making the hardware stronger (scale up), or by adding nodes (scale out).
	- **Elasticity**: once a system is scalable, elasticity means that there will be some "auto-scaling" so that the system can scale based on the load. This is "cloud-friendly": pay per use, match demand, optimise costs.
	- **Agility**: (a distract item, it is not related to scalability or elasticity). new IT resources are only a lick away, which means that you reduce the time to make those resources available to your developers from weeks to just minutes.

### ELB

- Load balancers are servers that forward internet traffic to multiple servers (EC2 Instances) downstream.
- Managed by AWS.
- Why use one?
	- Spread out load across multiple downstream instances.
	- Expose single point of access (DNS) to your application.
	- Seamlessly handle failures of downstream instances.
	- Do regular health checks to your instances.
	- Provide SSL termination (HTTPS) for websites.
	- High availability across zones.
- 4 Types of ELB offered by AWS:
	- Application Load Balancer (HTTPS /HTTP only) - Layer 7.
	- Network Load Balancer (ultra-high performance, allows for TCP) - Layer 4.
	- Gateway Load Balancer - Layer 3.
	- Classic Load Balancer (retired in 2023) - Layer 4 & 7.
- Application Load Balancer (ALB) Keywords:
	- HTTP / HTTPS / gRPC protocols (Layer 7)
	- HTTP routing features.
	- Static DNS (URL).
- Network Load Balancer (NLB) Keywords:
	- TCP / UDP protocols (Layer 4).
	- High performance: millions of requests per second.
	- Static IP through Elastic IP.
- Gateway Load Balancer (GLP) Keywords:
	- GENEVE Protocol IP Packets (Layer 3).
	- Route traffic to firewalls that you manage on EV2 instances.
	- Intrusion detection.

### Auto Scaling Groups (ASG)

- Loading on websites and applications change over time.
- The goal of an ASG is to:
	- Scale out (add EC2 instances) to match an increased load.
	- Scale in (remove EC2 instances) to match a decreased load.
	- Ensure we have a minimum and a maximum number of machines running.
	- Automatically register new instances to a load balancer.
	- Replace unhealthy instances.
- Cost savings: only running at an optimal capacity.
- **Strategies**:
	- **Manual Scaling**: Update the size of an ASG manually.
	- **Dynamic Scaling**: Respond to changing demand
		- _Simple / Step_:
			- When a CloudWatch alarm is triggered (example CPU > 70%), then add 2 units.
			- When a CloudWatch alarm is triggered (example CPU < 30%), then remove 1 unit.
		- _Target Tracking Scaling_:
			- Example: I want the average ASG CPU to stay at around 40%.
		- _Scheduled Scaling_: anticipate the scaling on known usage pattern.
		- _Predicative Scaling_: Uses machine learning to predict future traffic ahead of time.

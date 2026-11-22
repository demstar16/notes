# Global Infrastructure

### Global Application

- Is an application deployed in multiple geographies.
- On AWS this could be Regions or Edge Locations.
- **Why?**
	- Decreased latency: time it takes for a network packet to reach a server.
	- Disaster recovery: if a AWS region goes down you can fail-over to another region.
	- Attack protection: distributed global infrastructure is harder to attack.
- **In AWS**
	- **Global DNS**: To route users to the closest deployment with least latency and good for disaster recovery strategies.
	- **Global Content Delivery Network (CDN)**: Replicate part of your application to AWS edge locations to decrease latency and cache common requests.
	- **S3 Transfer Acceleration**: Accelerate global uploads & downloads into Amazon S3.
	- **AWS Global Accelerator**: Improve global application availability and performance using AWS global network.

### AWS Global Infrastructure

- Regions: for deploying applications and infrastructure.
- Availability Zones (AZ): Made of multiple data centers.
- Edge locations (points of presence): for content delivery as close as possible to users.

### AWS Route 53

- Is a managed DNS (Domain Name System).
- DNS is a collection of rules and records which helps clients understand how to reach a server through URLs.
- **Features Available**:
	- Domain registration.
	- DNS.
	- Health checks.
	- Routing policy.
- Common records in AWS:
	- www.google.com -> 12.34.56.78 == A record (IPv4).
	- www.google.com -> 2001:0db8:85a3:0000:0000:8a2e:0370:7334 == AAAA IPv6
	- search.google.com -> www.google.com == CNAME:hostname to hostname
	- example.com -> AWS resource == Alias (ex: ELB, CloudFront, S3, RDS, etc.)
- **Routing Policies**
	- Simple Routing Policy: no health checks.
	- Weighted Routing Policy: distribute the traffic across EC2 instances by giving a weight to each of our instances. (think of load balancing)
	- Latency Routing Policy: Will allocate users to talk to the closest server to minimise latency.
	- Failover Routing Policy: Great for disaster recovery, if the main has failed. It will be redirected to the failover.

### Amazon CloudFront

- Is a Content Delivery Network.
- Improves read performance, content is cached at the edge locations.
- 216 Points of Presence globally (edge locations).
- DDoS protection, integration with Shield, AWS Web Application Firewall (WAF).
- **CloudFront - Origins**
	- S3 Bucket:
		- For distributing files and caching them at the edge.
		- Enhancing security with CloudFront _Origin Access Control (OAC)_.
		- CloudFront can be used as an ingress (to upload files to S3).
	- Custom Origin (HTTP):
		- Application Load Balancer.
		- EC2 Instance.
		- S3 Website (must first enable the bucket as a static S3 site).
		- Any HTTP backend you want.
- **vs S3 Cross Region Replication**
	- CloudFront is great for static content that must be available everywhere.
	- S3 Cross Region Replication is great for dynamic content that needs to be available at low-latency in few regions.
- **S3 Transfer Acceleration**
	- Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the target region.
	- This works because the user upload to an edge location which is close.
	- Then the edge location can transfer to the S3 bucket through AWS internal network which is also fast.

### AWS Global Accelerator

- Improve global application availability and performance using the AWS global network.
- Leverage the AWS internal network to optimise the route to your application.
- 2 Anycast IP are created for your application and traffic is sent through edge locations.
- The edge locations send the traffic to your application.
- **vs CloudFront**
	- They both use AWS global network and its edge locations around the world.
	- Both integrate with AWS Shield for DDoS protection.
	- CloudFront - CDN improves performance for your cacheable content and content is served at the edge.
	- Global accelerator has no caching, it proxies packets at the edge to applications running in one or more AWS regions.
		- It improves performance for a wide range of applications over TCP or UDP.
		- Good for HTTP use cases that require static IP addresses and that required deterministic, fast regional failover.

### AWS Outposts

- Hybrid Cloud: businesses that keep an on-premises infrastructure alongside a cloud infrastructure.
- 2 ways of dealing with IT systems.
	- One for the AWS cloud.
	- One for the on-premises infrastructure.
- AWS outposts are server racks that offer the same AWS infrastructure, services and you can start leveraging AWS services on premises.
- AWS sets up and manages the Outpost racks.
- You are responsible for the Outposts rack's physical security.
- **Benefits**
	- Low latency access to on-premises systems.
	- Local data processing.
	- Data residency.
	- Easier migration from on-premises to the cloud.
	- Fully managed service.

### AWS WaveLength

- WaveLength Zones are infrastructure deployments embedded within the telecommunications provider's data centers at the edge of 5G networks.
- Brings AWS services to the edge of the 5G networks.
- Ultra-low latency applications through 5G networks.
- Traffic doesn't leave the Communication Service Provider's (CSP) network.
- High-bandwidth and secure connection to the parent AWS region.
- No additional charges or service agreements.
- Use Cases: Smart cities, ML-assisted diagnostics, connected vehicles, interactive live video streams, real-time gaming, etc.

### AWS Local Zones

- Places AWS compute. storage, database and other selected AWS services closer to end users to run latency-sensitive applications.
- Extend your VPC to more locations.
- Example:
	- AWS Region: N.Virginia (us-east-1).
	- AWS Local Zones: Boston, Chicago, Dallas, Houston, Miami...

### Global Applications Architecture

- Single Region, Single AZ: Low Availability, High global latency, easy difficulty to create.
- Single Region, Multi AZ: High Availability, High global latency, medium difficulty to create.
- Multi Region, Active-Passive: Low Global Reads latency, High Global Writes latency, medium difficulty to create.
- Multi Region, Active-Active: Low Global Reads latency, Low Global Writes latency, hard difficulty to create.

### Summary

- Global DNS: Route 53
	- Great to route users to the closest deployment with least latency
	- Great for disaster recovery strategies
- Global Content Delivery Network (CDN): CloudFront
	- Replicate part of your application to AWS Edge Locations – decrease latency
	- Cache common requests – improved user experience and decreased latency
- S3 Transfer Acceleration
	- Accelerate global uploads & downloads into Amazon S3
- AWS Global Accelerator
	- Improve global application availability and performance using the AWS global network.
- AWS Outposts
	- Deploy Outposts Racks in your own Data Centers to extend AWS services
- AWS WaveLength
	- Brings AWS services to the edge of the 5G networks
	- Ultra-low latency applications
- AWS Local Zones
	- Bring AWS resources (compute, database, storage, …) closer to your users
	- Good for latency-sensitive applications

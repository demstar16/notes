# VPC

### IP Addresses in AWS

- **IPv4** - Internet Protocol version 4 (4.3 billion addresses).
	- **Private IPv4** can be used on private networks (LAN) such as internal AWS networking.
	- **Public IPv4** can be used on the internet.
	- EC2 instances get a new public IP address every time you stop and start it. (default)
	- The private IPv4 is fixed for EC2 instances even if you stop/start them.
- **Elastic IP**: allows you to attach a fixed public IPv4 address to an EC2 instance.
- All public IPv4 on AWS will be charged $0.005 per hour (including EIP).
- **IPv6** - Internet Protocol version 6 (3.4 x 10^38 Addresses).
	- Every IP address is public in AWS (no private range).
	- Free.
	- Example; 2001:db8:3333:4444:cccc:dddd:eeee:ffff.

### VPC & Subnets

- **VPC**: Virtual Private Cloud: private network to deploy your resources (regional resource).
- **Subnets**: allow you to partition your network inside your VPC (Availability Zone resource.)
- **Public Subnet**: is a subnet that is accessible from the internet.
- **Private Subnet**: is a subnet that is not accessible from the internet.
- We use **Route Tables** to define access to the internet and between subnets.

### Internet Gateway & NAT Gateways

- **Internet Gateways**: help our VPC instances connect with the internet.
- Public subnets have a route to the internet gateway.
- **NAT Gateways** (AWS-managed) & **NAT instances** (self-managed) allow your instances in your _Private Subnets_ to access the internet while remaining private.

### Network ACL & Security Groups

- **NACL: Network ACL**
	- A firewall which controls traffic from and to a subnet.
	- Can have ALLOW and DENY rules.
	- They're attached at the subnet level.
	- Rules only include IP addresses.
	- Operates on the subnet level.
	- Is stateless: return traffic must be explicitly allowed by rules.
	- We process rules in number order when deciding whether to allow traffic.
	- Automatically applies to all instances in the subnets it's associated with.
- **Security Groups**
	- A firewall that controls traffic to and from an ENI / an EC2 instance.
	- Can have only ALLOW rules.
	- Rules include IP addresses and other security groups.
	- Operates at the instance level.
	- Is stateful: return traffic is automatically allowed, regardless of any rules.
	- We evaluate all rules before deciding whether to allow traffic.
	- Applies to an instance only if someone specifies the security group when launching the instance, or associates the security group with the instance later on.

### VPC Flow Logs

- Captures information about IP traffic going into your interfaces: VPC Flow Logs, Subnet Flow Logs, Elastic Network Interface Flow Logs.
- Helps to monitor & troubleshoot connectivity issues. Examples: subnets to internet, subnets to subnets, internet to subnets.
- Captures network information from AWS managed interfaces too: Elastic Load Balancers, ElastiCache, RDS, Aurora, etc.
- VPC Flow Logs can go to S3, CloudWatch Logs, and Kinesis Data Firehose.

### VPC Peering

- Connect 2 VPC, privately using AWS' network.
- Make them behave as if they were in the same network.
- Must not have overlapping CIDR (IP address range).
- VPC Peering connection is not transitive (must be established for each VPC that needs to communicate with one another.)

### VPC Endpoints

- Endpoints allow you to connect to AWS Services using a private network instead of the public www network.
- This gives you enhanced security and lower latency to access AWS services.
- **VPC Endpoint Gateway**: S3 & DynamoDB
- **VPC Endpoint Interface**: the rest.

### AWS PrivateLink (VPC Endpoint Services)

- Most secure & scalable way to expose a service to 1000s of VPCs.
- Does not require VPC peering, internet gateway, NAT, route tables...
- Requires a network load balancer (Service VPC) and ENI (Customer VPC).

### Site to Site VPN & Direct Connect

- **Site to Site VPN**
	- Connect an on-premises VPN to AWS.
	- The connection is automatically encrypted.
	- Goes over the public internet.
	- On-premises: must use a **Customer Gateway** (CGW)
	- AWS: must use a Virtual **Private Gateway** (VGW)
- **Direct Connect (DX)**
	- Establish a physical connection between on-premises and AWS.
	- The connection is private, secure and fast.
	- Goes over a private network.
	- Takes at least a month to establish.

### AWS Transit Gateway

- For having transitive peering between thousands of VPC and on-premises, hub-and-spoke (star) connection.
- One single Gateway to provide this functionality.
- Works with Direct COnnect Gateway, VPN connections.

### Summary

- **VPC** - Virtual Private Cloud
- **Subnets** - Tied to an AZ, network partition of the VPC
- **Internet Gateway** - at the VPC level, provide Internet Access
- **NAT Gateway / Instances** - give internet access to private subnets
- **NACL** - Stateless, subnet rules for inbound and outbound
- **Security Groups** - Stateful, operate at the EC2 instance level or ENI
- **VPC Peering** - Connect two VPC with non overlapping IP ranges, non-transitive
- **Elastic IP** -fixed public IPv4, ongoing cost if not in-use
- **VPC Endpoints** - Provide private access to AWS Services within VPC
- **PrivateLink** - Privately connect to a service in a 3rd party VPC
- **VPC Flow Logs** - network traffic logs
- **Site to Site VPN** - VPN over public internet between on-premises DC and AWS
- **Client VPN** - OpenVPN connection from your computer into your VPC
- **Direct Connect** - direct private connection to AWS
- **Transit Gateway** - Connect thousands of VPC and on-premises networks together

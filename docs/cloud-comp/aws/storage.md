# Storage

## S3
* Infinitely scaling storage.
* USE CASES:
	* Backup & Storage
	* Disaster Recovery
	* Archive
	* Hybrid Cloud Storage
	* Application Hosting
	* Media Hosting
	* Data Lakes & Big Data Analytics
	* Software Delivery
	* Static Website
### Buckets
- Pretty much a directory.
- Buckets are defined at region level.
- Names have to globally unique (across all regions and all accounts).
	- Account Regional Namespace - allows for reuse of the same bucket name across regions.
	- No uppercases or underscores, not an IP, has to start with a lowercase letter or number, can't start with the prefix `xn--`, and must not end with the suffix `-s3alias`.
	- Must be 3-63 characters long.
### Objects
- Another word for file.
- Each object has a key, which is the FULL path to the object, composed of prefix + object name.
- There is no concept of directories within buckets.
- The value of the object is the file content.
- Max. object size is 50TB
- If uploading more than 5GB, must use "multi-part upload".
- Can have Metadata, Tags and a Version ID.
	- Metadata: list of text key/value pairs (system or user metadata).
	- Tags: Unicode key/value pairs (up to 10), useful for security and lifecycle.
### Security
- User Based IAM Policies.
- Resource Based Bucket Policies: Bucket wide rules from the S3 console - allows cross account.
- Object ACL - finer grain (can be disabled).
- Bucket ACL - less common (can be disabled).
- An IAM principal can access an S3 object if the user IAM permissions ALLOW it or the resource policy ALLOWS it and if there's no explicit DENY.
- Encryption: encrypt objects in Amazon S3 using encryption keys.
#### Bucket Policies
EXAMPLE:
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicRead",
			"Effect": "Allow",
			"Principal": "*",
			"Action": [
				"s3:GetObject"
			],
			"Resource": [
				"arn:aws:s3:::examplebucket/*"
			]
		}
	]
}
```
- Use S3 bucket policy to:
	- Grant public access to bucket.
	- Force objects to be encrypted at upload.
	- Grant access to another account (Cross Account).
- When generating a policy to give access to everything in your bucket, add `/*` to the end of the bucket ARN.

### Versioning
- Happens at the bucket level.
- Overwriting the same key creates a new version.
- It is best practice to version your buckets.
	- Protect against unintended deletes
	- Rollbacks
- Any version prior to having versioning enabled will be `null`.
- Suspending versioning does not delete the previous versions.
### Replication
- Must have versioning enabled in both the source and destination buckets.
- Cross Region Replication (CRR)
	- Compliance, lower latency access, replication across accounts.
- Same Region Replication (SRR)
	- Log aggregation, live replication between production and test accounts.
- Buckets can be in different AWS accounts
- Copying is asynchronous
- Must give proper IAM permissions to S3.
- Once replication is enabled, only new objects are replicated.
- To replicate existing objects and objects the failed replication, use **S3 Batch Replication**
- For DELETE ops:
	- Can replicate delete markers from src to dest (optional setting).
	- Deletions with a version ID are not replicated (to avoid malicious deletes).
- There is no "chaining" of replication:
	- If bucket 1 has replication into bucket 2, which has replication into bucket 3.
	- Then objects created in bucket 1 are not replicated into bucket 3.

### Storage Classes

- Durability: How many times the objects are going to be lost by amazon. All storage classes are very durable.
- Availability: Measures how readily services are available.
- **Lifecycle Rules**: can be used to define when S3 objects should be transitioned to another storage class or when objects should be deleted after some time.
- Types of Classes:
	- Amazon S3 Standard - General Purpose.
		- 99.99% Availability.
		- Used for frequently accessed data.
		- Low latency and high throughput.
		- Sustain 2 concurrent facility failures.
		- Use Cases: Big data analytics, mobile and gaming apps, content distribution, etc.
	- Amazon S3 Standard-Infrequent Access (IA).
		- For data that is less frequently accessed but requires rapid access when needed.
		- Lower cost than S3 standard.
		- 99.9% Availability.
		- Use Cases: Disaster Recovery, backups.
	- Amazon S3 One Zone-Infrequent Access.
		- High durability (99.999999999%) in a single AZ; data lost when AZ is destroyed.
		- 99.5% Availability.
		- Use Cases: Store secondary copies of on-premise data.
	- Amazon S3 Glacier Instant Retrieval.
		- Low-cost object storage meant for archiving / backup.
		- Pricing: price for storage + object retrieval cost.
		- Millisecond retrieval, great for data accessed once a quarter.
		- Minimum storage duration 90 days.
	- Amazon S3 Glacier Flexible Retrieval.
		- Low-cost object storage meant for archiving / backup.
		- Pricing: price for storage + object retrieval cost.
		- Expedited (1 to 5 minutes).
		- Standard (3 to 5 hours).
		- Bulk (5 to 12 hours).
		- Minimum storage duration is 90 days.
	- Amazon S3 Glacier Deep Archive.
		- Low-cost object storage meant for archiving / backup.
		- Pricing: price for storage + object retrieval cost.
		- Standard (12 hours).
		- Bulk (48 hours).
		- Minimum Storage duration 180 days.
	- Amazon S3 Intelligent Tiering.
		- Small monthly monitoring and auto-tiering fee.
		- Moves objects automatically between access tiers based on usage.
		- There are no retrieval charges in S3 Intelligent Tiering.
		- Frequent Access tier (automatic): default tier.
		- Infrequent Access tier (automatic): objects not accessed for 30 days.
		- Archive Instant Access tier (automatic): objects not accessed for 90 days.
		- Archive Access tier (optional): configurable from 90 days to 700+ days.
		- Deep Archive Access tier (optional): config. from 180 days to 700+ days.

### Encryption

- Server Side Encryption (default).
	- Anything uploaded into a bucket is encrypted by Amazon S3.
- Client side encryption:
	- When someone encrypts their file and then uploads it to a bucket.

### IAM Access Analyzer for S3

- Ensures that only intended people have access to your S3 buckets.
- Analyses all your policies and rules and will let you know which buckets are publicly accessible and will allow you to ensure that all buckets are only being accessed by those intended.

### Shared Responsibility Model for S3

- AWS responsible for:
	- Infrastructure (global security, durability, availability, sustain concurrent loss of data in two facilities.)
	- Configuration and vulnerability analysis.
	- Compliance validation.
- You are responsible for:
	- S3 versioning.
	- S3 bucker policies.
	- S3 replication setup.
	- logging and monitoring.
	- S3 storage classes.
	- data encryption at rest in transit.

## Snow Family

- Highly secure, portable devices to collect and process data at teh edge and migrate data into and out of AWS.
- Services for Data migration: Snowcone, Snowball Edge, Snowmobile.
- Services for Edge Computing: Snowcone, Snowball Edge
- **Data migration** with AWS Snow Family:
	- Challenges:
		- limited connectivity.
		- limited bandwidth.
		- high network cost.
		- shared bandwidth.
		- connection stability.
	- If it takes more than a week to transfer over the network, use snowball devices.
	- It works by receiving a physical device from AWS and uploading data onto it locally and shipping that back to AWS.
- **Snowball Edge**:
	- is used for moving TBs or PBs of data in or out of AWS.
	- Alternative to moving data over the network.
	- Pay per data transfer job.
	- Provide block storage and amazon S3-compatible object storage.
	- Pricing: you pay for device usage and data transfer out of AWS not in.
	- 2 types:
		- Storage optimized.
		- Compute optimized.
- **Snowcone and Snowcone SSD**:
	- Small portable computing anywhere, rugged and secure, withstands harsh environments.
	- Used for edge computing, storage, and data transfer.
	- 2 Types:
		- Snowcone - 8TB of HDD storage.
		- Snowcone SSD - 14TB of SSD storage.
	- Must provide your own battery and cables.
	- Can be sent back to AWS offline, or connect it to internet and use AWS DataSync to send data.
- **Snowmobile**:
	- Transfer exabytes of data (1 EB = 1000 PB = 1 000 000 TBs).
	- Each snowmobile has 100 PB capacity.
	- High Security.
	- Better than Snowball if you start transferring more than 10PB of data.
- **Edge Computing**:
	- Is when you process data while it's being created on an edge location (truck on the road, ship on the sea).
	- Edge locations may have limited internet access, limited access to computing power.
	- We set up and Snowball edge or Snowcone device to do edge computing.
	- Use cases: Pre-process data, machine learning at the edge, transcoding media streams.
	- Ship device back to AWS when ready to transfer the data.
- **AWS OpsHub**:
	- a software you install on your computer to help you manage your snow devices without a CLI.

## Storage Gateway

- **Bridge between on-premise data and cloud data in S3.**
- Hybrid storage service to allow on-premises to seamlessly use the AWS cloud.
- Use Cases: disaster recovery, backup & restore, tiered storage.
- Types of Storage Gateway:
	- File Gateway.
	- Volume Gateway.
	- Tape Gateway.

## EBS (Elastic Block Store)

- An Elastic Block Store (EBS) is a network drive you can attach to your instances while they run.
- It allows your instances to persist data, even after their termination.
- They can only be mounted to one instance at a time (at the CCP level).
	- CCP: Certified Cloud Practitioner, one EBS can only be mounted to one EC2 instance.
- They are bound to a specific availability zone.
	- An EBS Volume in us-east-1a cannot be attached to us-east-1b.
	- To move a volume across, you need to snapshot it.
- Analogy: A network USB stick.
- Uses the network to communicate, this can result in latency.
- It can be detached from an EC2 instance and attached to another one quickly.
- Have a provisioned capacity (size in GBs, and IOPS).
- Make sure you're volume has the same region as the instance you are attaching it to.

### EBS Snapshots

- Make a backup (Snapshot) of your EBS volume at a point in time.
- Not necessary to detach volume to do a snapshot, but it is recommended.
- Can copy snapshots across AZ or Region.
- Great for transferring volumes across regions.
- Features:
	- EBS Snapshot Archive.
		- Move a Snapshot to an "archive tier" that is 75% cheaper.
		- Takes within 24 to 72 hours for restoring the archive.
	- Recycle Bin for EBS Snapshots.
		- Setup rules to retain deleted snapshots so you can recover them after an accidental deletion.
		- Specify retention (from 1 day to 1 year)

## EC2 Instance Store

- EBS volumes are network drives with good but "limited" performance.
- If you need a high performance hardware disk, use EC2 Instance Store.
- **Why?** Better I/O performance.
- EC2 Instance Store lose their storage if they're stopped (ephemeral).
- Good for buffer / cache / scratch data / temporary content.
- Risk of data loss if hardware fails.
- Backups and Replication are your responsibility.

## EFS (Elastic File System)

- Managed network file system (NFS) that can be mounted on 100s of EC2.
- EFS works with Linux EC2 instances in multi-AZ.
- Highly available, scalable, expensive, pay per use, no capacity planning.

### EFS Infrequent Access (EFS-IA)

- Storage class that is cost-optimised for files not accessed every day.
- Up to 92% lower cost compared to EFS standard.
- EFS will automatically move your files to EFS-IA based on the last time they were accessed.
- Enable EFS-IA with a lifecycle policy.
	- Example: move files that are not accessed for 60 days to an EFS-IA.
- Transparent to the applications accessing EFS.

### EBS vs EFS

- EBS is only available in one availability zone.
- Only way to transfer is by taking a snapshot (a copy) and linking this copy to another EBS.
- However since it is a copy the files these EBS' see are not in sync.
- EFS however share their resources with multiple EBS, so any EBS connected to the EFS will be in sync.

## FSx

- Launch 3rd party high-performance file systems on AWS.
- Fully managed service.
- For windows:
	- A fully manageable, highly reliable, and scalable Windows native shared file system.
	- Built on Windows File Server.
	- Supports SMB protocol & Windows NTFS.
	- Integrated with Microsoft Active Directory.
	- Can be accessed fromAWS or your on-premise infrastructure.
- For Lustre:
	- A fully managed, high performance, scalable file storage for high performance computing (HPC).
	- The name Lustre is derived from "Linux" and "cluster".
	- Machine Learning, Analytics, Video Processing, Financial Modelling...
	- Scales up to 100s GB/s, millions of IOPS, sub-ms latencies.

## Shared Responsibility Model for EC2 Storage

- AWS is responsible for:
	- Infrastructure.
	- Replication for data for EBS volumes & EFS drives.
	- Replacing faulty hardware.
	- Ensuring their employees cannot access your data.
- What are we responsible for:
	- Setting up backup / snapshot procedures.
	- Setting up data encryption.
	- Responsibility of any data on the drives.
	- Understanding the risk of using EC2 Instance Store.

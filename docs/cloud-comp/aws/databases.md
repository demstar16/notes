# Databases

### Types

- **Relational DB**:
	- Tables that are linked together.
	- Use SQL to perform queries.
- **NoSQL DB**:
	- Non-relational database.
	- Built for a specific data model and have flexible schemas.
	- Benefits:
		- Flexibility: easy to evolve data model.
		- Scalability: designed to scale-out by using distributed clusters.
		- High-performance: optimized for a specific data model.
		- Highly functional: types optimized for the data model.
	- A common example is to model a NoSQL database with JSON.

### Shared Responsibility on AWS

- AWS offers to manage different databases.
- **Benefits** include:
	- Quick provisioning, High availability, vertical and horizontal scaling.
	- Automated backup and restore, operations, upgrades.
	- Operating system patching is handled by AWS.
	- Monitoring and alerting are integrated.
- Many DB technologies can be run on an EC2 instance but this puts much more responsibility on you as it is managed by you.

### Amazon RDS

- Relational Database Service.
- Use **SQL** for its query language.
- Free tier on AWS.
- Allows you to create databases in the cloud that are managed by AWS: Postgres, mySQL, MariaDB, Oracle, Microsoft SQL Server, IBM DB2.
- **Advantages** of using this service over your own on an EC2:
	- It's managed service.
	- Automated provisioning.
	- Continuous backups and restore to specific timestamp (Point in Time Restore).
	- Monitoring dashboards.
	- Read replicas for improved read performance.
	- Multi AZ setup for Disaster Recovery (DR).
	- Maintenance windows for upgrades.
	- Scale horizontally and vertically.
	- Storage backed by EBS.
- **Disadvantage**: You can't SSH into your instances.
- **Deployment Options**:
	- _Read Replicas_:
		- Scale the read workload of your DB.
		- Can create up to 15 read replicas.
		- Data is only written to the main DB.
	- _Multi-AZ_:
		- Failover in case of AZ outage, high availability.
	- _Multi-region_:
		- Multi-region read replicas.
		- The replicas all still write to the one main DB.
		- Disaster recovery in case of region issue.
		- Local performance for global reads.
		- Replication cost.

### Amazon Aurora

- Not open sourced, its from AWS.
- PostgreSQL and MySQL are both supported as AuroraDB.
- Aurora is AWS cloud optimized and claims 5x performance improvement over MySQL on RDS, over 3x performance of Postgres on RDS.
- Aurora storage automatically grows.
- Costs more than RDS, but is more cost ejective.
- Not in free tier on AWS.

### Amazon Aurora Serverless

- Automated database instantiation and auto-scaling based on actual usage.
- PostgreSQL and MySQL are both supported as Aurora Serverless DB.
- No capacity planning needed.
- Least management overhead.
- Pay per second, can be more cost-effective.
- **Good for infrequent**, intermittent or unpredictable workloads.

### Amazon ElastiCache

- A managed Redis or Memcached DB.
- Caches are in-memory databases with high performance, low latency.
- Helps reduce the load off databases for read intensive workloads.
- AWS takes care of OS maintenance / patching, optimizations, setup, configuration, monitoring failure recovery and backups.
- Solution Architecture - Cache:
	- ELB goes to an EC2 instance which reads and writes data from RDS.
	- The EC2 instance can also read and write from a ElastiCache which will be much faster.
	- Good for taking load off the RDS.

### DynamoDB

- Part of the NoSQL family.
- Scales to massive workloads, distributed "serverless" database (does have servers but they're in the backend).
- Fast and consistent performance.
- Single digit millisecond latency.
- Integrated with IAM for security, authorization and admin.
- Low cost and auto scaling capabilities.
- Standard & Infrequent Access Table Class.
- **Type of Data**:
	- Is a key/value DB consisting of attributes.
	- Each attribute has a name (key), a value and a type.
- DynamoDB Accelerator - DAX:
	- Fully managed in-memory cache for DynamoDB.
	- 10x performance improvement.
	- Secure, highly scalable & highly available.
	- Difference with ElastiCache at the CCP level: DAX is only used for and is integrated with DynamoDB, while ElastiCache can be used for other databases.
- **Global Tables**:
	- Makes DynamoDB accessible with low latency in multiple regions.
	- Active-ACtive replication, this means you can actively write into any of the regions and they will be replicated.

### Redshift

- Based on PostgreSQL, but its not used for OLTP.
- It is OLAP - online analytical processing (analytics and data warehousing).
- Load data once every hour, not every second.
- 10x performance than other data warehouses, scale to PBs of data.
- Columnar storage of data instead of row based.
- Massively parallel query execution (MPP), highly available.
- Pay as you go based on the instances provisioned.
- Has a SQL interface for performing the queries.
- **Redshift Serverless**:
	- Automatically provisions and scales data warehouse underlying capacity.
	- Run analytics workloads without managing dat warehouse infrastructure.
	- Pay only for what you use.
	- Use cases: reporting, dashboard apps, real-time analytics.

### Amazon EMR

- Elastic MapReduce
- Creates a Hadoop cluster (Big Data) to analyze and process vast amounts of data.
- The clusters can be made of hundreds of EC2 instances.
- Supports Apache Spark, HBase, Presto, and more.
- EMR takes care of all provisioning and configuration.
- Auto-scaling and integrated with Spot instances.
- Use Cases: data processing, machine learning, web indexing.

### Amazon Athena

- Serverless query service to perform analytics against S3 objects.
- Uses standard SQL language to query files.
- Supports CSV, JSON, ORC, Avro and PArquet (built on Presto.)
- Pricing: $5 per TB opf data scanned.
- Uses compressed or columnar data for cost-savings.
- **Exam Tip**: analyze data in S3 using serverless SQL, use Athena

### Amazon QuickSight

- Serverless machine-learning powered business intelligence service to create interactive dashboards.
- Fast, automatically scalable, emendable, with per-session pricing.
- Use cases: Business analytics, Building visualizations, perform ad-hoc analysis.
- Integrated with RDS, Aurora, Athena, Redshift and S3.

### Document DB

- A NoSQL database and based on top of mongoDB tech (compatible with).
- MongoDB is used to store, query, and index JSON data.
- SimilarSimilar “deployment concepts” as Aurora
- Fully Managed, highly available with replication across 3 AZ
- DocumentDB storage automatically grows in increments of 10GB
- Automatically scales to workloads with millions of requests per seconds

### Amazon Neptune

- Fully managed graph database.
- Popular graph dataset would be a social network.
- Highly available across 3 AZ, with up to 15 read replicas.
- Build and run applications working with highly connected datasets (optimized for these complex and hard queries.)
- High storage and low latency.
- Highly available with replications across multiple AZs.
- Great for knowledge graphs, fraud detection, recommendation engines, and social networking.

### Amazon Timestream

- Fully managed, fast, scalable, serverless time series database
- Automatically scales up/down to adjust capacity
- Store and analyze trillions of events per day
- 1000s times faster & 1/10th the cost of relational databases
- Built-in time series analytics functions (helps you identify patterns in your data in near real-time)

### Amazon QLDB

- Quantum Ledger Database.
- A ledge is a book recording financial transactions.
- Fully managed , serverless, highly available, replication across 3 AZs.
- Used to review history of all changes made to application over time.
- Immutable system: no entry can be removed or modified, cryptographically verifiable.
- 2-3x better performance than common ledger blockchain frameworks.
- Difference with Amazon Managed Blockchain: no decentralization component, in accordance with financial regulation rules.

### Amazon Managed Blockchain

- Blockchain makes it possible tom build apps where multiple parties can execute transactions without the need for a trusted, central authority.
- AMB is a managed service to join public blockchain networks or create your own scalable private network.
- Compatible with the frameworks Hyperledger Fabric and Ethereum.

### AWS Glue

- Managed extract, transform, and load (ETL) service.
- Useful to prepare and transform data for analytics.
- Fully serverless service.
- Glue data catalog: catalog of datasets.
- Can be used by Athena, Redshift, EMR.

### Database Migration Service (DMS)

- Quickly and securely migrate databases to AWS, resilient, self healing.
- The sources database remains available during the migration.
- Supports:
	- Homogeneous migrations: example, Oracle to Oracle.
	- Heterogeneous migrations: example, Microsoft SQL Server to Aurora.

### Summary

- **Relational Databases - OLTP**: RDS & Aurora (SQL)
- Differences between Multi-AZ, Read Replicas, Multi-Region
- **In-memory Database**: ElastiCache
- **Key/Value Database**: DynamoDB (serverless) & DAX (cache for DynamoDB)
- **Warehouse - OLAP**: Redshift (SQL)
- **Hadoop Cluster**: EMR
- **Athena**: query data on Amazon S3 (serverless & SQL)
- **QuickSight**: dashboards on your data (serverless)
- **DocumentDB**: “Aurora for MongoDB” (JSON – NoSQL database)
- **Amazon QLDB**: Financial Transactions Ledger (immutable journal, cryptographically verifiable)
- **Amazon Managed Blockchain**: managed Hyperledger Fabric & Ethereum blockchains
- **Glue**: Managed ETL (Extract Transform Load) and Data Catalog service
- **Database Migration**: DMS
- **Neptune**: graph database
- **Timestream**: time-series database

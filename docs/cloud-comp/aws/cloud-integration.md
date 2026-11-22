# Cloud Integration

### Amazon SQS

- Simple Queue Service.
- Fully managed service used to decouple applications.
- Low Latency.
- Scales from 1 msg per second to 10,000s per second.
- Default retention of messages: 4 days, max of 14 days.
- No limit to how many msgs can be in the queue.
- Messages are deleted after they're read by consumers.
- Consumers share the work to read msgs & scale horizontally.
- **FIFO Queue**
	- First In First Out (ordering of messages.)
	- Messages are processed in order by the consumer.

### Amazon Kinesis

- Kinesis = real-time big data streaming.
- Managed service to collect, process, and analyze real-time streaming data at any scale.
- Some handy things to know that won't be in the exam:
	- **Kinesis Data Streams**: low latency streaming to ingest data at scale from hundreds of thousands of sources.
	- **Kinesis Data Firehose**: load streams into S3, Redshift, ElasticSearch, etc...
	- **Kinesis Data Analytics**: perform real-time analytics on streams using SQL.
	- **Kinesis Video Streams**: monitor real-time video streams for analytics or ML.

### Amazon SNS

- For sending one message to many receivers.
- The "event publishers" sends one message to one SNS topic.
- As many "event subscribers" as we want can listen to the SNS topic for notifications.
- Each subscriber will get all the messages.
- Up to 12,500,000 subscriptions per topic, 100,000 topics limit.
- Subscribers can be anything from a Lambda to mobile device.

### Amazon MQ

- SQS and SNS are cloud native services: proprietary protocols from AWS.
- Traditional applications running from on-premises may use open protocols like MQTT, AMQP, etc.
- When **migrating** to the cloud, rather than re-engineering the application to use SQS or SNS, we can use Amazon MQ.
- It's a managed messaged broker service for RabbitMQ and ActiveMQ.
- It doesn't scale as much as SQS/SNS.
- It runs on servers, can run in Multi-AZ with failover.
- It has both queue feature (SQS) and topic features (SNS).

### Summary

- **SQS**:
	- Queue service in AWS
	- Multiple Producers, messages are kept up to 14 days
	- Multiple Consumers share the read and delete messages when done
	- Used to decouple applications in AWS
- **SNS**:
	- Notification service in AWS
	- Subscribers: Email, Lambda, SQS, HTTP, Mobile…
	- Multiple Subscribers, send all messages to all of them
	- No message retention
- **Kinesis**: real-time data streaming, persistence and analysis
- **Amazon MQ**: managed message broker for ActiveMQ and RabbitMQ in the cloud (MQTT, AMQP.. protocols)

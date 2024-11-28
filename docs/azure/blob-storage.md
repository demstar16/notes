# Blob Storage

## What is it?

- Object storage designed for large amounts of unstructured data.
- **Unstructured data**: Data that doesn't conform to a particular data model or definition.
- Blob storage is designed for:
  - Serving images or documents directly to a browser.
  - Storing files for distributed access.
  - Streaming video and audio.
  - Writing to log files.
  - Storing data for backup and restore, disaster recovery, and archiving.
  - Storing data for analysis by an on-premises or Azure-hosted service.
- Users or client apps can access objects in blob storage via HTTP/HTTPS.
- Objects in Blob storage are accessible via the Azure Storage REST API, Azure PowerShell, Azure CLI, or an Azure Storage client library.

## Types of Storage Accounts

| Type                        | Supported Storage Services                          | Redundancy Options                   | Usage                                                                                                                                                                                                     |
| :-------------------------- | :-------------------------------------------------- | :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard general-purpose v2 | Blob storage (Data Lake, Queue, Table, Azure Files) | LRS, GRS, RA-GRS, ZRS, GZRS, RA-GZRS | For blobs, file shares, queues, and tables is recommended for most scenarios using Azure Storage. If you want support for network file system (NFS) in Azure Files, use premium file shares account type. |
| Premium Block Blobs         | Blob Storage (including Data Lake)                  | LRS and ZRS                          | For block blobs and append blobs. Recommended for scenarios with high transaction rates or that use smaller objects or require consistently low storage latency.                                          |
| Premium File Shares         | Azure Files                                         | LRS and ZRS                          | For file shares only. Recommended for enterprise or high-performance scale apps                                                                                                                           |
| Premium Page Blobs          | Page blobs only                                     | LRS and ZRS                          | For page blobs only                                                                                                                                                                                       |

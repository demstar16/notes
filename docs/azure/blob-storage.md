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

- **Standard**: Recommended for most scenarios using Azure Storage.
- **Premium**: 3 different types, offering higher performance by using solid-state drives.

| Type                        | Supported Storage Services                          | Redundancy Options                   | Usage                                                                                                                                                                                                     |
| :-------------------------- | :-------------------------------------------------- | :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard general-purpose v2 | Blob storage (Data Lake, Queue, Table, Azure Files) | LRS, GRS, RA-GRS, ZRS, GZRS, RA-GZRS | For blobs, file shares, queues, and tables is recommended for most scenarios using Azure Storage. If you want support for network file system (NFS) in Azure Files, use premium file shares account type. |
| Premium Block Blobs         | Blob Storage (including Data Lake)                  | LRS and ZRS                          | For block blobs and append blobs. Recommended for scenarios with high transaction rates or that use smaller objects or require consistently low storage latency.                                          |
| Premium File Shares         | Azure Files                                         | LRS and ZRS                          | For file shares only. Recommended for enterprise or high-performance scale apps                                                                                                                           |
| Premium Page Blobs          | Page blobs only                                     | LRS and ZRS                          | For page blobs only                                                                                                                                                                                       |

## Access Tiers for Block Blob Data

- There are different options for accessing block blob data based on usage patterns.
- By selecting the right access tier for your needs, you can be as cost-effective as possible.
- The tiers:
  - **Hot**: Optimised for frequent access, coming with the highest storage costs and lowest access costs. _New storage accounts are created in this tier by default._
  - **Cool**: Optimised for storing large amounts of data that infrequently accessed and stored for a minimum of 30 days. Lower storage costs and higher access costs compared to the Hot access tier.
  - **Cold**: Optimised for storing data that is infrequently accessed and stored for a minimum of 90 days. Lower storage costs and higher access costs compared to the Cool access tier.
  - **Archive**: Available only for individual block blobs, it is optimised for data that can tolerate several hours of retrieval latency and remains in the Archive tier for a minimum of 180 days. It is the most cost-effective option for storing data, but accessing the data is more expensive than accessing data in the hot or cool tiers.
- You can switch between these at any time if your usage patterns change.

## Azure Blob Storage Resource Types

### Storage Account

- Provides a unique namespace in Azure for your data.
- Every object you store in Azure will have an address that includes your unique account name.
- The combination of the account name and the Azure Storage blob endpoint forms the base address for the objects in your storage account.
- If your storage account is called `mystorageaccount`, then the default endpoint for Blob storage is:
  - `http://mystorageaccount.blob.core.windows.net`

### Container

- Organises a set of blobs (like a directory in a file system.)
- A storage account can have an unlimited amount of containers and a container can store an unlimited amount of blobs.
- A container name must be a valid DNS name, because it forms part of a unique URI (Unique Resource Identifier).
- Rules for naming a container:
  - Container names can be between 3-63 chars long.
  - Container names must start with a letter or number, and can only contain lowercase letters, numbers, and the dash (-) character.
  - Two or more consecutive dash characters aren't permitted in container names.
- The URI for a container is similar to before: `https://myaccount.blob.core.windows.net/mycontainer`

### Blob

- 3 Types:
  - **Block**: Stores text and binary data, they can be managed individually and store up to about 190.7TiB.
  - **Append**: Made up of blocks like block blobs, but are optimised for append operations. They are ideal for scenarios like logging data for a VM (for example).
  - **Page**: Store random access files up to 8TB. They store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.
- URI could like either of these 2:
  - `https://myaccount.blob.core.windows.net/mycontainer/myblob`
  - `https://myaccount.blob.core.windows.net/mycontainer/myvirtualdirectory/myblob`

## Security Features

- Uses Service-Side Encryption (SSE) to automatically encrypt your data when it's persisted to the cloud.
- Storage encryption protects your data and helps you meet your organisational security and compliance commitments.
- Blob Storage and Queue Storage provide client-side encryption for customers who need to encrypt data on the client.

### Encryption for Data at Rest

- Azure Storage automatically encrypts your data when persisting it to the cloud.
- Data in Azure Storage is encrypted and decrypted transparently using 256-bit Advanced Encryption Standard (AES) encryption.
  - AES is one of the strongest block ciphers available and is Federal Information Processing Standards (FIPS) compliant.
- Azure Storage encryption is enabled be default and can't be disabled.
- Azure Storage encryption incurs no extra cost.

### Encryption Key Management

- Data in a new storage account is encrypted with Microsoft-managed keys by default.
- You can keep this or oyu can manage encryption with your own keys.
- If you want to use your own keys you can do either of the below or both:
  - You can specify a customer-managed key to use for encrypting and decrypting data in Blob Storage and in Azure Files. Customer-managed keys must be stored in Azure Key Vault or Azure Key Vault Managed Hardware Security Model (HSM).
  - You can specify a customer-provided key on Blob Storage operations. A client can include an encryption key on a read/write request for granular control over how blob data is encrypted and decrypted.

| Key management parameter         | Microsoft-managed keys                | Customer-managed keys                | Customer provided-keys   |
| :------------------------------- | :------------------------------------ | :----------------------------------- | :----------------------- |
| Encryption/decryption operations | Azure                                 | Azure                                | Azure                    |
| Azure Storage services supported | All                                   | Blob Storage, Azure files            | Blob storage             |
| Key storage                      | Microsoft key store                   | Azure Key Vault or Key Vault HSM     | Customer's own key store |
| Key rotation responsibility      | Microsoft                             | Customer                             | Customer                 |
| Key control                      | Microsoft                             | Customer                             | Customer                 |
| Key scope                        | Account (default), container, or blob | Account(default), container, or blob | N/A                      |

### Client-side Encryption

- The Azure Blob Storage client libraries for .NET, Java, and Python support encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client.
- The Queue Storage client libraries for .NET and Python also support client-side encryption
- Blob and Queue storage use AES in order to encrypt user data.
- 2 Versions of client-side encryption available in the client libraries:
  - Version 1 uses Cipher Block Chaining (CBC) mode with AES. The Blob, Queue, and Table Storage SDKs support client-side encryption with v1.
  - Version 2 uses Galois/Counter Mode (GCM) mode with AES. The Blob and Queue Storage SDKs support client-side encryption with v2.

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

## Lifecycle

### Access Tiers for Block Blob Data

- There are different options for accessing block blob data based on usage patterns.
- By selecting the right access tier for your needs, you can be as cost-effective as possible.
- The tiers:
  - **Hot**: Online and optimised for frequent access, coming with the highest storage costs and lowest access costs. _New storage accounts are created in this tier by default._
  - **Cool**: Online and optimised for storing large amounts of data that infrequently accessed and stored for a minimum of **30 days**. Lower storage costs and higher access costs compared to the Hot access tier.
  - **Cold**: Offline and optimised for storing data that is infrequently accessed and stored for a minimum of **90 days**. Lower storage costs and higher access costs compared to the Cool access tier.
  - **Archive**: Offline and available only for individual block blobs, it is optimised for data that can tolerate several hours of retrieval latency and remains in the Archive tier for a minimum of **180 days**. It is the most cost-effective option for storing data, but accessing the data is more expensive than accessing data in the hot or cool tiers.
- You can switch between these at any time if your usage patterns change.
- Data storage limits are set at the account level and not per access tier, you can use your limit across tiers or all in one tier.

### Management

- Azure Blob Storage lifecycle management offers a rule-based policy that you can use to transition blob data to the appropriate access tiers or to expire data at the end of the data lifecycle.
- You can do the following with said policy:
  - Transition blobs from cool to hot immediately when accessed to optimise performance.
  - Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects aren't accessed or modified for a period of time, to optimise for cost.
  - Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles.
  - Apply rules to an entire storage account, to select containers, or to a subset of blobs using name prefixes or blob index tags as filters.
- These policies allow you to manage the lifecycle of your data depending on how it is used to optimise for cost and performance.

### Policies

- Is a collection of rules in a JSON document.
- Each rule definition within a policy includes a filter set and an action set.
  - **Filter set** limits rule actions to a certain set of objects within a container or objects names.
  - **Action set** applies the tier or delete actions to the filtered set of objects.

```json
{
  "rules": [
    {
      "name": "rule1",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {...}
    },
    {
      "name": "rule2",
      "type": "Lifecycle",
      "definition": {...}
    }
  ]
}
```

Rule Parameters:

| Parameter Name | Parameter Type                            | Notes                                                                                                            | Required |
| :------------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :------- |
| `name`         | String                                    | A rule name can include ip to 256 alphanumeric characters, is case-sensitive and must be unique within a policy. | True     |
| `enabled`      | Boolean                                   | An optional boolean to allow a rule to be temporarily disabled. It is defaulted to true.                         | False    |
| `type`         | An enum value                             | The current valid type is Lifecycle                                                                              | True     |
| `definition`   | An object that defines the lifecycle rule | Each definition is made up of a filer set and an action set                                                      | True     |

The following sample rule filters the account to run the actions on objects that exist inside `sample-container` and start with `blob1`

- Tier blob to cool tier 30 days after last modification.
- Tier blob to archive tier 90 days after last modification.
- Delete blob 2,555 days (7 years) after last modification.
- Delete blob snapshots 90 days after snapshot creation.

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "sample-rule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "version": {
            "delete": {
              "daysAfterCreationGreaterThan": 90
            }
          },
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90,
              "daysAfterLastTierChangeGreaterThan": 7
            },
            "delete": {
              "daysAfterModificationGreaterThan": 2555
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["sample-container/blob1"]
        }
      }
    }
  ]
}
```

#### Rule Filter

- Limit actions to a subset of blobs within the storage account, if more than one filter is defined, a logical AND runs on all filters.
- Filters include:
  - `blobTypes`: An array of predefined enum values (REQUIRED).
  - `prefixMatch`: An array of strings for prefixes to be matched. Each rule can define up to 10 prefixes and a prefix must start with a container name (NOT REQUIRED).
  - `blobIndexMatch`: An array of dictionary values consisting of blob index tag key and value conditions to be matched. Each rule can define up to 10 blob index tag conditions (NOT REQUIRED).

#### Rule Actions

- Applied to the filtered blobs when the run condition is met.
- Lifecycle management supports tiering and deletion of blobs and deletion of blob snapshots.
- Define at least one action for each rule on blobs or blob snapshots.

| Action                      | Current Version                            | Snapshot      | Previous Versions |
| :-------------------------- | :----------------------------------------- | :------------ | :---------------- |
| tierToCool                  | Supported for `blockBlob`                  | Supported     | Supported         |
| tierToCold                  | Supported for `blockBlob`                  | Supported     | Supported         |
| enableAutoTierToHotFromCool | Supported for `blockBlob`                  | Not Supported | Not Supported     |
| tierToArchive               | Supported for `blockBlob`                  | Supported     | Supported         |
| delete                      | Supported for `blockBlob` and `appendBlob` | Supported     | Supported         |

- **NOTE**: If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob.
- The run conditions are based on age.
  - Base blobs use the last modified time to track age.
  - Blob snapshots use the snapshot creation time to track age.

| Action Run Condition               | Condition Value                                                           | Description                                                                                                                                                                           |
| :--------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| daysAfterModificationGreaterThan   | Integer value indicating the age in days                                  | The condition for base blob actions                                                                                                                                                   |
| daysAfterCreationGreaterThan       | Integer value indicating the age in days                                  | The condition for blob snapshot actions                                                                                                                                               |
| daysAfterLastAccessTimeGreaterThan | Integer value indicating the age in days                                  | The condition for a current version of a blob when access tracking is enabled                                                                                                         |
| daysAfterLastTierChangeGreaterThan | Integer value indicating the age in days after last blob tier change time | The min duration in days that a rehydrated blob is kept in hot, cool, or cold tiers before being returned to the archive tier. This condition applies only to `tierToArchive` actions |

#### Implementing

- **Portal**:
  - You can either use Azure portal List view or Azure portal Code view.
  - Here is how you can do it with Azure portal Cod view:
    - `Data management -> Lifecycle Management -> Code View`
    - Under this tab we can define a lifecycle management policy in JSON.
    - Example of a policy that moves a block blob whose name begins with `log` to the cool tier if it has been more than 30 days since the blob was modified.

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "move-to-cool",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["sample-container/log"]
        }
      }
    }
  ]
}
```

- **CLI**
  - To do the same thing we can run the following command:
  - `az storage account management-policy create --account-name <storage-account> --policy @policy.json --resource-group <resource-group>`
  - The policy has to be read or written in full, partial updates aren't supported.

### Rehydration

- When a blob is in the archive tier it is offline and can't be read or modified.
- In order to read or modify the blob we first have to rehydrate it to an online tier (hot or cool).
- Two ways to do this:
  - Copy an archived blob to an online tier using the `Copy Blob` or `Copy Blob from URL` operation. (This is microsoft's recommended option for most scenarios).
  - Change a blob's access tier to an online tier using the `Set Blob Tier` operation.
- The rehydration process can take several hours to complete.
- It is recommended to rehydrate larger blobs rather than several small blobs concurrently.

#### Priority

- You can set the priority for the rehydration operation with the optional `x-ms-rehydrate-priority` header on a `Set Blob Tier` or `Copy Blob/Copy Blob From URL` operation.
- You can set either **Standard** or **High** priorities.
  - **Standard** being processed in the order it was received taking (potentially) up to 15 hours.
  - **High** being prioritized over standard priority requests and might complete in under an hour for objects under 10GB in size.
- You can call `Get Blob Properties` to return the value of the `x-ms-rehydrate-priority` header to check the priority whilst the operation is underway.

#### Copying a Blob

- Can't over-write the source blob.
- Supported within the same storage account only for versions earlier than 2021-02-12.
- Version after and including 2021-02-12 you can copy blobs across storage accounts as long as the destination account is in the same region as the source account.

#### Changing Access Tier

- Once a `Set Blob Tier` request is initiated, it can't be canceled.
- **CAUTION**: Changing a blob's tier doesn't affect its last modified time. Be wary of this in terms of your policy as if this operation doesn't modify time it may move unexpectedly.
- [For more](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-to-online-tier#rehydrate-a-blob-by-changing-its-tier)

### Client Library

- The Azure Storage client libraries for .NET offer a nice interface for making calls to Azure Storage.
- Some basic classes:

| Class                 | Description                                                                                                |
| :-------------------- | :--------------------------------------------------------------------------------------------------------- |
| `BlobClient`          | Allows you to manipulate Azure Storage blobs                                                               |
| `BlobClientOptions`   | Provides the client config options for connecting to Azure Blob Storage                                    |
| `BlobContainerClient` | Allows you to manipulate Azure Storage containers and their blobs                                          |
| `BlobServiceClient`   | Allows you to manipulate Azure Storage service resources and blob containers. The storage account provides |

- **Packages**:
  - `Azure.Storage.Blobs`: Contains the primary classes (client objects) that you can use to operate on the service containers, and blobs.
  - `Azure.Storage.Blobs.Specialized`: Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
  - `Azure.Storage.Blobs.Models`: All other utility classes, structures, and enumeration types.

#### Creating a BlobServiceClient Object

- Allows your app to interact with resources at the storage account level.
- Here is how we can make one in C#:

```cs
using Azure.Identity;
using Azure.Storage.Blobs;

public BlobServiceClient GetBlobServiceClient(string accountName)
{
    BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());

    return client;
}
```

#### Creating a BlobContainerClient Object

- Can create one through the `BlobServiceClient` object.
- Allows you to interact with a specific container resource, providing methods to create, delete, or configure a container.
- Also includes methods to list, upload, and delete blobs within it.
- Create a container from a `BlobServiceClient` object to interact with a specific container resource:

```cs
public BlobContainerClient GetBlobContainerClient(
    BlobServiceClient blobServiceClient,
    string containerName)
{
    // Create the container client using the service client object
    BlobContainerClient client = blobServiceClient.GetBlobContainerClient(containerName);
    return client;
}
```

- If your work is narrowly scoped to a single container, you might want to create a `BlobContainerClient` object without using `BlobServiceClient`:

```cs
public BlobContainerClient GetBlobContainerClient(
    string accountName,
    string containerName,
    BlobClientOptions clientOptions)
{
    // Append the container name to the end of the URI
    BlobContainerClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"),
        new DefaultAzureCredential(),
        clientOptions);

    return client;
}
```

#### Create a BlobClient object

- Needed to interact with a specific blob resource.
- You can make one from a service client or a container client.

```cs
public BlobClient GetBlobClient(
    BlobServiceClient blobServiceClient,
    string containerName,
    string blobName)
{
    BlobClient client =
        blobServiceClient.GetBlobContainerClient(containerName).GetBlobClient(blobName);
    return client;
}
```

### Managing Container Properties with .NET

- Blob containers support system properties and user-defined metadata, in addition to the data they contain.
  - **System Properties** exist on each Blob storage resource. Some can be read or set, while others are read-only.
    - Some system properties correspond to certain standard HTTP headers, the Azure Storage client library for .NET maintains these for you.
  - **User-defined metadata** consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store other values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.
- You can use `GetProperties` or `GetPropertiesAsync` from the `BlobContainerClient` class to retrieve container properties.

```cs
private static async Task ReadContainerPropertiesAsync(BlobContainerClient container)
{
    try
    {
        // Fetch some container properties and write out their values.
        var properties = await container.GetPropertiesAsync();
        Console.WriteLine($"Properties for container {container.Uri}");
        Console.WriteLine($"Public access level: {properties.Value.PublicAccess}");
        Console.WriteLine($"Last modified time in UTC: {properties.Value.LastModified}");
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

- To set metadata, add name-value pairs to an `IDictionary` object and then call `SetMetadata` or `SetMetadataAsync` from the `BlobContainerClient` class.

```cs
// Setting metadata
public static async Task AddContainerMetadataAsync(BlobContainerClient container)
{
    try
    {
        IDictionary<string, string> metadata =
           new Dictionary<string, string>();

        // Add some metadata to the container.
        metadata.Add("docType", "textDocuments");
        metadata.Add("category", "guidance");

        // Set the container's metadata.
        await container.SetMetadataAsync(metadata);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}

// Retrieving metadata
public static async Task ReadContainerMetadataAsync(BlobContainerClient container)
{
    try
    {
        var properties = await container.GetPropertiesAsync();

        // Enumerate the container's metadata.
        Console.WriteLine("Container metadata:");
        foreach (var metadataItem in properties.Value.Metadata)
        {
            Console.WriteLine($"\tKey: {metadataItem.Key}");
            Console.WriteLine($"\tValue: {metadataItem.Value}");
        }
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

#### Retrieving Properties and Metadata

- To get headers you can retrieve them using GET and HEAD with URI syntax:
  - Container: `GET/HEAD https://myaccount.blob.core.windows.net/mycontainer?restype=container`
  - Blob: `GET/HEAD https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=metadata`
- Set metadata's headers with PUT which will overwrite any existing metadata on the resource, calling PUT without any headers on the request clears all existing metadata on the resource.
  - Container: `PUT https://myaccount.blob.core.windows.net/mycontainer?comp=metadata&restype=container`
  - Blob: `PUT https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=metadata`
- Containers and Blobs support certain HTTP properties.
- Properties and metadata are both represented as standard HTTP headers, the difference being the naming of the headers.
  - Metadata header prefix: `x-ms-meta-`.
  - Property headers use standard HTTP header names.
- HTTP headers supported on containers include:
  - `ETag`
  - `Last-Modified`
- HTTP headers supported on blobs include:
  - `ETag`
  - `Last-Modified`
  - `Content-Length`
  - `Content-Type`
  - `Content-MD5`
  - `Content-Encoding`
  - `Content-Language`
  - `Cache-Control`
  - `Origin`
  - `Range`

---

[Return](../)

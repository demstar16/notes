# Azure Key Vault

- Supports vaults and managed hardware security module (HSM) pools.
- Vaults support storing software and HSM-backed keys, secrets, and certificates.
- Managed HSM pools only support HSM-backed keys.
- Azure Key Vault helps solve the following problems:
  - **Secrets Management**: Azure Key Vault can also be used to Securely store and tightly control access access to tokens, passwords, certificates, API keys, and other secrets.
  - **Key Management**: Azure Key Vault makes it easy to create and control the encryption keys used to encrypt your data.
  - **Certificate Management**: Azure Key Vault lets you easily provision, manage and deploy public and private SSL/TSL certificates for use with Azure and your internal connected resources.
- 2 **Service Tiers**:
  - Standard: encrypts with a software key.
  - Premium: includes HSM-protected keys.

## Benefits

- **Centralised application secrets**: Centralising storage of application secrets in AKV allows you to control their distribution.
- **Securely store secrets and keys**: Access to a key vault requires proper authentication and authorisation before a caller (user or application) can get access.
  - Authentication is done via Microsoft Entra ID.
  - Authorisation may be done in Azure role-based access control or Key Vault access policy.
  - Azure RBAC can be used for both management of the vaults and to access data stored in a vault, while key vault access policy can only be used when attempting to access data stored in a vault.
  - AKVs may be either software-protected or, with AKV premium, hardware-protected by HSMs.
- **Monitor access and use**: You can monitor activity by enabling logging for your vaults.
  - You have control over your logs and you may secure them by restricting access and you may also delete logs that you no longer need.
  - AKV can be configured to:
    - Archive to a storage account.
    - Stream to an event hub.
    - Send the logs to Azure Monitor logs.
- **Simplified administration of application secrets**: Security information must be secured, it must follow a life cycle, and it must be highly available.
  - AKV simplifies the process of meeting these requirements by:
    - removing the need for in-house knowledge of HSMs.
    - Scaling up on short notice to meet your org's usage spikes.
    - Replicating the contents of your Key Vault within a region and to a secondary region. Data replication ensures high availability and takes away the need of any action from the admin to trigger the failover.
    - Providing standard Azure admin options via the portal, Azure CLI and PowerShell.
    - Automating certain tasks on certificates that you purchase from Public CAs, such as enrolment and renewal.

## Best Practices

- **Use separate key vaults**
- **Control access to your vault**
- **Backup**
- **Logging**
- **Recovery options**

### Authentication

- To do any operations with AKV, you first need to authenticate to it, 3 ways to do this:
  - **Managed identities for Azure resources**: When you deploy and app on a VM in Azure, you can assign an identity to your VM that has access to AKV, the benefit here is that the app or service isn't managing the rotation of the first secret.
  - **Service principal and certificate**: You can use a service principal and an associated certificated that has access to AKV, this is not recommended because the app owner or developer must rotate the certificate.
  - **Service principal and secret**: Not recommended as it's hard to automatically rotate the bootstrap secret that's used to authenticate to AKV.

### Encryption of data in transit

- AKV enforces TLS protocol to protect data when it's travelling between AKV and clients.
- TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery),interoperability, algorithm flexibility, and ease of deployment and use.
- Perfect Forward Secrecy (PFS) protects connections between customers' client systems and MS cloud services by unique keys.
- Connections use RSA-based 2048-bit encryption key lengths.
- This combination makes it difficult for someone to intercept data that is in transit.

## Authenticating to Azure Key Vault

- Authentication with AKV works with MS Entra ID, which is responsible for authenticating the identity of any given security principal.
- For applications, there are 2 ways to obtain a service principal:
  - Enable a system-assigned managed identity for the application. With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to various services.
  - If you can't use managed identity, you instead register the application with your MS Entra tenant. Registration also creates a second application object that identifies the app across all tenants.
- It is recommended to use a system-assigned managed identity.
- The parameters on the `WWW-Authenticate` header are:
  - authorization: The address of the OAuth2 authorization service that may be used to obtain an access token for the request.
  - resource: The name of the resource (`https://vault.azure.net`) to use in the authorization request.

# Managed Identities

- A common challenge for devs is the management of secrets, credentials, certificates, and keys used to secure communication between services.
- Managed Identities eliminate the need for developers to manage these credentials.
- Managed Identities provide an automatically managed identity in MS Entra ID for applications to use when connecting to resources that support MS Entra authentication.
- Applications can use managed identities to obtain MS Entra tokens without having to manage any credentials.
- [Services](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/services-support-msi) that support managed identities for Azure resources.

## Types

- Internally managed identities are service principals of a special type, which are locked to only be used with Azure resources.
- When the managed identity is deleted, the corresponding service principal is automatically removed.

**System-assigned**:

- Is enabled directly on an Azure service instance.
- When the identity is enabled, Azure creates an identity for the instance in MS Entra tenant trusted by the subscription of the instance.
- The **lifecycle** of a system-assigned identity is directly tied to the Azure service instance that it's enabled on.
- If the instance is deleted, Azure automatically cleans up the credentials and the identity in MS Entra ID.

**User-assigned**:

- Is created as a standalone Azure resource.
- Through a create process, Azure creates an identity in the MS Entra tenant that's trusted by the subscription in use.
- The **lifecycle** of a user-assigned identity is managed separately from the lifecycle of the Azure service instances to which it's assigned.

## Configuration

- You can configure an Azure VM with a managed identity during, or after, the creation of the VM.

### System-assigned managed identity

- To create, or enable, an Azure VM with the system-assigned managed identity your account needs the **Virtual Machine Contributor** role assignment.
- No other MS Entra directory role assignments are required.

#### Enable system-assigned managed identity during creation of an Azure VM

Create a VM with a system-assigned managed identity, as requested by the `--assign-identity` parameter, with the specified `--role` and `--scope`. The `--admin-username` and `--admin-password` parameters specify the administrative username and password account for VM sign-in.

```bash
az vm create --resource-group myResourceGroup
    --name myVM --image win2016datacenter
    --generate-ssh-keys
    --assign-identity
    --role contributor
    --scope mySubscription
    --admin-username azureuser
    --admin-password myPassword12
```

#### Enable system-assigned managed identity on an existing Azure virtual machine

```bash
az vm identity assign -g myResourceGroup -n myVm
```

### User-assigned managed identity

- To assign a user-assigned identity to a VM during its creation, your account needs the **Virtual Machine Contributor** and **Managed Identity Operator** role assignments.
- No other MS Entra directory role assignments are required.
- Enabling user-assigned managed identities is a 2 step process:
  - Create the suer-assigned identity.
  - Assign the identity to a VM.

#### Create a user-assigned identity

```bash
az identity create -g myResourceGroup -n myUserAssignedIdentity
```

#### Assign a user-assigned managed identity during the creation of an Azure VM

```bash
az vm create
--resource-group <RESOURCE GROUP>
--name <VM NAME>
--image Ubuntu2204
--admin-username <USER NAME>
--admin-password <PASSWORD>
--assign-identity <USER ASSIGNED IDENTITY NAME>
--role <ROLE>
--scope <SUBSCRIPTION>
```

#### Assign a user-assigned managed identity to an existing Azure VM

```bash
az vm identity assign
    -g <RESOURCE GROUP>
    -n <VM NAME>
    --identities <USER ASSIGNED IDENTITY>
```

## Characteristics

| Property                       | System-assigned managed identity                                                                                                                                 | User-assigned managed identity                                                                              |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| Creation                       | Created as part of an Azure resource                                                                                                                             | Created as a stand-alone Azure resource                                                                     |
| Lifecycle                      | Shared lifecycle with the Azure resource that the managed identity is created with. When the parent resource is deleted, the managed identity is deleted as well | Independent lifecycle. Must be explicitly deleted                                                           |
| Sharing across Azure resources | Can't be shared, it can only be associated with a single Azure resource                                                                                          | Can be shared. The same user-assigned managed identity can be associated with more than one Azure resource. |

## Common Use Cases

- System-assigned managed identity:
  - Workloads contained within a single Azure resource.
  - Workloads needing independent identities.
  - Example, an application that runs on a single VM.
- User-assigned managed identity:
  - Workloads that run on multiple resources and can share a single identity.
  - Workloads needing pre-authorisation to a secure resource, as part of a provisioning flow.
  - Workloads where resources are recycled frequently, but permissions should stay consistent.
  - Example, a workload where multiple VMs need to access the same resource.

## Authentication Flow

### How a system-assigned managed identity works with an Azure VM

1. ARM receives a request to enable the system-assigned managed identity on a VM.
2. ARM creates a service principal in MS Entra ID for the identity of the VM. The service principal is created in the MS Entra tenant that's trusted by the subscription.
3. ARM configures the identity on the VM by updating the Azure Instance Metadata Service identity endpoint with the service principal client ID and certificate.
4. After the VM has an identity, use the service principal information to grant the virtual machine access to Azure resources. To call ARM, use role-based access control in MS Entra ID to assign the appropriate role to the VM service principal. To call Key Vault, grant your code access to the specific secret or key in Key Vault.
5. Your code that's running on the VM can request a token from Azure Instance Metadata service endpoint, accessible only from within the VM: `http://169.254.169.254/metadata/identity/oauth2/token`
6. A call is made to MS Entra ID to request an access token (specified in step 5) by using the client ID and certificate configured in step 3. MS Entra ID returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports MS Entra authentication.

### How a user-assigned managed identity works with an Azure VM

1. ARM receives a request to create a user-assigned managed identity.
2. ARM creates a service principal in MS Entra ID for the user-assigned managed identity. The service principal is created in the MS Entra tenant that's trusted by the subscription.
3. ARM receives a request to configure the user-assigned managed identity on a VM and updates the Azure Instance Metadata Service identity endpoint with the user-assigned managed identity service principal client ID and certificate.
4. After the user-assigned managed identity is created, use the service principal information to grant the identity access to Azure resources. To call ARM, use role-based access control in MS Entra ID to assign the appropriate role to the service principal of the user-assigned identity. To call Key Vault, grant your code access to the specific secret or Key Vault.
5. Your code that's running on the VM can request a token from the Azure Instance Metadata Service identity endpoint, accessible only from within the VM: `http://169.254.169.254/metadata/identity/oauth2/token`
6. A call is made to MS Entra ID to request an access token (specified in step 5) by using the client ID and certificate configured in step 3. MS Entra ID returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that support Microsoft Entra authentication.

# Azure App Configuration Service

- Provides a service to centrally manage application settings and feature flags.
- Spreading configuration settings across multiple components can lead to hard-to-troubleshoot errors during an application deployment.
- App Configuration stores all the settings for your application and secures their accesses in one place.
- Complements Azure Key Vault, which is used to store application secrets
- App Configuration shines in the following scenarios:
  - Centralise management and distribution of hierarchical configuration data for different environments and geographies.
  - Dynamically change application settings without the need to redeploy or restart an application.
  - Control feature availability in real-time.

## Benefits

- Fully managed service that can be set up in minutes.
- Flexible key representations and mappings.
- Tagging with labels.
- Point-in-time replay of settings.
- Dedicated UI for feature flag management,
- Comparison of 2 sets of configurations on custom-defined dimensions.
- Enhanced security through Azure-managed identities.
- Encryption of sensitive information at rest and in transit.
- Native integration with popular frameworks.

## Create Paired Keys & Values

- Azure App Configuration stores its config data as key-value pairs.
- Keys serve as the name and are used to store and retrieve corresponding values.
- An example of key names structured into a hierarchy based on component services (common to delimit with `/` or `:`)

```cs
AppName:Service1:ApiEndpoint
AppName:Service2:ApiEndpoint
```

- Keys stored in App Configuration are case-sensitive, unicode-based strings (can't use `*`, `,` or `\`).
- To include one of the reserved characters, you must it escape it with `\`.
- There is a 10,000 character limit on a key-value pair.
- 2 general approaches to naming keys: _flat_ or _hierarchical_.
- Hierarchical naming offers these benefits:
  - Easier to read.
  - Easier to manage.
  - Easier to use.

### Label Keys

- Key-values can optionally have a label attribute.
- Labels are used to differentiate key-values with the same key.
- By default, a key-value has no label.
- Use `\0` to explicitly reference a key-value without a label.

```
Key = AppName:DbEndpoint & Label = Test
Key = AppName:DbEndpoint & Label = Staging
Key = AppName:DbEndpoint & Label = Production
```

### Version Key Values

- Doesn't version key values automatically as they're modified.
- Use labels as a way to create multiple versions of a key value.
- Example: You can input an application version number or a Git commit ID in labels to identify key values associated with a particular software build.

### Query Key Values

- Each key-value is uniquely identified by its key plus a label that can be `\0`.
- You query an App Configuration store for key-values by specifying a pattern.
- The App Configuration store returns all key-values that match the pattern including their corresponding values and attributes.

## Manage Application Features

- Feature management is a modern software-development practice that decouples feature release from code deployment and enables quick changes to feature availability on demand.
- It uses a technique called feature flags (aka feature toggles, feature switches, and so on) to dynamically administer a feature's lifecycle.
- **Feature Flag**: A variable with a binary state of _on_ or _off_ and an associated code block. The state of the feature flag triggers whether the code block runs or not.
- **Feature Manager**: An application package that handles the lifecycle of all the feature flags in an application. The feature manager typically provides extra functionality, such as caching feature flags and updating their states.
- **Filter**: A rule for evaluating the state of a feature flag. A user group, a device or browser type, a geographic location, and a time window are all examples of what a filter can represent.
- An effective implementation of feature management consists of at least 2 components working in concert:
  - An application that makes use of feature flags.
  - A separate repository that stores the feature flags and their current state.

### Feature Flags in Code

- Think of it as a Boolean state variable used with an `if` statement in the code:

```cs
if (featureFlag) {
    // Run the following code
}
```

### Feature Flag Declaration

- Each feature flag has 2 parts: name & list of one or more filters that are used to evaluate if a feature's state i son.
- When a feature flag has multiple filters, the filter list is traversed in order until one of the filters determines the feature should be enabled, remaining filters are skipped.
- The feature manager supports `appsettings.json` as a configuration source for feature flags.

```json
"FeatureManagement": {
    "FeatureA": true, // Feature flag set to on
    "FeatureB": false, // Feature flag set to off
    "FeatureC": {
        "EnabledFor": [
            {
                "Name": "Percentage",
                "Parameters": {
                    "Value": 50
                }
            }
        ]
    }
}
```

### Feature Flag Repository

- To use feature flags effectively, you need to externalise all the feature flags used in an application.
- This allows you to change feature flag state without modifying and redeploying the application itself.
- Azure App Configuration is designed to be centralised repository for feature flags.
  - You can use it to define different kinds of feature flags and manipulate their states quickly and confidently.
  - You can then use the App Configuration libraries for various programming language frameworks to easily access these flags from your application.

## Secure App Configuration Data

### Encrypt configuration data by using customer-managed keys

- Azure App Configuration encrypts sensitive info at rest using a 256-bit AES encryption key provided by MS.
- Every App Configuration instance has its own encryption key managed by the service and used to encrypt sensitive information.
- Sensitive info includes the values found in key-value pairs.
- When customer-managed key capability is enabled, App Configuration uses a managed identity assigned to the App Configuration instance to authenticate with MS Entra ID.
- The managed identity then calls Azure Key Vault and wraps the App Configuration's instance's encryption key.
- The wrapped encryption key is then stored and the unwrapped encryption key is cached within App Configuration for one hour.
- App Configuration refreshes the unwrapped version of the App Configuration instance's encryption key hourly.
- This ensures availability under normal operating conditions.

### Enable customer-managed key capability

- The following components are required to successfully enable the customer-managed key capability for Azure App Configuration:
  - Standard tier Azure App Configuration instance.
  - Azure Key Vault with soft-delete and purge-protection features enabled.
  - An RSA or RSA-HSM key within the Key Vault: The key must not be expired, it must be enabled, and it must have both wrap and unwrap capabilities enabled.
- Once these resources are configured, 2 steps remain to allow Azure App Configuration to use the Key Vault key:
  - Assign a managed identity to the Azure App Configuration instance.
  - Grant the identity `GET`, `WRAP`, and `UNWRAP` permissions in the target Key Vault's access policy.

### Use private endpoints for Azure App Configuration

- Allows clients on a virtual network to securely access data over a private link.
- The private endpoint uses an IP address from the virtual network address space for your App Configuration store.
- Network traffic between the clients on the virtual network and the App Configuration store traverses over the virtual network using a private link on the Microsoft backbone network, eliminating exposure to the public internet.
- Using private endpoints for your App Configuration store enables you to:
  - Secure your app config details by configuring the firewall to block all connections to App Configuration on the public endpoint.
  - Increase security for the virtual network ensuring data doesn't escape.
  - Securely connect to the App Configuration store from on-premises networks that connect to the virtual network using VPN or ExpressRoutes with private-peering.

### Managed Identities

- Allows Azure App Configuration to easily access other MS Entra ID-protected resources.
- The identity is managed by the Azure platform.
- It doesn't require you to provision or rotate any secrets.
- Your app can be granted 2 types of identities:
  - **System-assigned identity**: Tied to your configuration store.
    - `az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup`
  - **User-assigned identity**: Standalone Azure resource that can be assigned to your configuration store.
    - Create an identity: `az identity create --resource-group myResourceGroup --name myUserAssignedIdentity`
    - Assign the new user-assigned identity to the `myTestAppConfigStore` configuration store: `az appconfig identity assign --name myTestAppConfigStore --resource-group myResourceGroup --identities /subscriptions/[subscription id]/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUserAssignedIdentity`

---

[Return](../)

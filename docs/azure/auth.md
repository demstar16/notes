# Authentication + Authorization

## Microsoft Identity Platform

- Helps you build applications your users and customers can sign in to using their Microsoft identities or social accounts.
- It also allows you to provide authorized access to your own APIs or Microsoft APIs like Microsoft Graphs.
- Components that make up the platform:
  - **OAuth 2.0 and OpenID Connect standard-compliant authentication service** enabling developers to authenticate several identity types, including:
    - Work or school accounts.
    - Personal Microsoft account.
    - Social or local accounts, by using Azure Active Directory B2C.
    - Social or local customer accounts, by using Microsoft Entra External ID.
  - **Open-source libraries**: Microsoft Authentication Libraries (MSAL) and support for other standards-compliant libraries.
  - **Microsoft identity platform endpoint**: Works with the MSAL or any other standards-compliant library.
    - It implements human readable scopes, in accordance with industry standards.
  - **Application management portal**: A registration and configuration experience in the Azure portal, along with the other Azure management capabilities.
  - **Application configuration API and PowerShell**: Programmatic configuration of your applications through the Microsoft Graph API and PowerShell so you can automate your DevOps tasks.
- For devs, the Microsoft identity platform offers integration of modern innovations in the identity and security space like passwordless authentication, step-up authentication, and Conditional Access.
- You don't need to implement such functionality yourself: applications integrated with the Microsoft identity platform natively take advantage of such innovations.

## Service Principals

- To delegate Identity and Access Management functions to Microsoft Entra ID, an application must be registered with a Microsoft Entra tenant.
- When you register your application with Microsoft Entra ID, you're creating an identity configurations for your application that allows it to integrate with Microsoft Entra ID.
- When you register an app in the Azure portal you choose whether it is:
  - **Single tenant**: only accessible in your tenant.
  - **Multi-tenant**: accessible in other tenants.
- If you register an application in the portal, an application object and a service principal object are automatically created in your home tenant.
  - You also have globally unique ID for your app (the app or client ID)
  - You can then add secrets or certs and scopes to make your app work in the portal.

### Application Object

- A Microsoft Entra application is scoped to its one and only **application object**.
- The application object resides in the Microsoft Entra tenant where the application was registered.
  - It is used as a template or blueprint to create one or more service principal objects.
  - It has some static properties which are applied to all the created service principals (application instances).
- The application object describes 3 aspects of an application:
  - How the service can issue tokens in order to access the application.
  - Resources that the application might need to access.
  - The actions that the application can take.

### Service Principal Object

- To access resources secured by a Microsoft Entra tenant, the entity requesting access must be represented by a security principal (this is true for users and applications).
- The security principal defines the access policy and permissions for the user/application in the Microsoft Entra tenant.
  - This enables core features like authentication of the user/app during sign in, and authorisation during resource access.
- 3 types of service principal:
  - **Application**: The local representation, or application instance, of a global application object in a single tenant or directory.
    - A service principal is created in each tenant where the application is used, and references the globally unique app object.
    - The service principal often defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access.
  - **Managed Identity**: Used to represent a managed identity.
    - Managed identities provide an identity for applications to use when connecting to resources that support Microsoft Entra authentication.
    - When a managed identity is enabled, a service principal representing that managed identity is created in your tenant.
    - Service principals representing managed identities can be granted access and permissions, but can't be update or modified directly.
  - **Legacy**: This service principal represents a legacy app, which is an app created before app registrations were introduced or an app created through legacy experiences.
    - A legacy service principal can have:
      - credentials
      - service principal names
      - reply URLs
      - and other properties that an authorised user can edit, but doesn't have an associated app registration.

## Relationship between Application Objects and Service Principals

- The application object is the **global representation** of your application
- The service principal is the **local representation** for use in a specific tenant.
- The application object serves as the template from which common and default properties are derived for use in creating corresponding service principal objects.
- An application object has:
  - A 1:1 relationship with the software application.
  - A 1:many relationships with its corresponding service principal objects.
- A service principal must be created in each tenant where the application is used to establish an identity for sign-in and/or access to resources being secured by the tenant.
- A single-tenant application has only one service principal, created and consented for use during application registration.
- A multi-tenant application also has a service principal created in each tenant where a user from the tenant consented to its use.

## Permissions and Consent

- The Microsoft identity platform implements OAuth 2.0 authorisation protocol.
  - OAuth 2.0 us a method through which a 3rd party app can access web-hosted resources on behalf of a user.
- When a resource's functionality is chunked into small permission sets, 3rd party apps can be built to request only the permissions that they need to perform their function.
- In OAuth 2.0 these types of permission sets are called _scopes_ (also referred to as _permissions_).
- An app requests the permissions it needs by specifying the permission in the `scope` query parameter.
- Identity platform supports several well-defined OpenID Connect scopes and resource-based permissions.
- Example, Requesting permission to read users in calenders in Microsoft Graph: `https://graph.microsoft.com/Calenders.Read`.
- An app most commonly requests these permissions by specifying the scopes in requests to the Microsoft identity platform authorize endpoint.
  - Some high-privilege permissions can be granted only through administrator consent.
  - They can be requested or granted by using the administrator consent endpoint.
- In requests to authorization, token or consent endpoints for the Microsoft Identity platform, if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph.

### Permission Types

- **Delegated access**: used by apps that have a signed-in user present.
  - Either the user or an administrator consents to the permissions that the app requests.
  - The app is delegated with the permission to act as a signed-in user when it makes calls to the target resource.
- **App-only access permissions**: used by apps that run without a signed-in user present.
  - For example, an app that runs as a background service or daemon.
  - Only an admin can consent to app-only access permissions.

### Consent Types

- Applications in Microsoft identity platform rely on consent in order to gain access to necessary resources or APIs.
  - There are many different kinds of consent that your app might need to know about in order to be successful.
  - If your defining permissions, you need to understand how your users gain access to your app or API.
- 3 Types of consent:
  - **Static User Consent**
    - You must specify all the permissions it needs in the app's configuration in the Azure portal.
    - If the admin hasn't granted consent for this app, then Microsoft identity platform prompts the user to provide consent at this time.
    - Static permissions also enable admins to consent on behalf of all users in the organisation.
    - Possible issues for developers:
      - The app needs to request all permissions it would ever need upon the user's first sign-in. Which can lead to a long list of permissions that discourages end users from approving the app's access on initial sign-in.
      - The app needs to know all of the resources it would ever access ahead of time. It's difficult to create apps that could access an arbitrary number of resources.
  - **Incremental + Dynamic User Consent**
    - You can ask for a minimum set of permissions upfront and request more over time as the customer uses more app features.
    - To do this, you specify scopes your app needs at any time by including new scopes in the `scope` parameter when requesting an access token - without the need to predefine them in the application registration information.
    - If the user hasn't yet consented to new scopes added to the request, they're prompted to consent only to the new permissions.
    - Only applies to delegated permissions and not app-only access permissions.
    - Dynamic consent is convenient but can be a big challenge for permissions that require admin consent, since the admin consent experience doesn't know about those permissions at consent time.
    - If you require admin privileged permissions or if your app uses dynamic consent, you must register all of the permissions in the Azure portal, enabling tenant admins to consent on behalf of all their users.
  - **Admin Consent**
    - Required when your app needs access to certain high-privilege permissions.
    - Ensures that admins have some other controls before authorising apps or users to access highly privileged data from the organisation.
    - Admin consent done on behalf of an organisation still requires the static permissions registered for the app.
    - This reduces the cycles required by the organisation admin to set up the application.
- Requesting individual user consent can be done by using the scope query parameter.
  - The `scope` parameter is a space-separated list of delegated permissions that the app is requesting.
  - Each permission is indicated by appending the permission value to the resource's identifier (the application ID URI).
  - After the user enters their credentials, the Microsoft identity platform checks for a matching record of _user consent_.
    - If the user hasn't consented to any requested permissions in the past, and if the admin hasn't consented to these permissions on behalf of the entire organisation, the platform asks the user to grant the requested permissions.
  - For example, when a user signs in to an app, the app sends a request like the following example.

```http
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=00001111-aaaa-2222-bbbb-3333cccc4444
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=
https%3A%2F%2Fgraph.microsoft.com%2Fcalendars.read%20
https%3A%2F%2Fgraph.microsoft.com%2Fmail.send
&state=12345
```

## Conditional Access

- Offers one of several ways that you can use to secure your app and protect a service.
- Enables developers and enterprise customers to protect services in a multitude of ways:
  - MFA
  - Allowing only Intune enrolled devices to access specific services.
  - Restricting user locations and IP ranges.
- Conditional Access doesn't change an app's behaviour or require changes from the developer in most cases, only in cases when an app indirectly or silently requests a token for a service does an app require code changes to handle Conditional Access challenges.
- The following scenarios require code to handle Conditional Access challenges:
  - Apps performing the on-behalf-of flow.
  - Apps accessing multiple services/resources.
  - Single-page apps calling a resource.
  - Web apps calling a resource.
- Examples:
  - You're billing a single-tenant iOS app and apply a Conditional Access policy. The app signs in a user and doesn't request access to an API. When the user signs in, the policy is automatically invoked and the user needs to perform multi-factor authentication.
  - You're building an app that uses a middle tier service to access a downstream API. An enterprise customer at the company using this app applies a policy to the downstream API. When an end user signs in, the app requests access to the middle tier and sends the token. The middle tier performs on-behalf-of flow to request access to the downstream API. At this point, a claims "challenge" is presented to the middle tier. the middle tier sends the challenge back to the app, which needs to comply with the Conditional Access policy.

## Microsoft Authentication Library (MSAL)

- Enables developers to acquire tokens from the Microsoft identity platform in order to authenticate users and access secured web APIs.
- It can be used to provide secure access to Microsoft APIs, 3rd party web APIs, or your own web API.
- MSAL supports .NET, JavaScript, Python, Android, and iOS.
- Benefits:
  - No need to directly use the OAuth libraries or code against the protocol in your application.
  - Acquires tokens on behalf of a user or on behalf of an application (when applicable to the platform).
  - Maintains a token cache and refreshes tokens for when they're close to expire. You don't need to handle token expiration on your own.
  - Helps you specify which audience you want your application sign in.
  - Helps you set up your application from configuration files.
  - Helps you troubleshoot your app by exposing actionable exceptions, logging, and telemetry.

### Application Types

- A token can be acquired within MSAL from many application types.

| Library                                                                                                      | Supported platforms and frameworks                                                               |
| :----------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| [MSAL for Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)                  | Android                                                                                          |
| [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular) | Single-page apps with Angular and Angular.js frameworks                                          |
| [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)               | iOS and macOS                                                                                    |
| [MSAL Go (preview)](https://github.com/AzureAD/microsoft-authentication-library-for-go)                      | Windows, macOS, Linux                                                                            |
| [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)                            | Windows, macOS, Linux                                                                            |
| [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)      | JavaScript/TypeScript frameworks like Vue.js, Ember.js, or Durandal.js                           |
| [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnetvvvvvvvvvvvvv)              | .NET Framework, .NET, .NET MAUI, WINUI, Xamarin Android, Xamarin iOS, Universal Windows Platform |
| [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)       | Web apps with Express, desktop apps with Electron, Cross-platform console apps                   |
| [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)                        | Windows, macOS, Linux                                                                            |
| [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)     | Single-page apps with React and React-based libraries (Next.js, Gatsby.js)                       |

### Authentication Flows

| Authentication flow                     | Enables                                                                                                                                                                                          | Supported application types                                 |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| Authorisation code                      | User sign-in and access to web APIs on behalf of the user.                                                                                                                                       | Desktop, Mobile, Single-page app (SPA) (requires PKCE), Web |
| Client credentials                      | Access to web APIs by using the identity of the application itself. Typically used for server-to-server communication and automated scripts requiring no user interaction.                       | Daemon                                                      |
| Device code                             | User sign-in and access to web APIs on behalf of the user on input-constrained devices like smart TVs and IoT devices. Also used by CLI applications.                                            | Desktop, Mobile                                             |
| Implicit grant                          | User sign-in and access to web APIs on behalf of the user. _The implicit grant flow is no longer recommended - use authorisation code with PKCE instead._                                        | Single-page web app (SPA), Web                              |
| On-behalf-of (OBO)                      | Access from an "upstream" web API to a "downstream" web API on behalf of the user. The user's identity and delegated permissions are passed through to the downstream API from the upstream API. | Web API                                                     |
| Username/password (ROPC)                | Allows an application to sign in the user by directly handling their password. _The ROPC flow is NOT recommended_                                                                                | Desktop, Mobile                                             |
| Integrated Windows authentication (IWA) | Allows applications on domain or Microsoft Entra joined computers to acquire a token silently (without an UI interaction from the user.)                                                         | Desktop, Mobile                                             |

### Public Client and Confidential Client Applications

- A client is a software entity that has a unique identifier assigned by an identity provider.
- The different types differ based on their ability to authenticate securely with the authorisation server and to hold sensitive, identity proving info.
- **Public client applications** run on devices, such as desktop, browserless APIs, mobile or client-side browser apps.
  - They can't be trusted to safely keep application secrets, so they can only access web APIs on behalf of the user.
  - Anytime the source, or compiled bytecode of a given app, is transmitted anywhere it can be read, disassembled, or otherwise inspected by untrusted parties.
  - As they also only support public client flows and can't hold configuration time secrets, they can't have client secrets.
- **Confidential client applications** run on servers, such as web apps, web API apps, or service/daemon apps.
  - They're considered difficult to access by users or attackers, and therefore can adequately hold configuration-time secrets to assert proof of its identity.
  - The client ID is exposed through the web browser, but the secret is passed only in the back channel and never directly exposed.

## Initialising

### Client Applications

- The recommended way to instantiate an application with MSAL.NET 3.x is by using the application builders: `PublicApplicationBuilder` and `ConfidentialClientApplicationBuilder`.
- You can configure the app through the code, a config file, or a mixture of both.
- Before initialising, you need to register it so that your app can be integrated with the Microsoft identity platform.
- After registration, you may need the following info (found in the portal):
  - **Application (client) ID**
  - **Directory (tenant) ID**
  - The identity provider URL and the sign-in audience for you application.
  - **Client credentials**
  - Set the **Redirect URI** where the identity provider will contact back your application with the security tokens.

### Public & Confidential Client Applications from Code

- The following instantiates a public client app, signing users in through the Microsoft public cloud, with their work and school accounts, or their personal Microsoft accounts.

```cs
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId).Build();
```

- The following instantiates a confidential app handling tokens from users in the Microsoft Azure public cloud, with their work and school accounts or personal Microsoft accounts.
- The app is identified with the identity provider by sharing a client secret

```cs
string redirectUri = "https://myapp.azurewebsites.net";
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithClientSecret(clientSecret)
    .WithRedirectUri(redirectUri )
    .Build();
```

### Builder Modifiers

- `.WithAuthority` modifier: sets the application default authority to Microsoft Entra authority, with the possibility of choosing the Azure Cloud, the audience , the tenant, or providing directly the authority ID.

```cs
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
    .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
    .Build();
```

- `.WithRedirectUri` modifier: overrides the default redirect URI.

```cs
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(client_id)
    .WithAuthority(AzureCloudInstance.AzurePublic, tenant_id)
    .WithRedirectUri("http://localhost")
    .Build();
```

| Modifier                                              | Description                                                                                                                                                                               |
| :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.WithAuthority()`                                    | Sets the application default authority to Microsoft Entra authority, with the possibility of choosing the Azure Cloud, the audience , the tenant, or providing directly the authority ID. |
| `.WithTenantId(string tenantId)`                      | Overrides the tenant ID, or the tenant description.                                                                                                                                       |
| `.WithClientId(string)`                               | Overrides the client ID.                                                                                                                                                                  |
| `.WithRedirectUri(string redirectUri)`                | Overrides the default redirect UTI. Useful for scenarios requiring a broker.                                                                                                              |
| `.WithComponent(string)`                              | Sets the name of the library using MSAL.NET (for telemetry reasons).                                                                                                                      |
| `.WithDebugLoggingCallback()`                         | If called, the application calls `Debug.Write` simply enabling debugging traces.                                                                                                          |
| `WithLogging`                                         | If called, the app calls a callback with debugging traces.                                                                                                                                |
| `.WithTelemetry(TelemetryCallback telemetryCallback)` | Sets the delegate used to send telemetry.                                                                                                                                                 |

- The modifiers specific to a confidential client application builder can be found in the `ConfidentialClientApplicationBuilder` class.
- Modifiers like `.WithCertificate(X509Certificate2 certificate)` and `.WithClientSecret(string clientSecret)` are mutually exclusive, if you provide both MSAL will throw an exception.

## Shared Access Signatures

- SAS is a URI that grants restricted access rights to Azure Storage resources.
- You can give them to clients to grant them delegate access to certain storage account resources.
- It includes a token that contains a special set of query parameters.
  - It indicates how the resources might be accessed by the client.
  - One query parameter, the signature, is constructed from the SAS parameters and signed with the key that was used to create the SAS.
- Types of SAS:
  - **User delegation SAS**: A user delegation SAS is secured with Microsoft Entra credentials and also by the permissions specified for the SAS. Applies to Blob storage only.
  - **Service SAS**: A service SAS is secured with the storage account key, it delegates access to a resource in the following Azure Storage services: Blob storage, Queue storage, Table storage, or Azure files.
  - **Account SAS**: An account SAS is secured with the storage account key, delegating access to resources in one or more of the storage services. All of the operations available via a service or user delegation SAS are also available via an account SAS.
- It is recommended to use Microsoft Entra credentials where possible rather than the account key, which can be more easily compromised.

### How does it work?

- You need 2 components to access data stored in Azure Storage:
  - URI to the resource you want access.
  - SAS token that you've created to authorise access to that resource.
- A URI like: `https://medicalrecords.blob.core.windows.net/patient-images/patient-116139-nq8z7f.jpg?sp=r&st=2020-01-20T11:42:32Z&se=2020-01-20T19:42:32Z&spr=https&sv=2019-02-02&sr=b&sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D` can be broken into its 2 parts.
  - URI: `https://medicalrecords.blob.core.windows.net/patient-images/patient-116139-nq8z7f.jpg?`
  - SAS token: `sp=r&st=2020-01-20T11:42:32Z&se=2020-01-20T19:42:32Z&spr=https&sv=2019-02-02&sr=b&sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D`
- SAS token breakdown below:

| Component                                              | Description                                                                                                                      |
| :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `ap=r`                                                 | Controls access rights. Values can be `a` for add, `c` for create, `d` for delete, `l` for list, `r` for read, or `w` for write. |
| `st=2020-01020T19:42:32Z`                              | The date and time when access starts.                                                                                            |
| `se=2020-01-20T19:42:32Z`                              | The date and time when access ends, this example grants 8 hours of access.                                                       |
| `sv=2019-02-02`                                        | The version of the storage API to use.                                                                                           |
| `sr=b`                                                 | The kind of storage being accessed> In this example, b is for blob.                                                              |
| `sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D` | The cryptographic signature.                                                                                                     |

### Best Practices

- To securely distribute a SAS and prevent man-in-the-middle attacks, always use HTTPS.
- The most secure SAS is a user delegation SAS. Use it wherever possible because it removes the need to store your storage account key in code. You must use Microsoft Entra ID to manage credentials. This option might not be possible for your solution.
- Try to set your expiration time to the smallest useful value. If SAS key becomes compromised, it can be exploited for only a short time.
- Apply the rule of minimum-required privileges. Only grant the access that's required. For example, in your app, read-only access is sufficient.
- There are some situations where a SAS isn't the correct solution. When there's an unacceptable risk of using a SAS, create a middle-tier service to manage users and their access to storage.

### When to use SAS

- Use SAS when you want to provide secure access to resources in your storage account to any client who doesn't otherwise have permissions to those resources.
- A common scenario where SAS is useful is a service where users read and write their own data to your storage account.
- There are 2 typical design patterns for scenarios where a storage account stores user data:
  - Clients upload and download data via a front-end proxy service, which performs authentication. This front-end proxy service has the advantage of allowing validation of business rules, but for large amounts of data or high-volume transactions, creating a service that can scale to match demand may be expensive or difficult.
  - A lightweight service authenticates the client as needed and then generates a SAS. Once the client application receives the SAS, they can access storage account resources directly with the permissions defined by the SAS and for the interval allowed by the SAS. The SAS mitigates the need for routing all data through the front-end proxy service.
- Many real-world services may use a hybrid of these 2 approaches.
- A SAS is required to authorise access to the source object in a copy operation in certain scenarios:
  - When you copy a blob to another blob that resides in a different storage account, you must use a SAS to authorise access to the source blob. You can optionally use a SAS to authorise access to the destination blob as well.
  - When you copy a file to another file that resides in a different storage account, you must use a SAS to authorise access to the source file. You can optionally use a SAS to authorise access to the destination file as well.
  - When you copy a blob to a file, or a file to a blob, you must use a SAS to authorise access to the source object, even if the source and destination objects reside within the same storage account.

## Stored Access Policies

- Provides an extra level of control over service-level shared access signatures on the server side.
- You can use a stored access policy to change the start time, expiry time, or permissions for a signature, or to revoke it after it is issued.
- The following storage resources support stored access policies:
  - Blob containers.
  - File shares.
  - Queues.
  - Tables.

### Creating a Stored Access Policy

- You can specify in either the policy or the URI, you can do combinations but YOU CAN'T specify the same parameter in both.

```cs
BlobSignedIdentifier identifier = new BlobSignedIdentifier
{
    Id = "stored access policy identifier",
    AccessPolicy = new BlobAccessPolicy
    {
        ExpiresOn = DateTimeOffset.UtcNow.AddHours(1),
        Permissions = "rw"
    }
};

blobContainer.SetAccessPolicy(permissions: new BlobSignedIdentifier[] { identifier });
```

```bash
az storage container policy create
  --name <stored access policy identifier>
  --container-name <container name>
  --start <start time UTC datetime>
  --expiry <expiry time UTC datetime>
  --permissions <(a)dd, (c)reate, (d)elete, (l)ist, (r)ead, or (w)rite>
  --account-key <storage account key>
  --account-name <storage account name>
```

### Modifying or Revoking

- To **modify** you can call the access control list operation for the resource type to replace the existing policy.
- For example, if your existing policy grants read and write permissions to a resource, you can modify it to grant only read permissions for all future requests.
- To **revoke** you can delete it, rename it by changing the signed identifier, or change the expiry time to a value in the past.
  - Changing the signed identifier breaks the associations between any existing signatures and the stored access policy.
  - Changing the expiry time to a value in the past causes any associated signatures to expire.
  - Deleting or modifying the stored access policy immediately affects all of the SAS associated with it.
- To **remove** call the resource's `Set ACL` operation, passing in the set of signed identifiers that you wish to maintain on the container.
- To remove ALL access policies from the resource, call the `set ACL` operation with an empty request body.

---

[Return](../)

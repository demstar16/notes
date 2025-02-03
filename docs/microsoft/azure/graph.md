# Microsoft Graph

- Is the gateway to data and intelligence in M365.
- Provides a unified programmability model that you can use to access the tremendous amount of data in m365, Windows 10, and Enterprise Mobility + Security.
- In M365, 3 main components facilitate the access and flow of data:
  - **Microsoft Graph API** offering a single endpoint (`https://graph.microsoft.com`).
    - You can use REST APIs or SDKs to access the endpoint.
    - Microsoft Graph also includes a powerful set of services that manage user and device identity, access, compliance, security, and help protect orgs from data leakage or loss.
  - **Microsoft Graph connectors** work in the incoming direction, delivering data external to the Microsoft cloud into Microsoft Graph services and applications, to enhance M365 experiences such as Microsoft Search.
  - **Microsoft Graph Data Connect** provides a set of tools to streamline secure and scalable delivery of Microsoft Graph data to popular Azure data stores.
    - The cached data serves as data sources for Azure development tools that you can use to build intelligent applications.

## Querying using REST

- To read from or write to a resource such as a user or an email message, construct a request that looks like the following: `{HTTP method} https://graph.microsoft.com/{version}/{resource}?{query-parameters}`.
- The components of a request include:
  - `{HTTP method}`: The HTTP method used on the request to Microsoft Graph.
  - `{version}`: The version of the Microsoft Graph API your application is using.
  - `{resource}`: The resource in Microsoft Graph that you're referencing.
  - `{query-parameters}`: Optional OData query options or REST method parameters that customise the response.
- After you make a request, a response is returned that includes:
  - Status code.
  - Response message.
  - `nextLink`: If your request returns numerous data, you need to page through it by using the URL returned in `@odata.nextLink`.

### HTTP Methods

- The API supports the following methods:

| Method | Description                                 |
| :----- | :------------------------------------------ |
| GET    | Read data from a resource                   |
| POST   | Create a new resource, or perform an action |
| PATCH  | Update a resource with new values           |
| PUT    | Replace a resource with a new one           |
| DELETE | Remove a resource                           |

- For CRUD methods like `GET` and `DELETE`, no request body is needed.
- The `POST`, `PATCH` and `PUT` methods require a request body specified in JSON format that contains additional info.

### Version

- Microsoft Graph supports 2 versions: `v1.0` and `beta`.
  - `v1.0` includes generally available APIs, use it for all production apps.
  - `beta` includes APIs that are currently in preview.

### Resource

- A resource can be an entity or complex type, commonly defined with properties.
- Entities differ from complex types by always including an `id`.
- Top-level resources often include _relationships_, which you can use to access other resources, like `me/messages` or `me/drive`.
- You can interact with resources using _methods_; for example, to send an email, use `me/sendMail`.
- Each resource might require different permissions to access it.

### Query Parameters

- Can be OData system query options, or other strings that a method accepts to customise its response.
- You can use these optional OData system query options to include more or fewer properties than the default response, filter the response for items that match a custom query, or provide another parameters for a method.
- For example, adding the following `filter` parameter restricts the messages returned to only those with the `emailAddress` property of `jon@contoso.com`: `GET https://graph.microsoft.com/v1.0/me/messages?filter=emailAddress eq 'jon@contoso.com'`

## Querying using SDK

- Designed to simplify building high-quality, efficient, and resilient applications that access Microsoft Graph.
- 2 main components:
  - **Service Library**: contains models and request builders that are generated from Microsoft Graph metadata to provide a rich and discoverable experience.
  - **Core Library**: provides a set of features that enhance working with all the Microsoft Graph services.

### Creating a Microsoft Graph Client

- A Microsoft Graph client is designed to make it simple to make calls to Microsoft Graph.
- Below is an example that shows how to create an instance of a Microsoft Graph client.
  - The authentication provider handles acquiring access tokens for the application.
  - The different application providers support different client scenarios.

```cs
var scopes = new[] { "User.Read" };

// Multi-tenant apps can use "common",
// single-tenant apps must use the tenant ID from the Azure portal
var tenantId = "common";

// Value from app registration
var clientId = "YOUR_CLIENT_ID";

// using Azure.Identity;
var options = new TokenCredentialOptions
{
    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
};

// Callback function that receives the user prompt
// Prompt contains the generated device code that you must
// enter during the auth process in the browser
Func<DeviceCodeInfo, CancellationToken, Task> callback = (code, cancellation) => {
    Console.WriteLine(code.Message);
    return Task.FromResult(0);
};

// /dotnet/api/azure.identity.devicecodecredential
var deviceCodeCredential = new DeviceCodeCredential(
    callback, tenantId, clientId, options);

var graphClient = new GraphServiceClient(deviceCodeCredential, scopes);
```

### Read information from Microsoft Graph

```cs
// GET https://graph.microsoft.com/v1.0/me

var user = await graphClient.Me
    .GetAsync();
```

### Retrieve a list of entities

```cs
// GET https://graph.microsoft.com/v1.0/me/messages?$select=subject,sender&$filter=<some condition>&orderBy=receivedDateTime

var messages = await graphClient.Me.Messages
    .Request()
    .Select(m => new {
        m.Subject,
        m.Sender
    })
    .Filter("<filter condition>")
    .OrderBy("receivedDateTime")
    .GetAsync();
```

### Delete an entity

```cs
// DELETE https://graph.microsoft.com/v1.0/me/messages/{message-id}

string messageId = "AQMkAGUy...";
var message = await graphClient.Me.Messages[messageId]
    .Request()
    .DeleteAsync();
```

### Create a new entity

```cs
// POST https://graph.microsoft.com/v1.0/me/calendars

var calendar = new Calendar
{
    Name = "Volunteer"
};

var newCalendar = await graphClient.Me.Calendars
    .Request()
    .AddAsync(calendar);
```

## Best Practices

### Authentication

- To access data in MS Graph, your app needs to acquire an OAuth 2.0 access token, and present it to MS Graph in either of the following methods:
  - The HTTP Authorisation request header, as a _Bearer_ token.
  - The graph client constructor, when using a MS Graph client library.
- Use MS Authentication Library API, MSAL to acquire the access token to MS Graph.

### Consent and Authorisation

- Use least privilege.
- Use the correct permission type based on scenarios.
  - CAUTION: Using application permissions for interactive scenarios can put your application at compliance and security risk. Be sure to check user's privileges to ensure they don't have undesired access to information, or are circumnavigating policies configured by an admin.
- Consider the end user and admin experience:
  - Configure you application to request permissions appropriately.
  - Ensure that you understand the difference between static, dynamic, and incremental consent.
- Consider multi-tenant applications, expect customers to have various application and consent controls in different states. For example:
  - Tenant admins can disable the ability for end users to consent to applications. In this case, an admin would need to consent on behalf of their users.
  - Tenant administrators can set custom authorisation policies such as blocking users from reading other user's profiles, or limiting self-service group creation to a limited set of users. In this case, your application should expect to handle 403 error response when acting on behalf of a user.

### Handle Responses Effectively

- Your applications should be prepared to handle different types of response.
- Below are some of the most important practices to follow to ensure that your application behaves reliably and predictably for your end users.
  - **Pagination**: When querying resource collections, you should expect that Microsoft Graph returns the result set in multiple pages, due to server-side page size limits. Your application should always handle the possibility that the responses are paged in nature, and use the `@odata.nextLink` property to obtain the next paged set of results, until all pages of the result set are read. The final page doesn't include a `@odata.nextLink` property.
  - **Evolvable enumerations**: Adding members to existing enumerations can break applications already using these enums. Evolvable enums are a mechanism that MS Graph API uses to add new members to existing enumerations without causing a breaking change for applications. By default, a GET operation returns only known members for properties of evolvable enum types and your application needs to handle only the known members. if you design your application to handle unknown members as well, you can opt in to receive those members by using an HTTP `Prefer` request header.

### Storing Data Locally

- Your app should ideally make calls to MS Graph to retrieve data in real time as necessary.
- You should only cache or store data locally necessary for a specific scenario, and if that use case is covered by your terms of use and privacy policy, and doesn't violate the MS APIs Terms of Use.
- Your app should also implement proper retention and deletion policices.

# API Management

- Helps organisations publish APIs to external, partner, and internal developers to unlock the potential of their data and services.
- To use an API, developers subscribe to a product that contains that API, and then they can call the API's operation, subject to any usage policies that might be in effect.

## Management Components

- **Azure API Management** is made up of an _API gateway_, a _management plane_, and a _developer portal_.
- These are Azure-hosted and fully managed by default.
- The **API gateway** is the endpoint that:
  - Accepts API calls and routes them to appropriate backends.
  - Verifies API keys and other credentials presented with requests.
  - Enforces usage quotas and rate limits.
  - Transforms requests and responses specified in policy statements.
  - Caches responses to improve response latency and minimise the load on backend services.
  - Emits logs, metrics, and traces for monitoring, reporting, and troubleshooting.
- The **management plane** is the administrative interface where you set up your API program. Use it to:
  - Provision and configure API Management service settings.
  - Define or import API schema.
  - Package APIs into products.
  - Set up policies like quotas or transformations on the APIs.
  - Get insights from analytics.
  - Manage users.
- The **Developer portal** is an automatically generated, fully customisable website with the documentation of your APIs. Using the developer portal, you can:
  - Read API docs.
  - Call an API via the interactive console.
  - Create an account and subscribe to get API keys.
  - Access analytics on their own usage.
  - Download API definitions.
  - Manage API keys.

### Products

- Are how APIs are surfaced to developers.
- Products in API Management have one or more APIs, and are configured with a title, description, and terms of use.
- They can be **Open** or **Protected**.
  - Protected products must be subscribed to before they can be used.
  - Open products can be used without a subscription.
  - Subscription approval is configured at the product level and can either require admin approval, or be auto-approved.

### Groups

- Groups are used to manage the visibility of products to developers.
- API Management has the following immutable system groups:
  - **Administrators**: Manage API Management service instances and create the APIs, operations, and products that are used by developers. Azure subscription admins are members to this group.
  - **Developers**: Authenticated developer portal users that build applications using your APIs. Developers are granted access to the developer portal and build applications that call the operations of an API.
  - **Guests**: Unauthenticated developer portal users. They can be granted certain read-only access, like the ability to view APIs but not call them.
- Admins can create custom groups or use external groups in associated Microsoft Entra tenants.

### Developers

- Represent the user accounts in an API Management service instance.
- Developers can be created or invited to join by admins, or they can sign up from the Developer portal.
- Each developer is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

### Policies

- A collection of statements that are executed sequentially on the request or response of an API.
- Popular statements include format conversion from XML to JSON and call rate limiting to restrict the number of incoming calls from a developer, and many other policies are available.
- Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise.
- Policies can be applied at different scopes, depending on your needs: global (all APIs), a product, a specific API, or an API operation.

## API Gateways

- The API Management gateway, often referred to as _data plane_ or _runtime_, is the service component that's responsible for proxying API requests, applying policies, and collecting telemetry.
- An API gateway sits between client and services, acting as a reverse proxy, routing requests from clients to services.
- It is also capable of:
  - authentication
  - SSL termination
  - rate limiting
- Without a gateway clients send request directly to back-end services which can have some issues:
  - Complex client code, making the client keep track of multiple endpoints and handle failures.
  - Coupling between the client and backend.
  - A single operation might require calls to multiple services.
  - Each public-facing service must handle concerns such as authentication, SSL, and client rate limiting.
  - Services must expose a client-friendly protocol like HTTP or WebSocket (limiting the choice of communication protocols).
  - Services with public endpoints are a potential attack service.
- Gateway helps address these by decoupling clients from services.

### Managed Gateways

- Default gateway component that is deployed in Azure for every API Management instance in every service tier.
- All API traffic flows through Azure regardless of where backends implementing the APIs are hosted.

### Self-Hosted Gateways

- Optional, containerised version of the default managed gateway.
- Useful for hybrid and multi-cloud scenarios where there is a requirement to run the gateways off of Azure in the same environment where API backends are hosted.
- Enables customers with hybrid IT infrastructure to manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

## API Management Policies

- Policies allow the publisher to change the behaviour of the API through configuration.
- They are a collection of Statements that are executed sequentially on the request or response of an API.
- Can apply changes to the inbound request and the outbound response.
- _Policy expressions_ can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise.

### configuration

- A policy definition is a simple XML doc that describes a sequence of inbound and outbound statements.
- The config is divided into `inbound`, `backend`, `outbound`, and `on-error`.
- The series of specified policy statements is executed in order for a request and a response.

```xml
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <backend>
    <!-- statements to be applied before the request is forwarded to
         the backend service go here -->
  </backend>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies>
```

- If an error occurs during the processing of a request, any remaining steps are skipped and execution jumps to the statements in the `on-error` section.

### Expressions

- A policy expression is either:
  - a single C# statement enclosed in `@(expression)`.
  - a multi-statement C# code block, enclosed in `@{expression}`, that returns a value.
- Each expression has access to the implicitly provided `context` variable and an allowed subset of .NET Framework types.

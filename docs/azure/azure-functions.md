# Azure Functions

## What is it?

- Serverless solution that allows your system to react to events.
- A major benefit is being able to write specific code for a task without necessarily worrying about a whole system.

### Comparison with Logic Apps

- They both enable serverless workloads.
- Functions is a compute service whereas Logic Apps is a serverless workflow integration platform.
- Both can be used for **orchestration**: a collection of functions or steps (called actions in Logic Apps) that are executed to accomplish a complex task.
  - For Azure Functions you develop orchestrations by writing code and using the **Durable Functions extension**.
  - For Azure Logic Apps you create orchestrations by using a GUI or editing config files.

| Topic             | Azure Functions                                                       | Logic Apps                                                                                              |
| :---------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| Development       | Code-first (imperative)                                               | Designer-first(declarative)                                                                             |
| Connectivity      | About a dozen built-in binding types, write code for custom bindings  | Large collection of connectors, Enterprise Integration Pack for B2B scenarios, build custom connectors. |
| Actions           | Each activity is an Azure function; write code for activity functions | Large collection of ready-made actions                                                                  |
| Monitoring        | Azure Application Insights                                            | Azure portal, Azure monitor logs                                                                        |
| Management        | REST API, Visual Studio                                               | Azure portal, REST API, PowerShell, Visual Studio                                                       |
| Execution Context | Runs in Azure, or locally                                             | Runs in Azure, locally, or on premises                                                                  |

### Comparison with WebJobs

- Azure App Service WebJobs with the WebJobs SDK is a code-first integration service that is designed for devs.
- Azure Functions is built on the WebJobs SDK, leading to it sharing many of the same event triggers and connections to other Azure services.
- Things to consider when choosing between Azure Functions and WebJobs with the WebJobs SDK:

| Factor                                      | Functions                                                                                                                | WebJobs with WebJobs SDK                                                               |
| :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| Serverless app model with automatic scaling | Y                                                                                                                        | N                                                                                      |
| Develop and test in the browser             | Y                                                                                                                        | N                                                                                      |
| Pay-per-use pricing                         | Y                                                                                                                        | N                                                                                      |
| Integration with Logic Apps                 | Y                                                                                                                        | N                                                                                      |
| Trigger Events                              | Timer, Azure Storage queues and topics, Azure Cosmos DB, Azure Event Hubs, HTTP/WebHook (GitHub Slack), Azure Event Grid | Timer, Azure Storage queues and topics, Azure Cosmos DB, Azure Event Hubs, File system |

Azure Functions offer more dev productivity than Azure App Service WebJobs does, for most scenarios it is the best choice.

## Hosting Options

| Hosting Option        | Service              | Availability             | Container support |
| :-------------------- | :------------------- | :----------------------- | :---------------- |
| Consumption Plan      | Azure Functions      | Generally Available (GA) | None              |
| Flex Consumption Plan | Azure Functions      | Preview                  | None              |
| Premium Plan          | Azure Functions      | GA                       | Linux             |
| Dedicated Plan        | Azure Functions      | GA                       | Linux             |
| Container Apps        | Azure Container Apps | GA                       | Linux             |

Azure App Service infrastructure facilitates Azure Functions hosting on Linux and Windows VMs, the hosting option that's chosen dictates the following:

- How your function app is scaled.
- The resources available to each function app instance.
- Support for advanced functionality, such as Azure Virtual Network connectivity.
- Support for Linux containers.
- Costs for running your function code.

### Overview of the different Plans

- **Consumption Plan**:
  - Default
  - Pay for compute resources only when functions are running with automatic scale.
  - Instances of the Functions host are dynamically added and removed based on the number of incoming events.
- **Flex Consumption Plan**:
  - Get high scalability with compute choices, virtual networking and pay-as-you-go billing.
  - Instances of the Functions host are dynamically added and removed based on the configured per instance concurrency and the number of incoming events.
- **Premium Plan**:
  - Automatically scales based on demand using prewarmed workers.
  - A prewarmed worker runs an application with no delay after being idle.
  - You'd consider this plan in the following situations:
    - Your function apps run continuously, or pretty much continuously.
    - You want more control of your instances and want to deploy multiple function apps on the same plan with event-driven scaling.
    - You have a high number of small executions and a high execution bill, but low GB seconds in the Consumption Plan.
    - You need mor CPU or memory options than are provided by consumption plans.
    - Your code needs to run longer than the maximum execution time allowed on the Consumption Plan.
    - You require virtual network connectivity.
    - You want to provide a custom Linux image in which to run your functions.
- **Dedicated Plan**:
  - Run your functions within an App Service plan at regular App Service plan rates.
  - It is the best for long-running scenarios where Durable Functions can't be used.
  - Consider an App Service plan in the following situations:
    - You must have fully predictable billing, or you need to manually scale instances.
    - You want to run multiple web apps and function apps on the same plan.
    - You need access to larger compute size choices.
    - Full compute isolation and secure network access provided by an App Service Environment (ASE).
    - High memory usage and high scale (ASE).
- **Container Apps**:
  - Create and deploy containerised function apps in a fully managed environment hosted by Azure Container Apps.
  - Use the Azure Functions programming model to build event-driven, serverless, cloud native function apps.
  - Run your functions alongside microservices, APIs, websites, and workflows as container-hosted programs.
  - Consider hosting your functions on Container Apps in the following situations:
    - You want to package custom libraries with your function code to support line-of-business apps.
    - You need to migrate code execution from on-premises or legacy apps to cloud native microservices running in containers.
    - You want to avoid the overhead and complexity of managing Kubernetes clusters and dedicated compute.
    - You need the high-end processing power provided by dedicated CPU compute resources for your functions.

### Function App Timeout Duration

- The `functionTimeout` property in the _host.json_ project file specifies the timeout duration for functions in a function app.
- This property applies specifically to function executions.
- After the trigger starts the function execution, the function needs to return/respond within the timeout duration.

| Plan                  | Default | Max       |
| :-------------------- | :------ | :-------- |
| Consumption plan      | 5       | 10        |
| Flex Consumption plan | 30      | Unlimited |
| Premium plan          | 30      | Unlimited |
| Dedicated plan        | 30      | Unlimited |
| Container Apps        | 30      | Unlimited |

- Regardless of the function app timeout setting, 230 seconds is the maximum amount of time that a HTTP triggered function can take to response to a request.
- The default timeout for version 1.x of the Functions runtime is unlimited.
- Guaranteed for up to 60 minutes. OS and runtime patching, vulnerability patching, and scale in behaviours can still cancel function executions.
- In a Flex Consumption plan, the host doesn't enforce an execution time limit.
- When the minimum number of replicas is set to zero, the default timeout depends on the specific triggers used in the app.

## Scaling

### Scaling Behaviours of the different Hosting Plans

| Plan                  | Scale out                                                                                                                                                                                               | Max # instances                                                            |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------- |
| Consumption plan      | Event driven. Scales out automatically, even during high load periods. Function infrastructure scales CPU and memory resources by adding more instances based on the number of incoming trigger events. | **Windows**: 200, **Linux**: 20-100                                        |
| Flex Consumption plan | Per-function scaling. Event-driven scaling decisions are calculated on a per-function basis, which provides a more deterministic way of scaling the functions in your web app.                          | Limited only by total memory usage of all instances across a given region. |
| Premium plan          | Event driven. Scale out automatically based on the number of events that its functions are triggered on.                                                                                                | **Windows**: 100, **Linux**: 20-100                                        |
| Dedicated plan        | Manual/autoscale                                                                                                                                                                                        | 10-30, 100 (ASE)                                                           |
| Container Apps        | Event driven, scale out automatically by adding more instances of the Functions host, based on the number of events that its functions are triggered on.                                                | 10-300                                                                     |

- During scale-out, there's currently a limit of 500 instances per subscription per hour for Linux _1._ apps on a Consumption plan.
- In some regions, Linux apps on a Premium plan can scale to 100 instances.
- For specific limits for the various App Service plan options, see the App Service plan limits.
- On Container Apps, you can set the maximum number of replicas, which is honoured as long as there's enough cores quota available.

## Development

### Function Apps

- A function app provides an execution context in Azure in which your functions run.
- A function app is composed of one or more individual functions that are managed, deployed, and scaled together.
- All functions in a function app share the same pricing plan, deployment method, and runtime version.
- It is essentially a way to organise and collectively manage your functions.
- In `Functions 2.x` all functions in a function app must be authored in the same language, this wasn't a requirement in previous versions.

### Testing and Developing Locally

- Your local functions can connect to live Azure services and you can debug them on your local computer using the full Functions runtime.
- Due to limitations in the portal you should develop your functions locally and publish your code project to function app in Azure.
- [A good reference](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local)

### Local Project files

- The following files are in the project root folder regardless of language:
  - [`host.json`](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json): contains configurations options that affect all functions in a function app instance.
    - Other options are managed depending on where the function app is running:
      - **Deployed to Azure**: in your application settings.
      - **On local machine**: in the `local.settings.json` file.
  - `local.settings.json`: stores app settings, and settings used by local development tools. These settings are only used when you run locally.
    - Because this file may contain secrets (like connection strings) you should never store it in a remote repo.
  - Other functions depend on the language and specific functions.

### Synchronizing settings

- Local settings required by your app must also be present in the app settings of the deployed function app.
- You can download current settings from the function app to your local project.

## Connecting Functions to Azure services

- Azure functions take advantage of the application settings functionality of Azure App Service to help you more securely store strings, keys, and other tokens required to connect to other services.
- Application settings in Azure are stored encrypted and can be accessed at runtime bu your app as environment variable pairs.
- For Triggers and Bindings that require a connection property , you set the application setting name instead of the actual connection string.
  - Not possible to to configure a binding directly with a connection string or key.
- Default config provider uses ENV variables.

### Configure an identity-based connection

- When running in a Consumption or Elastic Premium plan, your app uses the `WEBSITE_AZUREFILESCONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` settings when connecting to Azure Files on the storage account used by your function app.
- Azure Files doesn't support using managed identity when accessing the file share.
- When hosted in the Azure Function service:
  - identity-managed connections use a managed identity.
  - System-assigned identity is the default.
  - You can specify a user-assigned identity with `credential` and `clientID` properties.
  - You can't configure a user-assigned identity with a resource ID.
  - When in local development, your developer identity is used instead.

### Grant permission to the identity

- Identities must have permissions to perform the intended actions.
- Typically done through assigning a role in **Azure RBAC** or by specifying the identity in an access policy (depending on the service you're connecting to.)
- **NOTE**: Some permissions might be exposed by the target service that are not necessary for all contexts. Where possible, adhere to the **principle of least privilege**.

---

[Return](../)

# App Service

## What Is It

- A HTTP-based service for hosting web applications, REST APIs and mobile back ends.
- Applications can run and scale on Windows and Linux based environments.
- Scaling horizontally and vertically is baked in.
- Supports containers, allowing us to deploy containerized web apps, or pull container images from a Azure Container Registry or Docker Hub.
- Provides out of the box continuous integration and deployment with **Azure DevOps services**, Github, Bitbucket, FTP, or local git repos.

## Limitations

- Isn't supported on Shared pricing tier.
- The Portal shows only features that currently work for Linux apps.
- When deployed to built-in images, your code and content are allocated a storage volume for web content, backed by Azure Storage.
  - The disk latency of this volume is higher and more variable than the latency of the container filesystem.
  - Apps that require heavy read-only access to content files might benefit from the custom container option, which places files in the container filesystem instead o fon the content volume.

## Linux

- App Service can host web apps natively on Linux for supported Application Stacks.
- It can also run custom Linux containers (Web App for Containers).
- Supported languages and frameworks in Linux include: Node.js, Java (JRE 8 & JRE 11), PHP, Python, .NET, and Ruby.
- If the runtime your app requires isn't supported in the built-in images, you can deploy it with a custom container.
- To get the current list of supported languages on linux run: `az webapp list-runtimes --os-type linux`

## Deployment Slots

- Is a powerful tool that enables you to preview, manage, test, and deploy your different development environments.
- It is also a live app with its own host name.
- App content and configuration elements can be swapped between two deployment slots, including the production slot.
- You can use a separate deployment slot instead of the default production slot when running in the Standard App Service Plan tier or better.
- **Standard, Premium, and Isolated** plan tiers support deployment to a specified deployment slot instead of the default production slot.
- Each app service plan supports a different number of deployment slots, see [here](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits)
- **NOTE:** when scaling out ensure that the target tier supports the number of slots your app already uses.
- When you create a new deployment slot, the new slot has no content, even if you clone the settings from a different slot.
- You can deploy to the slot from a different repo branch or a different repo.

### Benefits

- You can validate app changes in a staging deployment slot before swapping it with the production slot.
- Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into prod, eliminating downtime on deployment.
  - The traffic redirection is seamless, and no requests are dropped because of swap operations.
  - This whole workflow can be automated by configuring auto swap to pre-swap when validation isn't needed.
- After a swap, the previous production app is located in the staging slot.
  - If the changes swapped into production slot aren't as you expect, you can perform the same swap immediately to get your "last known good site" back.

### Slot Swapping

- App Service does the following to ensure the target slot doesn't experience downtime:
  - Apply the following settings from target slot to all instances of the source slot:
    - Slot-specific app settings and connection strings, if applicable.
    - Continuous deployment settings, if enabled.
    - App Service authentication settings, if enabled.
  - Wait for every instance in the source slot to complete its restart. If any instance fails to restart, the swap operation reverts all changes to the source slot and stops the operation.
  - If local cache is enabled, trigger local cache initialization by making a HTTP request to the application root ("/") on each instance of the source slot. Wait until each instance returns any HTTP response. Locale cache initialization causes another restart on each instance.
  - If auto swap is enabled with custom warm-up, trigger Application Initiation by making a HTTP request to the application root on each instance of the source slot.
    - If `applicationInitialization` isn't specified, trigger a HTTP request to the application root of the source slot on each instance.
    - If an instance returns any HTTP response, it's considered to be warmed up.
  - If all instances on the source slot are successfully warmed up, swap the 2 slots by switching the routing rules for the 2 slots. After this step, the target slot has the app that's previously warmed up in the source slot.
  - Now that the source slot has the pre-swap app previously in the target slot, perform the same operation by applying all setting and restarting the instances.
- To swap a staging slot with the production slot, make sure that the production slot is the target slot. This way, the swap operation doesn't affect your production app.
- Settings that change when a slot is swapped.

| Settings that are swapped                                                 | Settings that aren't swapped                           |
| :------------------------------------------------------------------------ | :----------------------------------------------------- |
| General settings, such as framework version, 32/64-bit, web sockets, etc. | Publishing endpoints                                   |
| App settings (can be configured to stick to a slot)                       | Custom domain names                                    |
| Connection strings (can be configured to stick to a slot)                 | Non-public certificates and TLS/SSL settings           |
| Handler mappings                                                          | Scale settings                                         |
| Public certificates                                                       | WebJobs schedulers                                     |
| Hybrid connections\*                                                      | Always On                                              |
| Azure Content Delivery Network\*                                          | Diagnostic log settings                                |
| Service endpoints\*                                                       | Cross-origin resource sharing (CORS)                   |
| Path mappings                                                             | Virtual network integration                            |
|                                                                           | Managed identities                                     |
|                                                                           | Settings that end with the suffix `_EXTENSION_VERSION` |

- Features marked with `*` are planned to be unswapped.
- To make a setting swappable add `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` in every slot of the app and set its value to 0 or false.
  - You can't make some settings swappable and others not, its all or none.
  - Managed identities are never swapped and are not affected by this override app settings.
-

## Service Plans

- Defines a set of compute resources for a web app to run.
- When you create an App Service plan in a certain region, a set of compute resources is created for that plan in that region.
- An App Service plan defines:
  - Operating System (Windows, Linux).
  - Region.
  - Number of VM instances.
  - Size of VM instances.
  - Pricing tier (Free, Shared, Basic, Standard, Premium, Premium V2, Premium V3, Isolated, Isolated V2).
- The pricing tier determines which features you get and how much you pay for the plan.
  - **Shared compute**: Free and Shared. Runs an app on the same Azure VM as other App Service apps. These tiers allocate CPU quotas to each app that runs on the shared resources, and the resources can't scale out.
    - These are designed to only be used for testing and development purposes, not production.
  - **Dedicated compute**: Basic, Standard, Premium, Premium V2, and Premium V3. Runs apps on dedicated Azure Vms. Only apps in the same App Service plan share the same compute resources. The higher the tier, the more VM instances are available to you to scale-out.
  - **Isolated**: Isolated, and Isolated V2. Runs dedicated Azure VMs on dedicated Azure Virtual Networks. Provides network isolation on top of compute isolation to your apps. It provides the maximum scale-out capabilities.
- You can potentially save money by putting multiple apps into one plan but this means they will all share the same compute resources which can potentially impact performance.
- You want to isolate your app into a new plan when:
  - The app is resource-intensive.
  - You want to scale the app independently from the other apps in the existing plan.
  - The app needs resources in a different geographical region.

### Running and Scaling

- In the Free and Shared tiers, an app receives CPU minutes on a shared VM instance and can't scale out.
- In the other tiers an app runs and scales as follows:
  - An app runs on all the VM instances configured in the plan.
  - If multiple apps are in the same plan, they all share the same VM instances.
  - If you have multiple deployment slots for an app, all deployment slots also run on the same VM instances.
  - If you enable diagnostic logs, perform backups, or run WebJobs, they also use CPU cycles and memory on these VM instances.
- The App Service plan is the **scale unit** of the App Service apps.
- The App Service plan can be scaled up or down at any time, it's as simple as changing the pricing tier of the plan.
- You can improve an apps performance by putting it into its own plan so it doesn't share resources (if it's in a plan with other apps.)

## Deploy to App Service

- Supports manual and automated deployment.
- **Automated deployments** are supported directly from several sources:
  - Azure DevOps Services: Push your code to Azure DevOps Services, build in the cloud, run tests generate a release from the code, and finally push your code to Azure Web App.
  - GitHub: When you connect your GitHub repo to Azure for automated deployment, any changes you push to your production branch on GitHub will be automatically deployed.
  - Bitbucket: Similar to GitHub.
- **Manual deployments**
  - Git: App Service web apps feature a Git URL that you can add as a remote repo. Pushing to the remote repo deploys your app.
  - CLI: `az webapp up` packages your app and deploys it, it can also create a new App Service web app for you if you haven't already created one.
  - Zip deploy: Use `curl` or something similar to send a ZIP of your app files to App Service.
  - FTP/S: FTP or FTPS is a traditional way of pushing your code to many hosting environments, including App Service.

### Use Deployment Slots

- Use deployment slots whenever possible when deploying a new production build.
  Using a Standard App Service Plan tier or better, you can deploy your app to a staging environment and then swap your staging and production slots.
  The **swap operation** warms up the necessary worker instances to match your production scale, eliminating downtime.
- Each designated branch in your pipeline (testing, staging, etc.) should be continuously deployed to a staging slot, allowing stakeholders to easily assess and test the deployed branch.

### Continuously Deploying Containers

- Deploy the image into a staging slot and swap into production to prevent downtime.
- The automation is more complex than code deployment because you have to push the image to a container registry and update the image tag on the webapp.
- Steps:
  - **Build and tag the image**: As part of the build pipeline, tag the image with the git commit ID, timestamp, or other identifiable info (don't use default "latest" tag).
  - **Push the tagged image**: Once its built and tagged, the pipeline pushes the image to our container registry.
  - **Update the deployment slot with the new image tag**: When the property is updated, the site will automatically restart and pull the container image.

## Authentication & Authorization

- You don't need to use the built-in authentication feature if you want to authenticate some other way, however it can save time if it suits your needs.
- The built-in authentication feature for App Service and Azure Functions provides out-of-the-box authentication with federated identity providers.
- Azure App Service allows you to integrate various auth capabilities into your web app or API without implementing them yourself.
- It's build directly into the system and doesn't need any language, SDK, expertise or code.
- You can integrate with multiple login providers like Google, X, Microsoft Entra ID.

### Identity Providers

Default Identity providers available:

- [Microsoft identity platform](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad) (`/.auth/login/aad`)
- [Facebook](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-facebook) (`/.auth/login/facebook`)
- [Google](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-google) (`/.auth/login/google`)
- [X](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-twitter) (`/.auth/login/twitter`)
- [Any OpenID Connect provider](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-openid-connect) (`/.auth/login/<providerName>`)
- [GitHub](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-github) (`/.auth/login/github`)

You can provide your user with any number of these sign-in options.

#### How It Works

- The authentication and authorization module runs in the same sandbox as your application code.
- When enabled every incoming HTTP request passes through it before being handed to your application code.
- The module handles:
  - Authentication of users and clients with the specified identity provider.
  - Validates, stores, and refreshes OAuth tokens issued by the configured identity provider.
  - Manages the authenticated session.
  - Injects identity information into HTTP request headers.
- **NOTE**: In Linux and containers this module runs in a separate container, isolated from your application code because it does not run in-process. No direct integration with specific language frameworks is possible.

### Authentication Flow

- Is the same for all providers but differs on whether you want to sign in with the provider's SDK.
- **Without SDK**: The app delegates federated sign-in to App Service. This delegation is typically the case with browser apps, which can present the provider's login page to that user. The server code manages the sign-in process and is referred to as _server-directed flow_ or _server flow_.
- **With SDK**: The app signs users in to the providers manually and then submits the authentication token to the App Service for validation. This is typically the case for browser-less apps, which can't present the provider's sign in page to the user. The app code manages the sign in process and is referred to as _client-directed flow_ or _client flow_.
- Steps without provider SDK:
  - Sign user in: Redirects client to `/.auth/login/<provider>`.
  - Post-authentication: Provider redirects client to `/.auth/login/<provider>/callback`.
  - Establish authenticated session: App Service adds authenticated cookie to response.
  - Serve authenticated content: Client includes authentication cookie in subsequent requests (automatically handled by browser.)
- Steps with providers SDK:
  - Sign user in: Client code signs user in directly with provider's SDK and receives auth token.
  - Post-authentication: Client code posts token from provider to `/.auth/login/<provider>` for validation.
  - Establish authenticated session: App Service returns its own authentication token to client code.
  - Serve authenticated content: Client code presents authentication token in `X-ZUMO-AUTH` header (automatically handled by Mobile Apps client SDKs.)

### Authorization Behaviour

You can configure App Service with different behaviours when an incoming request isn't authenticated.

- **Allow unauthenticated requests**:
  - This option defers authorization of unauthenticated traffic to your application code.
  - App Service will also pass along authentication info in the HTTP headers.
  - This option provides flexibility in handling anonymous requests and lets you present multiple sign-in providers to your users.
- **Require authentication**:
  - This option rejects any unauthenticated traffic to your app.
  - This rejection can be a redirect action to one of the configured identity providers.
  - A browser client is redirected to `/.auth/login/<<provider>` for the provider chosen.
  - If the request comes from a native mobile app, the returned response is a `HTTP 401 Unauthorized` response.
  - **NOTE**: Restricting access this way applies to calls to your app, which may not be desirable fro apps wanting a publicly available home page.

### Token Store

- App Service provides a built-in token store, which is a repository of tokens that are associated with the users of your web apps, APIs, or native mobile apps.
- When authentication is enabled with any provider, the token store is **immediately available** to your app.

### Logging and Tracing

- If you enable application logging, authentication and authorization traces are collected directly in your log files.
- If you see an auth error you didn't expect, you find all the details in the **application logs**.

## Networking Features

- By default apps hosted here are accessible directly through the internet and can reach only internet hosted endpoints.
- There are 2 main deployment types for App Service: Multi-tenant and Single-tenant.

### Default Behaviour

- The Free and Shared SKU plans host customer workloads on multi-tenant workers.
- The Basic and higher plans host customer workloads that are dedicated to only one App Service plan.
- All apps in a Standard App Service plan run on the same worker.
  - If you scale out the worker, all apps in that plan are replicated on a new worker for each instance in your plan.
- When you change a VM family, you get a different set of outbound addresses.
- The outbound addresses used by your app for making outbound calls are listed in the properties for your app.
  - Theses addresses are shared by all apps running on the same worker VM family in the App Service deployment.
  - You can see all the addresses that your app might use in a scale unit with the `possibleOutboundIpAddresses` property.
- To find outbound IP addresses currently used by your app you can run `az webapp show --resource-group <group_name> --name <app_name> --query outboundIpAddresses --output tsv`.
- To find all possible outbound IP addresses for your app, regardless of pricing tiers run `az webapp show --resource-group <group_name> --name <app_name> --query possibleOutboundIpAddresses --output tsv`.
-

### Multi-tenant

- Hosts App Service plans in the Free, Shared, Basic, Standard, Premium, PremiumV2, and PremiumV3 pricing SKUs (Stock keeping unit).
- The roles that handle incoming HTTP and HTTPS requests are called **frontends**.
- The roles that host the customer workload are called workers.
- All the roles in an App Service deployment exist in a multi-tenant network.
- Because there are many different customers in the same App Service scale unit, you can't connect the App Service network directly to your network.
- **Inbound features**:
  - App-assigned address
  - Access restrictions
  - Service endpoints
  - Private endpoints
- **Outbound features**:
  - Hybrid Connections
  - Gateway-required virtual network integration
  - Virtual network integration
- These features can be mixed and matched depending on your needs, with a few exceptions.
- Here are some inbound use cases of how to use App Service networking features to control traffic inbound to your app:
  - Support IP-based SSL needs for your app, achieved through _App-assigned address_.
  - Support unshared dedicated inbound address for your app, achieved through _App-assigned address_.
  - Restrict access to your app from a set of well-defined addresses, achieved through _Access restrictions_.

### Single-tenant

- Hosts isolated SKU App Service plans directly in your Azure Virtual network.

### Deploying Static HTML Web App

Get the resource group and app name as environment variables we can use.

```bash
resourceGroup=$(az group list --query "[].{id:name}" -o tsv)
appName=az204app$RANDOM #this can be whatever you want
```

Navigate to the root of the project we want to deploy and run the following.

```bash
az webapp up -g $resourceGroup -n $appName --html
```

This creates a webpage at this URL: `https:<appName>.azurewebsites.net`.  
To update the site, simply edit the files and then run the same command as above.

## Autoscaling

- Autoscaling enables a system to adjust the resources required to meet the varying demand from users, while controlling costs associated with the resources.
- Autoscaling requires you to configure autoscale rules that specify the conditions under which resources should be added or removed.
- There are 2 types of autoscaling in Azure App Service:
  - Azure autoscale: Makes scaling decisions based pre-defined rules.
  - Azure App Service automatic scaling: Makes scaling decisions based on the parameters you select.
- Autoscaling performs scaling in and out.

### Azure App Service Autoscaling

- Monitors resource metrics of a web app as it runs.
- Detects situations where other resource are required to handle an increase in workload, and ensure those resources are available before the system becomes overloaded.
- Responds to changes in the environment by adding or removing web servers and balancing the load between them.
- Doesn't effect the CPU power, memory, or storage capacity of the web servers powering the app, only the number of them (horizontal scaling).
- Autoscaling can deallocate resources when the workload has diminished.
- **Rules**:
  - You define them.
  - A rule specifies the threshold of a metric, and triggers an autoscale event when the threshold is crossed.
  - An example for why you need to be careful defining your rules: A DoS attack will result in a large-scale influx of incoming traffic and trying to handle a surge in requests caused by a DoS attack would be fruitless and expensive. We would rather discard these than process them.
    - A better solution would be to implement detection and filtering of requests that occur during such an attack before they reach your service.
- **When to consider autoscaling?**
  - When you need elasticity for services (eg. you might get more traffic during school holidays.)
  - If you require high availability and fault tolerance.
  - If you are doing complex processing, autoscaling may not be the solution. You may just need more compute power for that instance.
  - Isn't the best approach to handle long-term growth.
  - It has an overhead associated with monitoring resources and determining whether to trigger a scaling event.
    - Manually scaling the system can sometimes be a more cost-effective approach.
  - The server becomes susceptible to downtime or lack of availability as if you have to spin up a lot of servers due to increase workload, you may have wait times as the instances spin up.

### Azure App Service Automatic Scaling

- Is a new **scale-out** option that automatically handles scaling decisions for your web apps and App Service plans.
- With this option you can just adjust scaling settings to improve your app's performance and avoid cold start issues.
- The platform prewarms instances to act as a buffer when scaling out, ensuring smooth performance.
- You are **charged per second** for every instance, including prewarmed instances.
- A few scenarios where you should scale-out automatically:
  - You don't want to set up autoscale rules based on resource metrics.
  - You want your web apps within the same App Service plan to scale differently and independently of each other.
  - Your web app is connected to a database, which may not scale as fast as the web app. Scaling automatically allows you to set the max number of instances your App Service Plan can scale to. This helps the web app to not overwhelm the backend.

### Identifying Autoscale Factors

#### App Service Plan

- Autoscaling is a feature of the App Service Plan used by the web app.
- When the web app scales out, Azure starts new instances of the hardware defined by the plan to the app.
- There is an instance limit to prevent runaway autoscaling.
- Not all App Service Plan pricing tiers have auto scaling, and out of the ones that do, the more expensive it is the higher the instance limit.

#### Autoscale Conditions

- You can either scale based on a **metric** or **instance count according to a schedule**.
- If you need to scale out incrementally, you can combine the 2 in the same autoscale condition.
- You can create multiple autoscale conditions to handle different schedules and metrics.
- Azure will autoscale your service when any of your conditions apply.

#### Metrics for Autoscale Rules

- **CPU Percentage**: Indication of CPU utilisation across all instances. A high value shows that instances are becoming CPU-bound, which could cause delays in processing client requests.
- **Memory Percentage**: Captures the memory occupancy of the app across all instances. A high value indicates that free memory could be running low.
- **Disk Queue Length**: A measure of the number of outstanding I/O requests across all instances. A high value means that disk contention could be occurring.
- **Http Queue Length**: Shows how many client requests are waiting for processing by the web app. A large number means client requests might fail with a 408 (timeout errors).
- **Data in**: The number of bytes received across all instances.
- **Data out**: This metric is the number of bytes sent by all instances.
- It is also possible to scale out based on metrics for other Azure services.

#### How a Rule Analyses Metrics

- Autoscaling works by analysing trends in metric values over time across all instances.
- It's a multi-step process:
  1. Rule aggregates values retrieved for a metric for all instances across a period of time (**time grain**). Each metric has its own intrinsic time grain (generally 1 min). The aggregated value is known as the **time aggregation**.
  2. Perform a further aggregation of the value calculated by the time aggregation over a longer, user-specified period, known as the **Duration**.

### Enabling Autoscale

- Not all pricing tiers support autoscaling:
  - Development pricing tiers are either limited to a single instance, **F1** and **D1** tiers, or they only provide manual scaling, **B1** tier.
  - You need to scale up to **S1** or any of the **P** tiers for full autoscaling.
- Default behaviour is Manual Scaling.
- You can change this to "Custom autoscale" which lets you create conditions based on metrics to determine when to scale.
- The default scale condition is executed when none of the other scale conditions are active.
- A metric based scale condition contains one or more scale rules, these rules define the criteria that indicate when a rule should trigger an autoscale action, and the autoscale action to be performed.

#### Monitoring

- You can monitor when autoscaling has occurred through the `Run history` chart, showing how the number of instances vary over time, along with which autoscale conditions caused each change.

### Autoscale Best Practices

#### Concepts

- An autoscale setting scales instances horizontally, which is _out_ by increasing the instances and _in_ by decreasing the instances. There is a max, min, and default value of instances.
- An autoscale job always reads the associated metric ot scale by, checking if it has crossed the configured threshold for scale-out or scale-in.
- All thresholds are calculated at an instance level (eg. scale out by one instance when average CPU > 80% when instance count is 2).
- All autoscale successes and failures are logged to the Activity Log, the activity log alert can be configured to send notifications via email, SMS, or webhooks.

#### Best Practices

- **Ensure the max and min values are different and have an adequate margin between them**
- **Choose the appropriate statistic for your diagnostics metric** (most common being `Average`)
- **Choose the thresholds carefully for all metric types**
  - A confusing example is when **flapping** occurs.
    - Increase instances by one count when `Thread Count >= 600`
    - Decrease instances by one count when `Thread Count <= 600`
    - Assume there are two instances to begin with and then the average number of threads per instance grows to 625.
    - Autoscale scales out adding a third instance.
    - Next, assume that the average thread count across instance falls to 575.
    - Before scaling in, autoscale tries to estimate what the final state will be if it scaled in. For example, 575 x 3 (current instance count) = 1,725 / 2 (final number of instances when scaled in) = 862.5 threads. This means autoscale would have to immediately scale out again even after it scaled in, if the average thread count remains the same or even falls only a small amount. However, if it scaled out again, the whole process would repeat, leading to an infinite loop.
    - To avoid this situation (termed "flapping"), autoscale doesn't scale in at all. Instead, it skips and reevaluates the condition again the next time the service's job executes. This can confuse many people because autoscale wouldn't appear to work when the average thread count was 575.
  - Below is a reasonable example:
    - Increase instances by 1 count when `CPU% >= 80`
    - Decrease instances by 1 count when `CPU% <= 60`
    - Assume there are 2 instances to start with.
    - If the average CPU% across instances goes to 80, autoscale scales out adding a third instance.
    - Now assume that over time the CPU% falls to 60.
    - Autoscale's scale-in rule estimates the final state if it were to scale-in. For example, 60 x 3 (current instance count) = 180 / 2 (final number of instances when scaled in) = 90. So autoscale doesn't scale-in because it would have to scale out again immediately. Instead, it skips scaling in.
    - The next time autoscale checks, the CPU continues to fall to 50. It estimates again - 50 x 3 instance = 150 / 2 instances = 75, which is below the scale-out threshold of 80, so it scales in successfully to 2 instances.
- **Considerations for scaling when multiple rules are configured in a profile**

  - Eg. On scale-out, autoscale runs if any rule is met. On scale-in, autoscale require all rules to be met.

- **Always select a safe default instance count**
- **Configure autoscale notifications**
  - Autoscale posts to the Activity Log if any of the following conditions occur:
    - Autoscale issues a scale operations.
    - Autoscale service successfully completes a scale action.
    - Autoscale service fails to take a scale action.
    - Metrics aren't available for autoscale service to make a scale decision.
    - Metrics are available (recovery) again to make a scale decision.
  - You can also monitor the health of the autoscale engine.

## Routing Traffic

- By default all client requests to the app's prod URL are routed to the production slot.
- You can route a portion of the traffic to another slot, which can be useful if you need user feedback for a new update but don't want it in production yet.
- To route production traffic you can navigate to the app's resource page and select `Deployment slots`, then adjust the percentages as you want.
- As a client, you can see what slot your session is pinned to be checking the `x-ms-routing name` cookie in your HTTP headers.
- **Routing to specific slots**: useful for when you want users to be able to opt in or out of your beta app.
- To route traffic manually you use the `x-ms-routing-name` query parameter.

---

[Return](../)

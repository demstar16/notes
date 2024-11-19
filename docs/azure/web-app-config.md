# Configuring Web App Settings

## Configure Application Settings

- App settings are variables passed as environment variables to the application code.
  - For Linux apps and custom containers, app settings are passed to the container using the `--env` flag to set the environment variable in the container.
- App Service settings override settings in `Web.config` or `appsettings.json` when working with ASP.NET.
- App settings are always encrypted when stored (**encrypted-at-rest**).
- **NOTE**: In a default Linux app service or custom Linux container, any nested JSON key structure in the app setting name like `ApplicationInsights:InstrumentKey` needs to be configured in App Service as `ApplicationInsights__InstrumentKey`. `:` should be replaced with `__` and `.` should be replaced with `_`.
- You can edit settings in bulk by doing an **Advanced Edit**.

### Configure Connection Strings

- Connection strings are similar to `<connectionsStrings>` in `Web.config` in ASP.NET.
- Values set in App service override the ones in `Web.config`.
- In general it is better to use app settings instead of connection strings due to connection strings requiring special formatting in the variable keys in order to access the values.
  - The only case where you may opt for connection strings over app settings when using a non-.NET language is: Certain Azure database types are backed up along with the app only if you configure a connection string for the database in your App Service app.
- **NOTE**: .NET apps targetting PostgreSQL should set the connection string to `Custom` as a workaround for a known issue in .NET EnvironmentVariablesConfigurationProvider.

### Configure Environment Variables for Custom Containers

- If your custom container uses environment variables that need to be supplied externally, you can pass them in via Cloud Shell.
- In Bash:

```bash
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings key1=value1 key2=value2
```

- In Powershell:

```powershell
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"DB_HOST"="myownserver.mysql.database.azure.com"}
```

- When the app runs, your settings are injected into the process as environment variables automatically.
- Verify container environment variables with this URL: `https://<app-name>.scm.azurewebsites.net/Env`

## Configure General Settings

Currently available settings:

- **Stack Settings**: Software stack to run the app, including the language and SDK versions.
  - For linux apps and custom container apps, you can set an optional start-up command or file.
- **Platform settings**: Configure settings for the hosting platform.
  - **Platform bitness**: 32-bit or 64-bit (Windows apps only).
  - **FTP state**: Allow only FTPS or disable FTP altogether.
  - **HTTP version**: Set to 2.0 to enable support for HTTPS/2 protocol.
    - Most modern browsers support HTTP/2 protocol over TLS only, while non-encrypted traffic continues to use HTTP/1.1.
    - To ensure that client browsers connect to your app with HTTP/2, secure your custom DNS name.
  - **Web sockets**: For ASP.NET SignalR or socket.io, for example.
  - **Always On**: Keeps the app loaded even when there's no traffic.
    - If not turned on the app will be unloaded after 20min (default).
    - The unloaded app can cause high latency due to warm up time.
    - When turned on, the front-end load balancer sends a GET request to the application root every 5min.
  - **ARR affinity**: In a multi-instance deployment, ensure that the client is routed to the same instance for the life of the session.
    - This can be set to OFF for stateless apps.
  - **HTTPS Only**: All HTTP traffic is directed to HTTPS.
  - **Minimum TLS version**: Select the minimum TLS encryption version required by your app.
- **Debugging**: Enable remote debugging for ASP.NET, ASP.NET Core, or Node.js apps.
  - This options turns off automatically after 48 hours.
- **Incoming client certificates**: Require client certificates in mutual authentication.
  - TLS mutual authentication is used to restrict access to your app by enabling different types of auth for it.

## Configure Path Mappings

- Allows you to configure handler mappings, and virtual application and directory mappings.
- You will have different options based on the OS type.

### Windows Apps

- Un-containerized
- You can customize the IIS handler mappings and virtual applications and directories.
- Handler mappings allow you to add custom script processors to handle requests for specific file extensions.
- Creating a new handler mapping requires the following configurations:
  - **Extension**: The file extension you want to handle (`*.php` for example)
  - **Script processor**: The absolute path of the script processor.
    - Requests to files that match the file extension are processed by the script processor.
    - Use the path that refers to your app's root directory: `D:\home\site\wwwroot`
  - **Arguments**: Optional command-line arguments for the script processor.
- Each app's default root path is mapped to `D:\home\site\wwwroot`, where code is deployed by default.
- You can configure virtual apps and directories by specifying each virtual directory and its corresponding physical path relative to the website root (`D:\home`).
- To mark a virtual directory as a web application, clear the **Directory** check box.

### Linux and Containerized Apps

- Containerized apps include all Linux apps and also the Windows and Linux custom containers running on App Service.
- You can add custom storage to your containerized apps, configurations include:
  - **Name**: Display name.
  - **Configuration options**: Basic or Advanced,
    - Basic if the storage account isn't using service endpoints, private endpoints, or Azure Key Vault.
    - Advanced otherwise.
  - **Storage accounts**: Storage account with the container you want.
  - **Storage type**: Azure Blobs or Azure Files.
    - Windows container apps only support Azure Files.
    - Azure Blobs only supports read-only access.
  - **Share name**: For advanced config, the file share name.
  - **Access key**: For advanced config, the access key.
  - **Mount path**: Absolute path in your container to mount the custom storage.
  - **Deployment slot setting**: When checked, the storage mount settings also apply to deployment slots.

## Diagnostic Logging

| Type                   | Platform       | Location                     | Description                                                                                                                                                                                                                                                                               |
| :--------------------- | :------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application Logging    | Windows, Linux | File system or storage blobs | Logs messages generated by application code. Each message is assigned one of the following categories: **Critical**, **Error**, **Warning**, **Debug**, **Info** or **Trace**.                                                                                                            |
| Web server logging     | Windows        | File system or storage blobs | Raw HTTP request data in the W3C extended log file format. Includes data like HTTP method, resource URI, client IP, client port, user agent, response code, etc.                                                                                                                          |
| Detailed error message | Windows        | File system                  | Copies of the .html error pages that would have been sent to the client browser. Detailed error pages should never be sent to the client in production (security reasons). App Service can save the error page each time an application error occurs that has a HTTP code 400 or greater. |
| Failed request tracing | Windows        | File system                  | Detailed tracing info on failed requests, including the IIS components used to process the request and the time taken in each component. One folder is generated for each failed request, which contains the XML log file, and the XSL stylesheet to view the log file with.              |
| Deployment logging     | Windows, Linux | File system                  | Helps determine why a deployment failed. This happens automatically and has no configurable settings.                                                                                                                                                                                     |

### Enable Application Logging in Windows

- To do it in the portal:
  - Navigate to your app and select **App Service logs**.
  - Select **On** for either Application logging (Filesystem) or Application Logging (Blob), or both.
    - Filesystem is for temporary debugging purposes and auto turns off after 12 hours.
    - Blob is long-term logging and needs a blob storage container to write logs to.
    - **NOTE**: If you regenerate your storage account's access keys, you must reset the respective logging config to use the updated access keys. To do this turn the logging feature off and on again.
  - You can also set the **Level** of details included in the log as shown

| Level       | Included Categories                                           |
| :---------- | :------------------------------------------------------------ |
| Disabled    | None                                                          |
| Error       | Error, Critical                                               |
| Warning     | Warning, Error, Critical                                      |
| Information | Info, Warning, Error, Critical                                |
| Verbose     | Trace, Debug, Info, Warning, Error, Critical (all categories) |

- When done press **Save**

### Enable Application Logging in Linux/Container

- In **App Service logs** set the **Application logging** option **File System**.
- In **Quota (MB)** specify the disk quota for the application logs. In **Retention Period (Days)**, set the number of days the logs should be retained.
- When done hit **Save**

### Enable Web Server Logging

- Select **Storage** to store logs on blob storage, or **File System** to store logs on the App Service file system.
- In **Retention Period (Days)**, set the number of days the logs should be retained.
- When finished hit **Save**.

### Add Log Messages in Code

- Use usual logging facilities.
- In ASP.NET apps for example:

```csharp
System.Diagnostics.Trace.TraceError("If you're seeing this, something bad happened");
```

- Python apps can use the **OpenCensus package** to send logs to the application diagnostics log.

### Stream Logs

- Before streaming logs in real time, you should specify the log type.
- Any info written to files ending in `.txt`, `.log` or `.htm` that are stored in the `/LogFiles` directory (`d:/home/logfiles`) is streamed by App Service.
- **NOTE**: Some types of logging buffer write to the log file, which can result in out of order events in the stream.
  - For example: An application log entry that occurs when a user visits a page may be displayed in the stream before the corresponding HTTP log entry for the page request.
- **Azure portal**: To stream logs navigate to your app and select **Log stream**.
- **Azure CLI**: To stream logs live in Cloud Shell, use: `az webapp log tail --name appname --resource-group myResourceGroup`.
- **Locale console**: To stream logs install Azure CLI and sign in. Then follow instructions above.

### Access Log Files

- If you configure the Azure Storage blobs option for a log type, you need a client tool that works with Azure Storage.
- For logs stored in App Service file system, the best way is to download the ZIP file in the browser at:
  - Linux/container apps: `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`
  - Windows apps: `https://<app-name>.scm.azurewebsites.net/api/dump`
- **NOTE**: For linux/container apps, the ZIP file contains console output logs for both the docker host and the docker container. For a scaled-out app, the ZIP file contains one set of logs for each instance. The file system log files are the contents of the `/home/LogFiles` directory.

## Configure Security Certificates

- App Service has tools that let you create, upload, or import a private or public certificate into it.
- A certificate uploaded into an app is stored in a deployment unit that's bound to the app service plan's resource group and region combination (internally is called a **webspace**).
  - This makes the certificated accessible to other apps in the same webspace.
- Adding certificates in App Service options:
- App Service Certificates are not supported in Azure National Clouds at the moment (25/10/2024).

| Option                                        | Description                                                                                                                                        |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create a free App Service managed certificate | A private cert that's free of charge and easy to use if you just need to secure your custom domain in App Service.                                 |
| Purchase an App Service certificate           | A private cert that's managed by Azure. It combines the simplicity of automated cert management and the flexibility of renewal and export options. |
| Import a certificate from Key Vault           | Useful if you use Azure Key Vault to manage your certificates.                                                                                     |
| Upload a private certificate                  | If you already have a private certificate from a third-party provider, you can upload it.                                                          |
| Upload a public certificate                   | Public certs aren't used to secure custom domains, but you can load them into you code if you need them to access remote resources                 |

### Private Certificate Requirements

- The App Service managed certificate and the App Service certificate already satisfy the requirements of App Service.
- A private cert in App Service must meet the following requirements:
  - Exported as a password-protected PFX file, encrypted using triple DES.
  - Contains private key at least 2048 bits long.
  - Contains all intermediate certificates and the root certificate in the certificate chain.
- To secure a custom domain in a TLS binding, the cert has other requirements:
  - Contains an Extended Key Usage for server authentication (OID = 1.3.6.1.5.5.7.3.1).
  - Signed by a trusted certificate authority.

### Creating a Free Managed Certificate

- To create custom TLS/SSL bindings or enable client certs for your App Service app, the plan must be in the _Basic_, _Standard_, _Premium_, or _Isolated_ tier.
- This type of certificate is a turn-key solution for securing your custom DNS name in App Service.
  - It's a TLS/SSL server cert that's fully managed by App Service and renewed continuously and automatically in six-month increments, 45 days before expiration.
  - You create the cert and bind it to a custom domain, and let App Service cook.
- **To keep in mind before you create a free managed cert**
  - Make sure you have met the prerequisites for your app.
  - Free certs are issued by DigiCert.
  - For some domains, you have to explicitly allow DigiCert as a certificate issuer by creating a CAA domain record with the value: `0 issue digicert.com`.
  - Avoid hard dependencies and "pinning" practice certificates to the managed certificate or any part of the certificate hierarchy.
- **Limitations**:
  - Doesn't support wildcard certificates.
  - Doesn't support usage as a client certificate by using certificate thumbprint, which is planned for deprecation and removal.
  - Doesn't support private DNS.
  - Isn't exportable.
  - Isn't supported in an App Service Environment (ASE).
  - Only supports alphanumeric characters, dashes (-) and periods (.).
  - Only custom domains of length up to 64 characters are supported.

### Import an App Service Certificate

- If you buy an App Service Certificate from Azure, Azure will manage:
  - Purchase process from the certificate provider.
  - Domain verification on the certificate.
  - Maintains the certificate in Azure Key Vault.
  - Certificate renewal.
  - Synchronizing the certificate automatically with the imported copies in App Service apps.
- If you already have a working App Service certificate, you can:
  - Import the cert into App Service.
  - Manage the certificate, such as renew, rekey and export it.

### General Best Practice
- Constantly check the **App Checker** when developing to ensure the app is performative and accessible.
- Use comments in your code, as it helps Copilot.
- Implement your own error handling if you want to avoid Microsoft's default technical error messages.
- Use collections where possible to avoid directly connecting with the data source more than you have to.
- Try and concurrently load the data you need at the start of the app. Utilise concurrency.
### Theming
You can use an empty component to store all your colours as properties. Then you just add the component to screens you need. Equates to less variables on your `App.OnStart`.

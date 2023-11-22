# Expo Auth Bug Demo

To reproduce the bug, first run the `docker-compose up` command to start the Keycloak server.

Then start an android emulator and install [this Expo Dev Build](https://expo.dev/accounts/ec_raphael/projects/auth-bug-demo/builds/86381e11-609f-4c2e-aca0-c54083e31ae0) on it or build your own from the code in the `mobile` directory and install that.

Then run the `npx expo start -a` command to start the Expo app.

Then try to login by tapping the login button. You should see the Keycloak login screen, switch to registration and create an account. Then the app will crash as it redirects.
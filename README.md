# MicroFe

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.2.

## Setup micro frontend from scratch

Step 1: Set Up the Angular Workspace
# 1. Create a new Angular workspace (Skip 'ng new' for first app)
ng new micro-frontend-chat --create-application=false
cd micro-frontend-chat

# 2. Create the Host/Shell application
ng generate application shell --routing --style=scss

# 3. Create the Remote/Micro-frontend application (the Chat App)
ng generate application chat --routing --style=scss --prefix chat


Step 2: Configure Module Federation
# 1. Install the plugin in your workspace
npm install @angular-architects/module-federation -D

# 2. Convert the ShellApp to a Module Federation Host
npx ng add @angular-architects/module-federation --project shell --port 4200 --type dynamic-host

# 3. Convert the ChatApp to a Module Federation Remote
npx ng add @angular-architects/module-federation --project chat --port 4201 --type remote

Example
# 1. Create a modern Angular workspace
ng new chat-mfe-native-workspace --create-application=false
cd chat-mfe-native-workspace

# 2. Create the Host (Shell) and Remotes (MFEs)
ng generate application shell --standalone --routing
ng generate application header --standalone --routing --prefix header
ng generate application user-list --standalone --routing --prefix user
ng generate application chat-window --standalone --routing --prefix chat

# 1. Install the plugin in your workspace
npm install @angular-architects/native-federation -D

# 2. Configure the Shell (Host) - Only need to define remotes here
npx ng add @angular-architects/native-federation --project shell --port 4200 --type dynamic-host

# 3. Configure the Remotes (MFEs) - Need to define exposed components/routes
npx ng add @angular-architects/native-federation --project header --port 4201 --type remote
npx ng add @angular-architects/native-federation --project users --port 4202 --type remote
npx ng add @angular-architects/native-federation --project chat --port 4203 --type remote

    "run:shell": "ng serve shell",
    "run:header": "ng serve header",
    "run:user-list": "ng serve user-list",
    "run:chat-window": "ng serve chat-window"

ng serve shell (or npm run run:shell)
ng serve header
ng serve user-list
ng serve chat-window

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# ng-jvx-multiselect workspace

Workspace of the [ng-jvx-multiselect](projects/ng-jvx-multiselect/README.md) Angular library.

| Project                     | Description                                                          |
|-----------------------------|----------------------------------------------------------------------|
| `projects/ng-jvx-multiselect` | The library (see its [README](projects/ng-jvx-multiselect/README.md)). |
| `projects/demo-sandbox`     | Demo app showcasing every feature, in English and Italian.           |
| `projects/mock-server`      | Dependency-free Node mock backend used by the remote examples.       |

## Scripts

| Command                | Description                                                                      |
|------------------------|----------------------------------------------------------------------------------|
| `npm start`            | Starts the mock server (port 3000) and the demo (`https://localhost:4300`).       |
| `npm run start:server` | Mock server only, restarted on changes.                                          |
| `npm run start:demo`   | Demo only; `/jvx-multiselect-test` is proxied to the mock server.                |
| `npm test`             | Unit tests (`npx nx test ng-jvx-multiselect --watch=false --browsers=ChromeHeadlessCI` for a single headless run). |
| `npm run build`        | Builds the library in watch mode.                                                |
| `npm run build-prod`   | Production build of the library in `dist/ng-jvx-multiselect`.                    |
| `npm run publish`      | Production build and `npm publish`.                                              |

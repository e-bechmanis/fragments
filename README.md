# CCP555 fragments back-end API

### Local Development

Install npm packages in root directory - ```npm install```

`npm run lint` <-- run to check if there are any errors to be fixed (will check for code consistency and potential bugs)

`npm start` <-- to start express server

`npm run dev` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code

`npm run debug` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code. This command also starts the node inspector on port 9229, so that debugger (i.e. VSCode debugger) can be attached

API will be available at http://localhost:8080

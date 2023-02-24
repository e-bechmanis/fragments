# CCP555 fragments back-end API

Fragments microservice is a cloud-based microservice that is being developed to work with different fragments of user data. It has functionality to add, retrieve and update the fragments for authenticated users. 

To this day, only basic functionality has been implemented. Microservice currently supports text/plain MIME type only. 

### Local Development

Install npm packages in root directory - ```npm install```

`npm run lint` <-- run to check if there are any errors to be fixed (will check for code consistency and potential bugs)

`npm start` <-- to start express server

`npm run dev` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code

`npm run debug` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code. This command also starts the node inspector on port 9229, so that debugger (i.e. VSCode debugger) can be attached

API will be available at http://localhost:8080

### Testing

`npm test` <-- run all tests using our jest.config.js configuration one-by-one

`npm test:watch` <-- same idea as test, but don't quit when the tests are finished. Instead, watch the files for changes and re-run tests when we update our code (e.g., save a file). 

`npm coverage` <-- same idea as test but collect test coverage information, so that we can see which files and lines of code are being tested, and which ones aren't.

When in testing mode, basic authentication flow is triggered using Passport.js, http-auth and http-auth-passport. This flow doesn't involve Cognito. Instead, it uses dummy user/password details.

# CCP555 fragments back-end API

Fragments microservice is a cloud-based microservice that is being developed to work with different fragments of user data. It has functionality to add, retrieve and update the fragments for authenticated users. 

Fragments have two parts: 1) metadata (details _about_ the fragment); and 2) data (the actual binary contents of the fragment).

The fragment's **metadata** is an object that describes the fragment in the following format:

```json
{
  "id": "30a84843-0cd4-4975-95ba-b96112aea189",
  "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
  "created": "2021-11-02T15:09:50.403Z",
  "updated": "2021-11-02T15:09:50.403Z",
  "type": "text/plain",
  "size": 256
}
```
The fragment's **data** is a `Buffer` type that represents binary blob of data.

To this day, only basic functionality has been implemented. Microservice currently supports text/plain MIME type only. 

## 1. Local Development

Install npm packages in root directory - ```npm install```

`npm run lint` <-- run to check if there are any errors to be fixed (will check for code consistency and potential bugs)

`npm start` <-- to start express server

`npm run dev` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code

`npm run debug` <-- will compile express server in development mode using nodemon, with "Debug" log level. Nodemon will ensure that app will automatically restart in case of any changes in the source code. This command also starts the node inspector on port 9229, so that debugger (i.e. VSCode debugger) can be attached

API will be available at http://localhost:8080

## 2. Testing

`npm test` <-- run all tests using our jest.config.js configuration one-by-one

`npm test:watch` <-- same idea as test, but don't quit when the tests are finished. Instead, watch the files for changes and re-run tests when we update our code (e.g., save a file). 

`npm coverage` <-- same idea as test but collect test coverage information, so that we can see which files and lines of code are being tested, and which ones aren't.

When in testing mode, basic authentication flow is triggered using Passport.js, http-auth and http-auth-passport. This flow doesn't involve Cognito. Instead, it uses dummy user/password details.

## 3. Routes

#### Health Check

An unauthenticated `/` route is available for checking the health of the service. If the service is running, it returns an HTTP `200` status along with the following body:

```json
{
  "status": "ok",
  "author": "Elena Bechmanis",
  "githubUrl": "https://github.com/e-bechmanis/fragments",
  "version": "0.0.1"
}
```

#### `POST /fragments`

Creates a new fragment for the authenticated user. The client posts a file (raw binary data) in the `body` of the request and sets the `Content-Type` header to the desired `type` of the fragment. The `type` must be one of the supported types. This is used to generate a new fragment metadata record for the data, and then both the data and metadata are stored.

If the `Content-Type` of the fragment being sent with the request is not supported, returns an HTTP `415` with an appropriate error message.

A successful response returns an HTTP `201`. It includes a `Location` header with a full URL to use in order to access the newly created fragment.

The `body` of the response includes the complete fragment metadata for the newly created fragment:

```json
{
  "status": "ok",
  "fragment": {
    "id": "30a84843-0cd4-4975-95ba-b96112aea189",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "type": "text/plain",
    "size": 256
  }
}
```

#### `GET /fragments`

Gets all fragments belonging to the current user (i.e., authenticated user). NOTE: if a user has no fragments, an empty array `[]` is returned instead of an error.

The response includes a `fragments` array of `id`s:

```json
{
  "status": "ok",
  "fragments": ["b9e7a264-630f-436d-a785-27f30233faea", "dad25b07-8cd6-498b-9aaf-46d358ea97fe"]
}
```

#### `GET /fragments/?expand=1`

Gets all fragments belonging to the current user (i.e., authenticated user), expanded to include a full representation of the fragments' metadata. For example, using `GET /fragments?expand=1` might return:

```json
{
  "status": "ok",
  "fragments": [
    {
      "id": "b9e7a264-630f-436d-a785-27f30233faea",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    },
    {
      "id": "dad25b07-8cd6-498b-9aaf-46d358ea97fe",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    },
    {
      "id": "fdf71254-d217-4675-892c-a185a4f1c9b4",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    }
  ]
}
```

#### `GET /fragments/:id`

Gets an authenticated user's fragment data (i.e., raw binary data) with the given `id`.


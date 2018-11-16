# node-js-site-monitor-api

A NodeJS site monitor API built without any 3rd parties packages

There is no package.json, so no need to do an `npm install`. Just run the following:

```
node index.js
```

Log with Node debugger

```
NODE_DEBUG=server node index.js
```

## API Calls - Users

URL: `/users`

Auth Required: NO

Method: `GET`

Data constraints: `{}`

### Success Response

Content:

```
{

}
```

URL: `/users`

Auth Required: NO

Method: `POST`

Data constraints:

```
{
    "firstName": "Zeeshan",
    "lastName": "Syed",
    "phone": "1231231233",
    "password": "newPassword",
    "tosAgreement": true
}
```

### Success Response

Content:

```
{

}
```

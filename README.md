## Claire AI - OATH2 Server

This repository holds the source code for the authentication server of the Claire AI Project. In this collaborative project, I developed an application responsible for user authentication within our mobile application context. Our team collectively crafted a mobile app alongside a set of REST APIs. These APIs serve to link an Internet of Things (IoT) device to the online realm, furnishing it with valuable insights.

Specifically, for our school project, I orchestrated the creation of an OAuth2 server. This server plays a vital role in an infrastructure akin to Google Home, which we constructed to interface with the IoT device we had built.

### Implemented flow
A user will be authenticated with the given credentials. After succesful authentication the client receives an access token to acces the api for user data server.
<img src="https://image.slidesharecdn.com/oauth2spring-150929104710-lva1-app6891/95/oauth2-and-spring-security-23-638.jpg?cb=1443523771">

### JOSE
In this project I used Jose libary to create JWT Tokens and encrypt JWT Payload data.

### Endpoints

#### Authorization endpoint: 

```js
'http://localhost:3080/oauth2/authorize'
```

After a user authorized they receive a grant token. This token is used to acces data specific to a device.
In this way a user can grant other users or 3rd parties to access their device data.

#### Acces token

```js
'http://localhost/oauth2/token'
```

This route is for creating an access token.
The client needs to include a grant token to create a token for a specific resource.

#### Authorization grant management endpoint: 

```js
'http://localhost/oauth2/devices'
```
This route is to check acces token associated with the device.
Returns all the associated grants

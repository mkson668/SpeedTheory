Speed Theory E-commerce application 

Libraries:
- express (nodejs backend)
- mongoose (mongoDB database)
- dotenv (for separating secrets from source code in .env files)
- nodemon (helps restart node server when change are detected)
- crypto-js for encrypting passwords

development setup:
- add nodemon to package.json, and run yarn start to activate nodemon
- mongoDB cluster username and password credentials on account

Project description:
This will be an e-commerce webapp  that aims to serve as a replacement for the 
current application http://www.speedtheory.ca/locations/vancouver/ utilized by
speedtheory, a vancouver based cycling and triathlon store. 

This new application will use MongoDB, Express, React, and Nodejs for development.

Review:
- recall that for all async functions they will always return a promise
so we can always use .then().catch()

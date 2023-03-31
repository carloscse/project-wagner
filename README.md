# project-wagner

This project has been developed in NodeJS, MongoDB and ExpressJS. It is a Social Banking App where users can register and send connection requests to other users. When accepted, they are able to send transactions to each other.

All these transactions are stored in a CSV file to keep track of every movement.

Users have the opportunity of cancelling a transaction within the first minute after doing it.

The project includes two special files:

**THEPOWER.postman_collection.json:** is an export from the Postman environment. After login, it is needed to paste the token provided in the endpoint in the collection Bearer Token in order to authorize the rest of the endpoints.
**ThePower.pdf:** a document with the account number and passwords of the users in the database.

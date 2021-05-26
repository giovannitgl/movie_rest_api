# Movie Rest API
This project is just a simple test in creating a small Restful API using Express auto generating an OpenAPI schema.

To check the documentation for the api check the ``/docs`` url

Requirements (if no docker):
- Running Postgres instance
    - Make sure the URL for the connection is an env var: DATABASE_URL
    - Database is ``movies``


Attention: This repository was only tested in a Linux environments

Attention: This repository is not production ready

## How to run
### Docker Compose
Simply running docker-compose up is enough to start the project. The port 3000 will be exposed to the API and 5432 to postgres.

### Manually
Run the following commands:

``npm install``

``npm run typeorm migration:run``

``npm run start:dev ``

This will ensure the database schema is working correctly.

### Running tests:
``npm run test``
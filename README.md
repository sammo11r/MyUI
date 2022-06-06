# MyUI - Contextual UI Generator

This is the project for MyUI - a contextual UI generation tool. This is part of the Software Engineering Project for BCS students 2021-22 at the Eindhoven University of Technology.

Boilerplate author: Nishad Guha (n.guha1@student.tue.nl)

## Automated Project Setup

Run the command `make setup` in the project directory. This will build and run the docker containers, install frontend dependencies, create the database connection in Hasura as well as apply the migrations. Please select the created database in the last step when the Hasura CLI asks you to select which database you want to apply the migrations to.

Happy developing!

## Manual Steps to start a new project

1. Clone this repository
2. `cd` into the project folder
3. Run `npm i` to install all node dependencies
4. Run `yarn` to install all yarn dependencies
5. Make sure you do not have already running docker containers in this directory and run `make build-dev` to create the development environment.
6. Open Hasura console: `make console`
7. Check Hasura console for an existing database schema. If there are none, create a database schema under the `Data` tab called `Hasura-test`.
8. Close Hasura console with `Ctrl + C` and run all database migrations: `make run-migrations`
9. Open [http://localhost:3000](http://localhost:3000) to view the React frontend in the browser.

## Available Scripts

In the project directory, you can run:

### `make build-dev`

This builds and runs the containers in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view the React frontend in the browser.\
The page will reload if you make edits.

The Postgres database runs on port 5432.

### `make build-prod`

Builds the React app for production to the `build` folder and hosts it on an NGINX server.\
Open [http://localhost:8000](http://localhost:8000) to view the React frontend (production mode) in the browser.\
Your app is ready to be deployed!

### `make run-dev`

This runs the containers in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view the React frontend in the browser.\
The page will reload if you make edits.

The Postgres database runs on port 5432.

### `make run-prod`

This runs the React app for production and hosts it on an NGINX server.\
Open [http://localhost:8000](http://localhost:8000) to view the React frontend (production mode) in the browser.\
Your app is ready to be deployed!

### `make restart`

This restarts the all containers in the currently running environment.

### `make console`

This runs the Hasura console.
Open [http://localhost:9695](http://localhost:9695) to view the Hasura-GraphQL console in the browser.\
For any change made to the database in the Hasura console, a migration is automatically generated in the directory `./hasura/migrations`

### `make squash-migrations name=<insert-name> from=<insert-first-migration-to-squash>`

This squashes all the migrations in the hasura folder starting from the migration mentioned in the `from` argument. The `from` argument receives the ID of the migration from which you want to start squashing till the last migration available. Please also give the squashed migration a name with the `name` argument first. Whether you want to delete the previous migrations or not is your own choice.\
Squashed migrations are generated in the directory `./hasura/migrations`

### `npm run lint`

This checks the code quality for the entire project and gives a detailed list of errors.
In order to disable linting for a particular line, the comment `// eslint-disable-next-line` can be used.

### `make test`

This will run all available tests.

## Common Errors

### `'make' is not recognized as an internal or external command, operable program or batch file.`

1. Download Make for Windows: http://gnuwin32.sourceforge.net/packages/make.htm
2. Add the path (i.e. C:\Program Files (x86)\GnuWin32\bin) to your Path variable
3. Restart your pc

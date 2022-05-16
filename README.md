# MyUI - Contextual UI Generator

This is the project for MyUI - a contextual UI generation tool. This is part of the Software Engineering Project for BCS students 2021-22 at the Eindhoven University of Technology.

## Available Scripts

In the project directory, you can run:

### `make build-dev`

This builds and runs the containers in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view the React frontend in the browser.\
The page will reload if you make edits.

Open [http://localhost:8080](http://localhost:8080) to view the Hasura-GraphQL console in the browser.\
The Postgres database runs on port 5432.
### `make build-prod`

Builds the React app for production to the `build` folder and hosts it on an NGINX server.\
Open [http://localhost:8000](http://localhost:8000) to view the React frontend (production mode) in the browser.\
Your app is ready to be deployed!

### `make run-dev`

This runs the containers in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view the React frontend in the browser.\
The page will reload if you make edits.

Open [http://localhost:8080](http://localhost:8080) to view the Hasura-GraphQL console in the browser.\
The Postgres database runs on port 5432.

### `make run-prod`

This runs the React app for production and hosts it on an NGINX server.\
Open [http://localhost:8000](http://localhost:8000) to view the React frontend (production mode) in the browser.\
Your app is ready to be deployed!

### `npm run lint`

This checks the code quality for the entire project and gives a detailed list of errors.
In order to disable linting for a particular line, the comment `// eslint-disable-next-line` can be used.

## Common Errors
### `'make' is not recognized as an internal or external command, operable program or batch file.`
1. Download Make for Windows: http://gnuwin32.sourceforge.net/packages/make.htm
2. Add the path (i.e. C:\Program Files (x86)\GnuWin32\bin) to your Path variable
3. Restart your pc

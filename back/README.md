# Redspher calculator test project - Back
Project Node Express API with Typescript 
Server running on : [http://localhost:4001](http://localhost:4001)

Compute endpoint : POST [http://localhost:4001/api/compute](http://localhost:4001/api/compute)


## With docker (dev)
Build image from parent directory with docker compose
(this command builds front & back images and starts them)
```
cd ..
docker compose up
```

Start only back image (run `docker ps` to check back image existence)
```
docker start -ai redspher-calculator-back
```

Run tests
```
docker container exec -i  redspher-calculator-back npm test
```

## Without docker (dev)
### Pre-requisites 
Runs on Node versions >= 12 

Install dependencies using npm
```
npm install
```

### How to run
Run the project using the command
```
npm start
```

### Testing
Run test & watch all files with `*.test`
```
npm test
```

### Build
Builds the app for production to the `build` folder .\
```
npm run build
```

### `Notes`
**ts-node-dev** is the Typescript replacement for Nodemon. It allows us to run the ts file directly. This is to avoid having to stop the server to run tsc && node ./index.js

## License 
MIT

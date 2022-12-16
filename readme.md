## Currency Exchange Demo App
The app is made up of two separate modules, client and server each in its own folder

#### To run the server: 
```sh
npm i
npm run serve
```

The server runs on localhost:4000 using nodemon and express.
*Note that I was using fetch in node, I believe that it's only supported from version 17.5*
*If I had a bit more time I would have dockerized the server app but unfortunately my wife is getting impatient*

#### To run the client (in a separate terminal instance): 
```sh
npm i
npm run dev
```

This will run a dev server on localhost:3000, the server app *should* work with this port, see the server.js file's cors setting. As this is just a demo I did not test the build functionality and only used the dev server. 

#### Notes:
 - I used typescript in the client, hope this is ok, but I've been using it for the past year and it's just easier for me to write code quickly with the type hints in the IDE.
 
 - The client was built using Vite and from their react-ts template.
 
 - I kept the styling minimal and stuck to css modules just to keep things quick.

- I made a few notes as comments in the code as to why I did things the way I did/how I would have done them for a production app.
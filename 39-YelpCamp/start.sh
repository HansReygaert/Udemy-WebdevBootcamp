 #!/bin/bash
 PORT="3000"
 MAIN_ENTRY="app.js"

clear 
echo "Removing Listeners on Port $PORT"
npx kill-port $PORT
echo "Starting Nodemon"
nodemon $MAIN_ENTRY 

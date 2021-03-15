# Flask and create-react-app

## Requirements

1. `npm install`
2. `pip install -r requirements.txt`

## Setup

1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. run "heroku login -i" to login into heroku
3. run "heroku create" to create a project
4. run "heroku addons:create heroku-postgresql:hobby-dev" to create a remote postgres db
5. run "heroku config" to see the heroku config files
6. set DATABASE_URL as an environment variable

## Run Application

1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/' on two different tabs
4. Play tic-tac-toe

## Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Known problems

1. Spectator id doesn't change when they become a player so when they win it shows as a loser
   - I've tried different thing to try to fix this but couldnt
2. Users can log in with the same login
   - Make a list of people that have login
   - If user is logged in, then return error if someone else tries to log in
3. Restart button is not working, backend gets an ValueError: Too many packets in payload whenever play again is clicked
   - Not sure where the error is coming from 


## Technical Issues

1. Storing board state
   - I just stored board state into the backend, and send it out through socket so everyone would have the updated one
2. Who's turn it was
   - Stored value in database and send it out through sockets

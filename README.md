# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. run  "heroku login -i" to login into heroku
3. run  "heroku create" to create a project
4. run  "heroku addons:create heroku-postgresql:hobby-dev" to create a remote postgres db
5. run  "heroku config" to see the heroku config files
6. set  DATABASE_URL as an environment variable 

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
1. Users only get to see board once a move is made
   - Send board updates to users as they log in and pass it as a prop to children
2. If player two joins after player one made a move, player two will think player one hasn't made a move yet
   - Send turn updates to users as they log in, and pass it as props
   - Or make it so that player one can't move unless there a player two
## Technical Issues
1. Whenever a spectator became a player, the player would be sent to login screen
   - Fixed the state so that the part that made the login show up wasn't resetted
2. Keeping track of users so that Spectator would become a player if a player left
   - Have a list of users
   - Whenever a user connected, they would be added to the list
   - if user that disconnected is player two or Spectator
     - remove user
     - decrease everyone id after that user by 1
     - if id becomes 1 user becomes player 2
   - if player one is disconnected
      - Spectator becomes player 1 if there's any
      - player two is not affected at all
      - everyone id after player two is decreased by one
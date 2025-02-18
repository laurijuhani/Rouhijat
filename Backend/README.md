# Backend Api documentation
### v1 

# Routes

### TODO: Add the types of the response body and make the players endpoint

## /games

### GET / 
* Description: Retrieve a list of all games
* Response:
  - 200 OK: Returns an array of game objects.
  - 500 Internal Server Error: If something goes wrong on the server.


### POST /
* Description: Create a new game.
* Request Body:
  - homeTeam (string): The name of the home team.
  - awayTeam (string): The name of the away team.
  - homeScore (number, optional): The score of the home team.
  - awayScore (number, optional): The score of the away team.
  - gameDate (string): The date of the game.
* Response:
  - 201 Created: Returns the created game object.
  - 400 Bad Request: If required fields are missing.
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token.


### PUT /:id
* Description: Update an existing game.
* Parameters:
  - id (path parameter): The ID of the game to update.
* Request Body:
  - homeTeam (string): The name of the home team.
  - awayTeam (string): The name of the away team.
  - homeScore (number, optional): The score of the home team.
  - awayScore (number, optional): The score of the away team.
  - gameDate (string): The date of the game.
* Response:
  - 204 No Content: If the game is successfully updated.
  - 400 Bad Request: If required fields are missing.
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token.


### DELETE /:id
* Description: Delete a game by its ID.
* Parameters:
  - id (path parameter): The ID of the game to delete.
* Response:
  - 204 No Content: If the game is successfully deleted.
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token.


## /signIn

### POST /
* Description: Sign in a user or create a new user if they are invited.
* Request Body:
  - email (string): The email of the user.
  - name (string): The name of the user.
* Response:
  - 200 OK:
{ allowed: true }: If the user is successfully signed in or created.
  - 403 Forbidden:
{ allowed: false }: If the email is not found in the invited emails.
  - 500 Internal Server Error:
{ allowed: false }: If something goes wrong on the server.


## /invites

### GET /
* Description: Retrieve a list of all invited emails.
* Response:
  - 200 OK: Returns an array of invited email objects.
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token.

### POST /
* Description: Create a new invitation.
* Request Body:
  - email (string): The email to invite.
* Response:
  - 201 Created: Returns a message indicating the invitation was sent.
  - 403 Forbidden: If the user is not authorized (not an admin).
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token and admin role.

### DELETE /:id
* Description: Delete an invitation by its ID.
* Parameters:
  - id (path parameter): The ID of the invitation to delete.
* Response:
  - 204 No Content: If the invitation is successfully deleted.
  - 403 Forbidden: If the user is not authorized (not an admin).
  - 500 Internal Server Error: If something goes wrong on the server.
* Authentication: Requires a valid token and admin role.


## /users

### GET /getrole
* Description: Retrieve the role of a user by their email.
* Request Headers:
  - Authorization (string): A bearer token for authorization.
* Request Body:
  - email (string): The email of the user.
* Response:
  - 200 OK: Returns the role of the user.
  - 401 Unauthorized: If the authorization token is invalid.
  - 404 Not Found: If the user with the specified email is not found.
  - 500 Internal Server Error: If something goes wrong on the server.


### PUT 

Coming soon...


## /players 

Coming soon...
### Users:

- GET /users: Get a list of all users based on filters.
- GET /users/{user_id}: Get details of a specific user.
- POST /users: Create a new user.
- PATCH /users/{user_id}: Update user details.
- DELETE /users/{user_id}: Delete a user.

### Events:

- GET /events: Get a list of all events based on filters.
- GET /events/{event_id}: Get details of a specific event.
- POST /events: Create a new event.
- PATCH /events/{event_id}: Update event details.
- DELETE /events/{event_id}: Delete an event.

### User Events:

- GET /users-events: Get a list of participants based on filters.
- POST /users-events/add: Add a participant to an event.
- POST /users-events/remove: Remove a participant from an event.
- PATCH /users-events: Update details from participant of the event.

### Comments:

- GET /comments: Get a list of all comments based on filters.
- GET /comments/{comment_id}: Get details of a specific comment.
- POST /comments: Add a new comment.
- PATCH /comments/{comment_id}: Update a comment.
- DELETE /comments/{comment_id}: Delete a comment.

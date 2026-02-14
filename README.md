# Block-Game
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/1c9e9c00-ce3f-4f4a-be2a-398b84a1c1d7" />

## Tech Stack used
- Mongodb
- Vite (react)
- nodejs (express)

## Deployement
- frontend on vercel with custom domain
- backend on render

## Backend
A http server running which is used by sockets to handle connections

On connection , the socket backend listens for 'joinroom' which has data {username and roomId}.
The username is checked and if not found in DB the user enters the room.
On entering the room the frontend listens for state socket , which gives the previously claimed blocks data.
When a user clicks block the claimed block is saved in DB under the users username and emitted to all users in the room .

## Models
- Room
    - RoomId (string)
    - users (array of the users model)
- Users
    - username(string)
    - claimedBlocks(map)

<img width="1919" height="886" alt="image" src="https://github.com/user-attachments/assets/0b052e09-886f-49f5-80a1-c29fca6cfe15" />


## Frontend 
App.tsx 
Handles the websocket connections and updates the backend with the clicks on the blocks 

[![Code Climate](https://codeclimate.com/github/alecortega/twitter-battle/badges/gpa.svg)](https://codeclimate.com/github/alecortega/twitter-battle)
# Twitter Battle
Compare how two search terms compete against each other in real-time.

**Live Demo: https://twitterbattle-alecortega.herokuapp.com/**

![alt tag](http://i60.tinypic.com/5b9r9v.png)
![alt tag](http://i58.tinypic.com/1zogvtw.png)

## How It's Made:

**Tech Used:** Express, Redis, Socket.io, Jade, jQuery

### Server:
The Express server listens to Twitter's streaming API and emits a Socket.io event with the tweet data as the payload. Twitter's API dictates that there can only be one stream open at a time, meaning that if two users connect to the server, there can't be two different streams of data going to each client. I solved this by creating a Redis key-value store that was updated everytime a user connects. As soon as the server gets the two search terms to listen to from the client it stores them as the value with the user's session ID as the key. The stream is then updated to listen to the new terms along with any existing ones, when a user's session ends, their key-value is removed from the Redis store and the stream stops listening to the keywords they were searching for. The store also ensures that if they refresh the dashboard page their search terms persist. This also ensures that the stream is only ever listening to keywords from active users, the removal acts as a sort of garbage collectin and cuts down the bandwidth that the server is handling at any given time. 

### Client:
The client listens to the Socket.io event that the server emits. when it receives the tweet payload via websockets it uses jQuery to append an HTML string to the page to display the tweet. I'm also using the data to update the charts in realtime.  


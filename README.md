# Welcome to StoryBooks
A web application developed using Node.js that allows users to perform CRUD operations on their stories by signing in with their Google account.

_Deployed_ [_here_](https://storybooks-dev.herokuapp.com/)

## Features

- Sign in Google Account.
- Add your stories in Public/Private mode
- See All public Stories.
- Edit/Delete your stories
- View a user's stories.

## To Do's

- Follow a particular user and get notified for their activities.
- Notifications

## Requirements

- [Node.js](https://nodejs.org)
- [Express](https://npmjs.org/package/express)
- [EJS](https://npmjs.org/package/ejs)
- [MongoDB](http://mongodb.org)
- [mongoose](https://npmjs.org/package/mongoose)
- [Passport](https://www.npmjs.com/package/passport)

## Installation

Clone the repo locally then install all the dependencies using [NPM](https://npmjs.org/)

```bash
$ git clone https://github.com/devansh-07/StoryBooks.git
$ cd StoryBooks
$ npm i
```


## Local Development

Before running, you need to add the Google API Credentials and Database URI to the project. Put `<DATABASE_URI>`, `<GOOGLE_CLIENT_ID>`, `<GOOGLE_CLIENT_SECRET>` and `PORT` in `config/config.env`. 

```
PORT = 8000
DATABASE_URI = 'XXXXXXXXXXXXXXXXXX'
GOOGLE_CLIENT_ID = 'XXXXXXXXXXXXXXXXXXXX'
GOOGLE_CLIENT_SECRET = 'XXXXXXXXXXXXXXXXXXXX'
```

then run the server via `npm`.

```bash
$ npm start
```

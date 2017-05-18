[![Build Status](https://travis-ci.org/dagobahtech/acit2910.svg?branch=develop)](https://travis-ci.org/dagobahtech/acit2910)

# ACIT 2910 Projects Course

## Team Name : Dagobah

## Team Members

* Dylan Chew
* Brett Dixon
* Tommy Do
* Jed Iquin
* '_Mr. Repo Man_' Daniele Lisi

## About

Fast food system for the planet of Dagobah

## Pre requisites

* Latest Node JS <https://nodejs.org/en/>

## Running the Webapp

To run the webapp make sure you pull the latest commit from our develop branch then:

1. In the terminal: `cd` into the Dagobah project folder.
2. Run `npm run dagobah` to automatically install all the dependencies, build the project for production, and run the server.
3. Wait for the terminal to display the message:

	* `Server is running on port 3000`
	* `MR. Repo is watching you.`
	* `Menu array in the server updated!`
4. The server is running, proceed to the **Order** | **Kitchen** | **Admin** section to use the app.

### Order Page:
1. Open your browser and type `localhost:3000` to access the order page.
2. Add items to your cart and confirm the order to receive your receipt. This will add the order to the kitchen queue.

### Orders In Process Page:
1. Open your browser and type `localhost:3000/orderview` to access the orders in process page.

### Kitchen Page:
1. Open your browser and type `localhost:3000/login` to access the login page for the kitchen.
2. Type **kitchen** in the username input and **dagobahtech** for the password to login.

### Admin Page:
1. Open your browser and type `localhost:3000/login` to access the login page for the admin.
2. Type **admin** in the username input and **dagobahtech** for the password to login.

## Running the tests

Before running the tests, make sure the node server is running in a separate terminal window.
To start the server, run `npm start` in the project root folder.
### Unit Testing:
In a new terminal window, run `npm run test` from the root folder to start jest unit testing.

### Functional Testing

> Make sure to have already installed the latest version of [Firefox web browser](https://www.mozilla.org/en-US/firefox/desktop/) on your machine.

1. Download the appropriate FirefoxDriver for you OS from here: [Firefox Driver](https://github.com/mozilla/geckodriver/releases)
2. Extract the archive and move the file into the `bin` folder in the project root folder.
3. Edit `nightwatch.json` line 16 adding the path for the driver file (e.g. `"webdriver.gecko.driver" : "./bin/geckodriver"`).  On Windows, make sure to add the .exe extension at the end.
4. In a new terminal window, run `npm run test:firefox` from the root folder to start Nightwatch functional testing.


## FAQ Section

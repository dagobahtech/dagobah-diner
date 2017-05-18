[![Build Status](https://travis-ci.org/dagobahtech/acit2910.svg?branch=develop)](https://travis-ci.org/dagobahtech/acit2910)

# ACIT 2910 Projects Course

## Team Name : Dagobah

## Team Members

* Dylan Chew
* Brett Dixon
* Tommy Do
* Jed Iquin
* '_Mr. Repo Man_' Daniele Lisi

# About

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
4. The webapp is now ready.

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

### Unit Testing:
In the terminal, run `npm run test` from the root folder to start jest unit testing.

### Functional Testing

1. Download the appropriate ChromeDriver for you OS from here: [Chrome Driver](https://chromedriver.storage.googleapis.com/index.html?path=2.29/)
2. Move the downloaded file into the `bin` folder in the project root folder.
3. In the terminal, run `npm run test:night` from the root folder start nightwatch functional testing.





<h1 align="center"> SwapOmen </h1>
<p>2800-202210-DTC09</P>

## Table of Contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)
* [Installation](#installation)
* [Features](#features)
* [Citation](#citation)
* [Creators](#creators)

## General Info

[SwapOmen](https://sub.yurtle.net/)
* To allow products to be used to their fullest extent and reduce waste, our team developed a trading app that makes it easy for people to trade their items instead of throwing them away.

## Technologies
Technologies used for this project:
* HTML, CSS, Bootstrap
* JavaScript, jQuery
* Node.js
* MySQL
* [Google fonts](https://fonts.google.com/)

## Content
Content of the project folder:

```
 Top level of project folder:
├── public_html              # public directory
├── server                   # server directory
├── .gitignore               # .gitignore file
├── package-lock.json        # package-lock.json file
├── package.json             # package.json file
└── README.md

It has the following subfolders and files:
├── .git                     # Directory for git repo     
├── public_html              # Directory for client side files
   └── css
       /chat.css
       /confirmation.css
       /error.css
       /index.css
       /item.css
       /listing.css
       /login.css
       /main.css
       /posting.css
       /profile.css
       /review.css
       /sendTradeOffer.css
       /tradeOffer.css
       /traderInfo.css
       /viewChats.css
   ├── html                  # Directory for HTML files
       └── partials          # Directory for components
           /menu-bar.html
           /top-nav.html
       /account.html
       /admin.html
       /chat.html
       /confirmation.html
       /editPost.html
       /error.html
       /index.html
       /item.html
       /listings.html
       /login.html
       /main.html
       /posting.html
       /profile.html
       /review.html
       /sendTradeOffer.html
       /sentOffers.html
       /signup.html
       /tradeOffer.html
       /traderInfo.html
       /viewChats.html
       /websocket.html
   ├── img                    # Directory for images
       ├── default            # Directory for default images
           /camera.svg
           /person-circle.svg
       ├── post               # Directory for posts' images
       └── profiles           # Directory for profile images  
   ├── js                     # Directory for JavaScript files
      /confirmation.js
      /editPost.js
      /global.js
      /httpRequests.js
      /item.js
      /miscData.js
      /posting.js
      /profile.js
      /review.js
      /sentTradeOffers.js
      /tradeOffer.js
      /traderInfo.js
      /webserverInterface.js
└── server                    # Directory for server side files
    /webserver.js              
    /websocketServer.css             
```

## Installation
1. Install Node.js and any text editor (e.g. Visual Studio Code).
2. Install MySQL (e.g. XAMPP).
3. If you set a password for your local MySQL, go to `sqlData.json` file inside `server` folder and change the password value to your root account's password. If not, you can skip this step.
4. Open a terminal, go to the project directory and enter ```npm install``` to install all packages you need.
5. Move into the server directory by entering ```cd server``` in terminal and then enter ```node webserver.js``` in the same terminal.
6. Open your internet browser and visit ```localhost:8000```.
7. Now you can check our application and start contributing!

* Testing log: https://docs.google.com/spreadsheets/d/1PWQ-gMZc-iZ76VCwrFyb8hJ5h6Xkt-yLE8JaL5LrAGc/edit#gid=394496370

## Features
* Create and log in to an account to start trading your items
* Post your item that you no longer need/use
* Browse other user's posting from the search page
* Send trade offer to other users
* Accept / Decline offers you have received from others
* Chat with other traders
* Leave reviews when completing trades

## Citation
* Rating design: https://bbbootstrap.com/snippets/bootstrap-rate-your-experience-template-star-ratings-30972576
* image-upload: https://bootstrapious.com/p/bootstrap-image-upload  
* Rotating text: https://www.geeksforgeeks.org/how-to-rotate-a-text-360-degrees-on-hover-using-html-and-css

## Creators
*George Rozitis* (https://github.com/LinnyPurple)  
*Lachlan Butler* (https://github.com/Yurtle212)  
*Toco Tachibana* (https://github.com/toco-t)  
*Soo Park* (https://github.com/Soohyeun)

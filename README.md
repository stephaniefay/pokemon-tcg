# Pokemon TCG

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.8. I will probably use the [Pokemon TCG API](https://dev.pokemontcg.io/) to fetch the information needed. Also, I will be using [Firebase Storage](https://firebase.google.com/) as a database.

The live version of this project can be accessed right [here](https://tcg-pkmn.web.app/public/collection). It is still a WIP.

## Deploy to Firebase Hosting

Run `firebase deploy --except functions` for deploying. Supposedly it should be enough to deploy using only `ng deploy` because of the [@angular/fire](https://github.com/angular/angularfire) dependencies, but it didn't work for me.

So, after some research, I found this [stackoverflow link](https://stackoverflow.com/questions/62734278/firebase-cant-deploy) that explains that this behaviour is not expected, and it is a bug, but it could be corrected by simply not deploying the Firebase Functions. I might correct my deploy script eventually, but it is not a priority.

## Images

All images used in this project either came from the Pokemon TCG API or were found in sites that make available free vectors.

# Pokemon TCG

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.8. I will probably use the [Pokemon TCG API](https://dev.pokemontcg.io/) to fetch the information needed. Also, I will be using [Firebase](https://firebase.google.com/) as a database, and its storage as a recipient for the CSV files.

The live version of this project can be accessed right [here](https://tcg-pkmn.web.app/public/collection). It is still a WIP.

## Deploy to Firebase Hosting

Run `firebase deploy --except functions` for deploying. Supposedly it should be enough to deploy using only `ng deploy` because of the [@angular/fire](https://github.com/angular/angularfire) dependencies, but it didn't work for me.

So, after some research, I found this [stackoverflow link](https://stackoverflow.com/questions/62734278/firebase-cant-deploy) that explains that this behaviour is not expected, and it is a bug, but it could be corrected by simply not deploying the Firebase Functions. I might correct my deploy script eventually, but it is not a priority.

## Images

All images used in this project either came from the Pokemon TCG API or were found randomly at the internet. Credits to the authors.
[ 
[x](https://devsnap.me/css-background-patterns), 
[x](https://br.pinterest.com/pin/454793262346636811/), 
[x](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tumblr.com%2Ftagged%2Fsparkles%3Fsort%3Dtop&psig=AOvVaw39_GHxIAIMBRsknXhIv4tG&ust=1620356174101000&source=images&cd=vfe&ved=0CA0QjhxqFwoTCMCpgqOHtPACFQAAAAAdAAAAABAF), 
[x](https://br.pinterest.com/pin/851180398302573457/),
[x](https://github.com/duiker101/pokemon-type-svg-icons)
 ]

## Setting up CORS

Firebase, as in Google, have a very strict CORS policy. To set up the firebase storage to allow downloads from any paths, so I could manipulate the files internally and export the CSVs to upload in LigaPokemon, I had to enable the get for all paths. Although you could, if you wanted, enable for only certain paths as well. The step-by-step can be found in:
[Firebase Storage Docs](https://firebase.google.com/docs/storage/web/download-files) and [GSuit Installation](https://cloud.google.com/storage/docs/gsutil_install).

The necessary `cors.json` is already in the repository.

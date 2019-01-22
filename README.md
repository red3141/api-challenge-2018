# Team Photo

Hello, friends and askers of questions!

## Hello! What am I looking at here?

This is Team Photo! In a nutshell, it's an app created to generate a photo of your team after a game of League of Legends.

## I'm in! How do I use it?

Start by opening the League of Legends client. It won't work unless the League of Legends client is opened before Team Photo.

If you're on Windows, you can download the prebuilt app in the `prebuiltApp` folder. Be sure to grab the 32- or 64-bit version as appropriate. Unzip the folder, and you'll find the TeamPhoto application inside.

If you're on Mac, or if you're too cool for prebuilt apps, you can run Team Photo by cloning this repository and running `npm start` from the `electronApp` folder. Note that you'll need to get [npm](https://www.npmjs.com/get-npm) first, if you don't have it already.

Note that Team Photo assumes that League of Legends is installed in the default location on your computer (`"(C|D):/Riot Games/League of Legends/` on Windows or `/Applications/League of Legends.app/` on Mac). If that isn't the case, you'll need to pull down the repository as described in the "If you're on Mac" instructions above, and change the file path in `readLockFile()` in `electronApp/index.js`.

If you've done all of this correctly, play a game of League of Legends. Your team photo will be automatically created when the game ends and you're looking at the end of game stats screen.

## Great! While I'm queuing up for my game, tell me more: who made Team Photo, and why?

We're RndmInternetMan and shoco, both from NA. Team Photo was created for the [2018 Riot Games API Challenge](https://www.riotgames.com/en/DevRel/the-riot-games-api-challenge-2018).

## What was the inspiration for this project?

There were a number of points of inspiration. First, we thought we could provide something more fun to remember outstanding games by than a stats screen. Second, we thought that we could use the same system to provide something funny to lighten the blow of losing a tough game. Third, in 2018, Riot Games frequently used the idea of "the player as the champion" in various videos, advertisements, and [music videos](https://www.youtube.com/watch?v=fB8TyLTD7EE), so we thought we could do something interesting that plays on that idea.

## 

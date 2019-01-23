# Team Photo

Hello, friends and askers of questions!

## Hello! What am I looking at here?

This is Team Photo! In a nutshell, it's an app created to generate a photo of your team after a game of League of Legends.

Example image (not from an actual game):
![Example Image](https://raw.githubusercontent.com/red3141/api-challenge-2018/master/exampleImage1.png)

Example image from an actual game that went well:
![Example Image](https://raw.githubusercontent.com/red3141/api-challenge-2018/master/actualGameImage2.png)

Example image from an actual game that went... well:
![Example Image](https://raw.githubusercontent.com/red3141/api-challenge-2018/master/actualGameImage.png)



## I'm in! How do I use it?

Start by opening the League of Legends client. It won't work unless the League of Legends client is opened before Team Photo.

If you're on Windows, you can download the prebuilt app in the `prebuiltApp` folder. Be sure to grab the 32- or 64-bit version as appropriate. Unzip the folder, and you'll find the TeamPhoto application inside.

If you're on Mac, or if you're too cool for prebuilt apps, you can run Team Photo by cloning this repository and running `npm start` from the `electronApp` folder. Note that you'll need to get [npm](https://www.npmjs.com/get-npm) first, if you don't have it already.

Note that Team Photo assumes that League of Legends is installed in the default location on your computer (`"(C|D):/Riot Games/League of Legends/` on Windows or `/Applications/League of Legends.app/` on Mac). If that isn't the case, you'll need to pull down the repository as described in the "If you're on Mac" instructions above, and change the file path in `readLockFile()` in `electronApp/index.js`.

If you've done all of this correctly, play a game of League of Legends. Your team photo will be automatically created when the game ends and you're looking at the end of game stats screen.

## Great! While I'm queuing up for my game, tell me more: who made Team Photo, and why?

We're RndmInternetMan and shoco, both from NA. Team Photo was created for the [2018 Riot Games API Challenge](https://www.riotgames.com/en/DevRel/the-riot-games-api-challenge-2018).

## What was the inspiration for this project?

There were a number of points of inspiration. First, we thought we could provide something more fun to remember outstanding games by than a stats screen. Second, we thought that we could use the same system to provide something funny to lighten the blow of losing a tough game. Third, in 2018, Riot Games frequently used the idea of "the player as the champion" in various videos, advertisements, and [music videos](https://www.youtube.com/watch?v=fB8TyLTD7EE), so we wanted to that play on that idea too.

## How did you make Team Photo?

The two primary pieces of technology we used to create Team Photo are [Electron](https://electronjs.org/), to allow us to run a webpage as a desktop app, and the HTML5 Canvas, to draw the image.

To get the end of game data from the League of Legends client, we used the LCU APIs, specifically, the `lol-end-of-game` API.

## What challenges did you have to deal with when creating this project?

On a time-limited, art-focused project like this, one of the main challenges is just the amount of art that needs to be created. To help deal with this, there's a definite desire to reuse iamges whenever possible, so we had to find some interesting ways to do that.

Another interesting challenge is simply drawing the characters in a way that's flexible enough to allow for a variety of poses, while also keeping all the pieces connected in ways that look good (making sure arms are connected, weapons stay in hands, etc.).

A final challenge that we had to deal with was the fact that, sometimes, life happens and plans get thwarted. We unfortunately ran into school, work, and other plans making us busier than initially expected as the Challenge went on, which resulted in--

## Hey! I just finished my game, and even though I have a team photo, my favourite champion looks super generic, while other champions have special art! What gives?

Yeah, that. Unfortunately, we didn't have the time we thought we were going to have to finish art for every champion in the game, so we're submitting more of a demo than a finished product. We did our best to complete a demo that shows our intent, and we hope you find it interesting regardless!

## I suppose that's fair. Tell me more about what you did to reuse images when possible.

It's easy to see at first glance that each of the characters share the same head, arms, etc. Not only does this let us reuse these images, it also gives us guarantees about sizes and positions of these body parts, so we can create facial expressions that we can easily put on any champion.

More interestingly, the hair for the champions involves some extra tricks for reuse. You might notice that some champions have short hair, while others have long hair. The long hair effect is created by simply adding an extra image to the short hair, so we get a lot of use from that short hair image. To further increase the reuse, the HTML5 Canvas lets us add a filter before drawing the image, which lets us create a variety of hair colours using only a single hair image.

Specifically, the filters we use for setting hair colours are:
`hue-rotate(XXdeg)`: taking the image colour in the HSV colour scheme, this filter rotates the Hue, changing the colour of the image.
`saturate(XX%)`: taking the image colour in the HSV colour scheme, this filter modifies the Saturation, changing the vibrancy of the colours in the image.
`brightness(XX%)`: taking the image colour in the HSV colour scheme, this filter modifies the Value, increasing or decreasing the brightness of the colours in the image.

These filters can be combined, and you can see in the `drawHairWithColor` function in `index.js` how we do that to create different hair colours.

## Anything you want to elaborate on about how you drew the characters in a way that kept them looking reasonable?

Yes! There's some really neat tricks here.

First, it's important to understand the concept of the Context of an HTML5 Canvas. Nearly all of the commands to draw on a Canvas are done through the Context. In simple terms, the Context is like a transformable window over the Canvas. It starts aligned on top of the Canvas, but you can move, rotate, and stretch the Context, and then when you draw on the Context, it's drawn relative to that window. That might sound overly complicated, but it actually makes some tricky things really easy!

For example, consider drawing arms, specifically, if the arms can be either raised or not. Without the Context, it would be very difficult to correctly position a weapon at the end of an arm, because you'd need to manually calculate the position the weapon would have to be at, and you'd need to redo that calculation if the position of the arm changed. However, with the Context, after drawing one element, the Context continues with the transformations it already has. This means that if you correctly position the weapon when the arm is not raised, then applying a rotation to the arm will automatically keep the weapon position correct when the arm is raised.

To take this one step further, we wanted to be able to rotate held objects to position them as desired in the picture without having to create specifically rotated images. We do this by imagining we want to put a peg through the arm and held object images at the point where the item is held. It's easy enough to position those points on top of each other, but when the object is rotated, it tends to get thrown off. To do this properly, it helps to know that Context rotations rotate the Context around the "top left" corner of the Context. So we need to first get that point to the point on the arm that the peg will go through on the arm, then rotate the Context, and finally move the Context so that the point on the object that the peg will go through lines up properly. In code (assuming the Context is where it was when the arm was drawn):
```
context.transform(armPegX, armPegY);
context.rotate(rotationInDegress * Math.PI / 180);
context.transform(-objectPegX, -objectPegY);
```

If you look in `championData.js`, you can see how we use `handX` and `handY` for this purpose. It made it much easier to correctly position held items using this system.

## Awesome! Is there anyone you'd like to give a shoutout to?

Absolutely!

Thanks Pupix for making rift-explorer and the WebSocket setup we used; it’s nearly impossible to work with the LCU without these!

Thanks to our group at the Riot Games Hackathon (Lord Imrhial, Cookie Knight, and Grievous); having some experience with the LCU and being able to reference the code we wrote in that hackathon got us started a lot faster than we would have otherwise.

And finally, thanks to Riot Git Gene and the rest of the DevRel team at Riot for running the API Challenge; it's always a blast, and a great excuse to try something new!

## Any chance you happen to have a link to the more complete documentation you created as you worked on the project?

Yup, you can find that [here](https://docs.google.com/document/d/1K3X_EEGKZ8Ezmn1r2sNoF4KDeLytKdtctmRqJZTjnzU/edit?usp=sharing).

## And, lastly, any legal jibber jabber you should have included somewhere in here?

Team Photo was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.

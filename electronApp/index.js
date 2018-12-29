var port;
var password;
var lockfile;
var fs = require('fs');

function readLockFile() {
    fs.readFile("C:/Riot Games/League of Legends/lockfile", 'utf-8', (err, data) => {
        if (err) {
            console.log("Windows Path Error: " + err.message);
            fs.readFile("D:/Riot Games/League of Legends/lockfile", 'utf-8', (err, data) => {
                if (err) {
                    console.log("Windows Path Error: " + err.message);
                    fs.readFile("/Applications/League of Legends.app/Contents/LoL/lockfile", 'utf-8', (err, data) => {
                        if (err) {
                            console.log("Mac Path Error: " + err.message);
                            return;
                        }
                        lockfile = data;
                        processLockFile();
                    });
                    return;
                }
                lockfile = data;
                processLockFile();
            });
            return;
        }
        lockfile = data;
        processLockFile();
    });
}

function processLockFile() {
    var split = lockfile.split(":");
    port = split[2];
    password = split[3];
    console.log("port: " + port + ", password: " + password);
}

function draw() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var image = document.getElementById("image");

  drawCharacter(context, image);
}

function drawCharacter(context, image) {
  context.save();
  context.translate(300, 10);
  drawBody(context, image);
  context.drawImage(image, 0, 0);
  context.restore();
}

function drawBody(context, image) {
  context.save();
  context.translate(-0.05 * image.width, 0.9 * image.height);
  context.drawImage(image, 0, 0);
  context.drawImage(image, 0, image.height);
  drawRightArm(context, image);
  drawLeftArm(context, image);
  drawRightLeg(context, image);
  drawLeftLeg(context, image);
  context.restore();
}

function drawRightArm(context, image) {
  context.save();
  context.rotate(30 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawLowerRightArm(context, image);
  context.restore();
}

function drawLowerRightArm(context, image) {
  context.save();
  context.translate(image.width / 2, image.height);
  context.rotate(30 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawRightHand(context, image);
  context.restore();
}

function drawRightHand(context, image) {
  context.save();
  context.translate(image.width / 2, image.height);
  context.rotate(90 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  context.restore();
}

function drawLeftArm(context, image) {
  context.save();
  context.translate(image.width, 0);
  context.rotate(-30 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawLowerLeftArm(context, image);
  context.restore();
}

function drawLowerLeftArm(context, image) {
  context.save();
  context.translate(image.width / 2, image.height);
  context.rotate(-30 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawLeftHand(context, image);
  context.restore();
}

function drawLeftHand(context, image) {
  context.save();
  context.translate(image.width / 2, image.height);
  context.rotate(-90 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  context.restore();
}

function drawRightLeg(context, image) {
  context.save();
  context.translate(0.2 * image.width, 1.8 * image.height);
  context.rotate(45 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawRightLowerLeg(context, image);
  context.restore();
}

function drawRightLowerLeg(context, image) {
  context.save();
  context.translate(0.5 * image.width, image.height);
  context.rotate(-45 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawRightFoot(context, image);
  context.restore();
}

function drawRightFoot(context, image) {
  context.save();
  context.translate(0.5 * image.width, 0.5 * image.height);
  context.rotate(90 * Math.PI / 180);
  context.translate(0, 0);
  context.drawImage(image, 0, 0);
  context.restore();
}

function drawLeftLeg(context, image) {
  context.save();
  context.translate(0.8 * image.width, 1.8 * image.height);
  context.rotate(-45 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawLeftLowerLeg(context, image);
  context.restore();
}

function drawLeftLowerLeg(context, image) {
  context.save();
  context.translate(0.5 * image.width, image.height);
  context.rotate(45 * Math.PI / 180);
  context.translate(-0.5 * image.width, 0);
  context.drawImage(image, 0, 0);
  drawLeftFoot(context, image);
  context.restore();
}

function drawLeftFoot(context, image) {
  context.save();
  context.translate(0.5 * image.width, 0.5 * image.height);
  context.rotate(-90 * Math.PI / 180);
  context.translate(- image.width, 0);
  context.drawImage(image, 0, 0);
  context.restore();
}
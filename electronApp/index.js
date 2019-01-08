process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const WebSocket = require('ws');

const MESSAGE_TYPES = {
    WELCOME: 0,
    PREFIX: 1,
    CALL: 2,
    CALLRESULT: 3,
    CALLERROR: 4,
    SUBSCRIBE: 5,
    UNSUBSCRIBE: 6,
    PUBLISH: 7,
    EVENT: 8
};

class RiotWSProtocol extends WebSocket {

    constructor(url) {
        super(url, 'wamp');

        this.session = null;
        this.on('message', this._onMessage.bind(this));
    }

    close() {
        super.close();
        this.session = null;
    }

    terminate() {
        super.terminate();
        this.session = null;
    }

    subscribe(topic, callback) {
        super.addListener(topic, callback);
        this.send(MESSAGE_TYPES.SUBSCRIBE, topic);
    }

    unsubscribe(topic, callback) {
        super.removeListener(topic, callback);
        this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);
    }

    send(type, message) {
        super.send(JSON.stringify([type, message]));
    }

    _onMessage(message) {
        const [type, ...data] = JSON.parse(message);

        switch (type) {
            case MESSAGE_TYPES.WELCOME:
                this.session = data[0];
                // this.protocolVersion = data[1];
                // this.details = data[2];
                break;
            case MESSAGE_TYPES.CALLRESULT:
                console.log('Unknown call, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
                break;
            case MESSAGE_TYPES.TYPE_ID_CALLERROR:
                console.log('Unknown call error, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
                break;
            case MESSAGE_TYPES.EVENT:
                const [topic, payload] = data;
                this.emit(topic, payload);
                break;
            default:
                console.log('Unknown type, if you see this file an issue with at https://discord.gg/hPtrMcx with the following data:', [type, data]);
                break;
        }
    }
}

function init() {
    readLockFile();
    prepareImages();
}

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
    
    const ws = new RiotWSProtocol('wss://riot:' + password + '@localhost:' + port + '/');

    ws.on('open', () => {
        ws.subscribe('OnJsonApiEvent', handleJsonApiEvent);
    });
}

function handleJsonApiEvent(data) {
    if (data.uri == "/lol-end-of-game/v1/champion-mastery-updates" && data.eventType == "Update") {
        handleChampionMasteryUpdates(data);
    } else if (data.uri == "/lol-end-of-game/v1/eog-stats-block" && data.eventType == "Update") {
        handleEogStatsBlock(data);
    }
}

var championMasteryUpdateData;
var eogStatsBlockData;

function handleChampionMasteryUpdates(data) {
    console.log("ChampionMasteryUpdates: " + data);
    championMasteryUpdateData = data;
    if (eogStatsBlockData) {
        draw();
    }
}

function handleEogStatsBlock(data) {
    console.log("EogStatsBlock: " + data);
    eogStatsBlockData = data;
    if (championMasteryUpdateData) {
        draw();
    }
}

var headImage;
var hairImage;
var longHairImage;
var shirtImage;
var leftSleeveImage;
var leftArmImage;
var leftArmBentImage;
var rightSleeveImage;
var rightArmImage;
var rightArmBentImage;
var pantsImage;
var leftFootImage;
var rightFootImage;
var armData;

function prepareImages() {
    headImage = document.getElementById("headImage");
    hairImage = document.getElementById("hairImage");
    longHairImage = document.getElementById("longHairImage");
    shirtImage = document.getElementById("shirtImage");
    leftSleeveImage = document.getElementById("leftSleeveImage");
    leftArmImage = document.getElementById("leftArmImage");
    leftArmBentImage = document.getElementById("leftArmBentImage");
    rightSleeveImage = document.getElementById("rightSleeveImage");
    rightArmImage = document.getElementById("rightArmImage");
    rightArmBentImage = document.getElementById("rightArmBentImage");
    pantsImage = document.getElementById("pantsImage");
    leftFootImage = document.getElementById("leftFootImage");
    rightFootImage = document.getElementById("rightFootImage");
    
    armData = {"rightArmStraight": {"image": rightArmImage, "translationX": -30, "translationY": 22, "handX": 14, "handY": 60},
               "leftArmStraight": {"image": leftArmImage, "translationX": 7, "translationY": 20, "handX": 32, "handY": 60},
               "rightArmBent": {"image": rightArmBentImage, "translationX": -34, "translationY": 0, "handX": 14, "handY": 10, "rotation": 0},
               "leftArmBent": {"image": leftArmBentImage, "translationX": 7, "translationY": 0, "handX": 35, "handY": 10, "rotation": 0}};
    
    // uncomment this line to draw right away, instead of waiting for the end game stats to be ready
    draw();
}

function draw() {
    console.log("DRAWING");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(50, 100);
    for (var i = 0; i < 5; ++i) {
        championId = 0;
        if (i == 0) { championId = 141; }
        if (i == 1) { championId = 32; }
        if (i == 2) { championId = 119; }
        if (i == 3) { championId = 432; }
        if (i == 4) { championId = 22; }
        drawCharacter(context, championId.toString());
        context.translate(150, 0);
    }
    context.restore();
    
    championMasteryUpdateData = undefined;
    eogStatsBlockData = undefined;
}

function drawImageWithHueRotation(context, img, hueRotationDegrees) {
    if (hueRotationDegrees === undefined) {
        hueRotationDegrees = Math.floor(Math.random() * 360);
    }
    
    context.filter = "hue-rotate(" + hueRotationDegrees + "deg)";
    context.drawImage(img, 0, 0);
    context.filter = "none";
}

function generateRandomHairColor() {
    var random = Math.floor(Math.random() * 6);
    if (random == 0) {
        return "blonde";
    } else if (random == 1) {
        return "brown";
    } else if (random == 2) {
        return "black";
    } else if (random == 3) {
        return "white";
    } else if (random == 4) {
        return "grey";
    } else if (random == 5) {
        return "red";
    }
}

function drawHairWithColor(context, hairImage, hairColor) {
    var filter = "none";
    
    if (hairColor === undefined) {
        hairColor = generateRandomHairColor();
    }
    
    if (hairColor === "blonde") {
        filter = "hue-rotate(-170deg) brightness(160%)";
    } else if (hairColor === "brown") {
        filter = "hue-rotate(-195deg) brightness(65%)";
    } else if (hairColor === "black") {
        filter = "saturate(0%) brightness(30%)";
    } else if (hairColor === "white") {
        filter = "saturate(0%) brightness(190%)";
    } else if (hairColor === "grey") {
        filter = "saturate(0%) brightness(130%)";
    } else if (hairColor === "red") {
        filter = "hue-rotate(-230deg) saturate(170%)";
    }
    
    context.filter = filter;
    context.drawImage(hairImage, 0, 0);
    context.filter = "none";
}

function drawAddOn(context, addOnDetails) {
    if (!addOnDetails) {
        return;
    }
    context.save();
    context.translate(addOnDetails.translationX, addOnDetails.translationY);
    if (addOnDetails.drawAsHair) {
        drawHairWithColor(context, document.getElementById(addOnDetails.id), addOnDetails.hair);
    } else {
        context.drawImage(document.getElementById(addOnDetails.id), 0, 0);
    }
    context.restore();
}

function drawArmAddOn(context, armType, addOnDetails) {
    armDetails = armData[armType];
    if (!addOnDetails || !armDetails) {
        return;
    }
    
    context.save();
    context.translate(armDetails.handX, armDetails.handY);
    if (armDetails.rotation) {
        context.rotate(armDetails.rotation * Math.PI / 180);
    }
    context.translate(-addOnDetails.handX, -addOnDetails.handY);
    if (addOnDetails.drawAsHair) {
        drawHairWithColor(context, document.getElementById(addOnDetails.id), addOnDetails.hair);
    } else {
        context.drawImage(document.getElementById(addOnDetails.id), 0, 0);
    }
    context.restore();
}

function drawCharacter(context, championId) {
    context.save();
    var champion = championData[championId];
    var hairColor;
    if (champion) {
        hairColor = champion.hair;
    } else {
        hairColor = generateRandomHairColor();
    }
    if (champion) {
        if (champion.longHair) {
            drawLongHair(context, hairColor);
        }
    } else if (Math.random() < 0.5) {
        drawLongHair(context, hairColor);
    }
    
    context.drawImage(headImage, 0, 0);
    drawHair(context, hairColor);
    drawBody(context, champion, championId);
    if (champion) {
        drawAddOn(context, champion.addOnAfterHead);
    }
    context.restore();
}

function drawLongHair(context, hairColor) {
    if (hairColor === "none") {
        return;
    }
    context.save();
    context.translate(6, 75);
    drawHairWithColor(context, longHairImage, hairColor);
    context.restore();
}

function drawHair(context, hairColor) {
    if (hairColor === "none") {
        return;
    }
    context.save();
    context.translate(-9, -5);
    drawHairWithColor(context, hairImage, hairColor);
    context.restore();
}

function drawBody(context, champion, championId) {
    context.save();
    context.translate(27, headImage.height - 14);
    var hueRotationDegrees = Math.floor(Math.random() * 360);
    drawPants(context, champion);
    drawRightSleeve(context, hueRotationDegrees, champion, championId, false);
    drawLeftSleeve(context, hueRotationDegrees, champion, championId, false);
    drawImageWithHueRotation(context, shirtImage, hueRotationDegrees);
    if (champion) {
        drawAddOn(context, champion.addOnAfterShirt);
    }
    drawRightSleeve(context, hueRotationDegrees, champion, championId, true);
    drawLeftSleeve(context, hueRotationDegrees, champion, championId, true);
    context.restore();
}

function drawRightSleeve(context, hueRotationDegrees, champion, championId, drawAddOns) {
    context.save();
    context.translate(-6, 1);
    armType = "rightArmStraight";
    if (championId < 100) {
        // TODO: replace with an actual condition
        armType = "rightArmBent";
    }
    drawRightArm(context, champion, armType, drawAddOns);
    if (!drawAddOns) {
        drawImageWithHueRotation(context, rightSleeveImage, hueRotationDegrees);
    }
    context.restore();
}

function drawRightArm(context, champion, armType, drawAddOns) {
    context.save();
    context.translate(armData[armType].translationX, armData[armType].translationY);
    if (!drawAddOns) {
        context.drawImage(armData[armType].image, 0, 0);
    }
    if (champion && drawAddOns) {
        drawArmAddOn(context, armType, champion.addOnAfterRightArm);
    }
    context.restore();
}

function drawLeftSleeve(context, hueRotationDegrees, champion, championId, drawAddOns) {
    context.save();
    context.translate(shirtImage.width - 17, 0);
    armType = "leftArmStraight";
    if (championId < 100) {
        // TODO: replace with an actual condition
        armType = "leftArmBent";
    }
    drawLeftArm(context, champion, armType, drawAddOns);
    if (!drawAddOns) {
        drawImageWithHueRotation(context, leftSleeveImage, hueRotationDegrees);
    }
    context.restore();
}

function drawLeftArm(context, champion, armType, drawAddOns) {
    context.save();
    context.translate(armData[armType].translationX, armData[armType].translationY);
    if (!drawAddOns) {
        context.drawImage(armData[armType].image, 0, 0);
    }
    if (champion && drawAddOns) {
        drawArmAddOn(context, armType, champion.addOnAfterLeftArm);
    }
    context.restore();
}

function drawPants(context, champion) {
    context.save();
    context.translate(-4, shirtImage.height - 7);
    drawRightFoot(context);
    drawLeftFoot(context);
    drawImageWithHueRotation(context, pantsImage);
    if (champion) {
        drawAddOn(context, champion.addOnAfterPants);
    }
    context.restore();
}

function drawRightFoot(context) {
    context.save();
    context.translate(0, pantsImage.height - 9);
    context.drawImage(rightFootImage, 0, 0);
    context.restore();
}

function drawLeftFoot(context) {
    context.save();
    context.translate(pantsImage.width - 24, pantsImage.height - 9);
    context.drawImage(leftFootImage, 0, 0);
    context.restore();
}
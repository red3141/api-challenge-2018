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
var rightSleeveImage;
var rightArmImage;
var pantsImage;
var leftFootImage;
var rightFootImage;

function prepareImages() {
    headImage = document.getElementById("headImage");
    hairImage = document.getElementById("hairImage");
    longHairImage = document.getElementById("longHairImage");
    shirtImage = document.getElementById("shirtImage");
    leftSleeveImage = document.getElementById("leftSleeveImage");
    leftArmImage = document.getElementById("leftArmImage");
    rightSleeveImage = document.getElementById("rightSleeveImage");
    rightArmImage = document.getElementById("rightArmImage");
    pantsImage = document.getElementById("pantsImage");
    leftFootImage = document.getElementById("leftFootImage");
    rightFootImage = document.getElementById("rightFootImage");
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
        drawCharacter(context);
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

function drawCharacter(context) {
    context.save();
    var hairHueRotationDegrees = Math.floor(Math.random() * 360);
    if (Math.random() < 0.5) {
        drawLongHair(context, hairHueRotationDegrees);
    }
    context.drawImage(headImage, 0, 0);
    drawHair(context, hairHueRotationDegrees);
    drawBody(context);
    context.restore();
}

function drawLongHair(context, hueRotationDegrees) {
    context.save();
    context.translate(3, 70);
    //drawImageWithHueRotation(context, longHairImage, hueRotationDegrees);
    context.restore();
}

function drawHair(context, hueRotationDegrees) {
    context.save();
    context.translate(-7, -5);
    //drawImageWithHueRotation(context, hairImage, hueRotationDegrees);
    context.restore();
}

function drawBody(context) {
    context.save();
    context.translate(27, headImage.height - 14);
    var hueRotationDegrees = Math.floor(Math.random() * 360);
    drawRightSleeve(context, hueRotationDegrees);
    drawLeftSleeve(context, hueRotationDegrees);
    drawPants(context);
    drawImageWithHueRotation(context, shirtImage, hueRotationDegrees);
    context.restore();
}

function drawRightSleeve(context, hueRotationDegrees) {
    context.save();
    context.translate(-6, 1);
    drawRightArm(context);
    drawImageWithHueRotation(context, rightSleeveImage, hueRotationDegrees);
    context.restore();
}

function drawRightArm(context) {
    context.save();
    context.translate(-(rightArmImage.width - 18), rightSleeveImage.height - 8);
    context.drawImage(rightArmImage, 0, 0);
    context.restore();
}

function drawLeftSleeve(context, hueRotationDegrees) {
    context.save();
    context.translate(shirtImage.width - 17, 0);
    drawLeftArm(context);
    drawImageWithHueRotation(context, leftSleeveImage, hueRotationDegrees);
    context.restore();
}

function drawLeftArm(context) {
    context.save();
    context.translate(leftSleeveImage.width - 18, leftSleeveImage.height - 10);
    context.drawImage(leftArmImage, 0, 0);
    context.restore();
}

function drawPants(context) {
    context.save();
    context.translate(-4, shirtImage.height - 7);
    drawRightFoot(context);
    drawLeftFoot(context);
    drawImageWithHueRotation(context, pantsImage);
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
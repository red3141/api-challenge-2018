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

function draw() {
  console.log("DRAWING");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  var image = document.getElementById("image");

  drawCharacter(context, image);
  
  championMasteryUpdateData = undefined;
  eogStatsBlockData = undefined;
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
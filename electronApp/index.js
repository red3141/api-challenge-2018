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
//var eogStatsBlockData;
var eogStatsBlockDataProcessed = [];
var eogDidWin = false;

function handleChampionMasteryUpdates(data) {
    //console.log("ChampionMasteryUpdates: " + data);
    championMasteryUpdateData = data;
    //if (eogStatsBlockData) {
    //    draw();
    //}
}

function handleEogStatsBlock(data) {
    console.log("EogStatsBlock: " + data);
    //eogStatsBlockData = data;
    processEogStatsBlockData(data);
    draw();
    //if (championMasteryUpdateData) {
    //    draw();
    //}
}

function processEogStatsBlockData(data) {
    var teams = data.data.teams;
    var playersTeam = teams[0].isPlayerTeam ? teams[0] : teams[1];
    var didPlayerWin = playersTeam.isWinningTeam;
    eogDidWin = didPlayerWin;
    var teamAssists = playersTeam.stats.ASSISTS;
    var teamKills = playersTeam.stats.CHAMPIONS_KILLED;
    var teamDeaths = playersTeam.stats.NUM_DEATHS;
    var teamGold = playersTeam.stats.GOLD_EARNED;
    var teamLevel = playersTeam.stats.LEVEL;
    var teamDamageToChampions = playersTeam.stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS;
    var teamDamageToObjectives = playersTeam.stats.TOTAL_DAMAGE_DEALT_TO_OBJECTIVES;
    var teamVisionScore = playersTeam.stats.VISION_SCORE;
    
    eogStatsBlockDataProcessed = [];
    
    console.log("" + playersTeam.players.toString());
    
    for (var i = 0; i < playersTeam.players.length; ++i) {
        var player = playersTeam.players[i];
        var processedPlayer = {};
        processedPlayer.championId = player.championId;
        var celebrationLevel = 0;
        
        var kda = 0;
        if (player.stats.NUM_DEATHS == 0) {
            kda = (player.stats.CHAMPIONS_KILLED + player.stats.ASSISTS);
        } else {
            kda = (player.stats.CHAMPIONS_KILLED + player.stats.ASSISTS) / player.stats.NUM_DEATHS;
        }
        if (kda > 5) {
            celebrationLevel += 10;
        } else if (kda > 3) {
            celebrationLevel += 5;
        } else if (kda > 2) {
            celebrationLevel += 2;
        }
        
        if (teamGold > 0) {
            var fractionOfTeamsGold = player.stats.GOLD_EARNED / teamGold;
            if (fractionOfTeamsGold > 0.4) {
                celebrationLevel += 10;
            } else if (fractionOfTeamsGold > 0.2) {
                celebrationLevel += 5;
            } else if (fractionOfTeamsGold > 0.15) {
                celebrationLevel += 2;
            }
        }
        
        if (teamDamageToChampions > 0) {
            var fractionOfTeamsDamageToChampions = player.stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS / teamDamageToChampions;
            if (fractionOfTeamsDamageToChampions > 0.4) {
                celebrationLevel += 10;
            } else if (fractionOfTeamsDamageToChampions > 0.2) {
                celebrationLevel += 5;
            } else if (fractionOfTeamsDamageToChampions > 0.15) {
                celebrationLevel += 2;
            }
        }
        
        if (teamDamageToObjectives > 0) {
            var fractionOfTeamsDamageToObjectives = player.stats.TOTAL_DAMAGE_DEALT_TO_OBJECTIVES / teamDamageToObjectives;
            if (fractionOfTeamsDamageToObjectives > 0.4) {
                celebrationLevel += 10;
            } else if (fractionOfTeamsDamageToObjectives > 0.2) {
                celebrationLevel += 5;
            } else if (fractionOfTeamsDamageToObjectives > 0.15) {
                celebrationLevel += 2;
            }
        }
        
        if (teamVisionScore > 0) {
            var fractionOfTeamsVisionScore = player.stats.VISION_SCORE / teamVisionScore;
            if (fractionOfTeamsVisionScore > 0.4) {
                celebrationLevel += 10;
            } else if (fractionOfTeamsVisionScore > 0.2) {
                celebrationLevel += 5;
            } else if (fractionOfTeamsVisionScore > 0.15) {
                celebrationLevel += 2;
            }
        }
        
        if (teamLevel > 0) {
            var fractionOfTeamsLevel = player.stats.LEVEL / teamLevel;
            if (fractionOfTeamsVisionScore > 0.15) {
                celebrationLevel += 5;
            }
        }
        
        if (player.stats.LARGEST_MULTI_KILL >= 5) {
            celebrationLevel += 100;
        }
        
        if (didPlayerWin) {
            if (celebrationLevel > 100) {
                processedPlayer.facialExpression = faceDealWithItImage;
            } else if (celebrationLevel > 15) {
                processedPlayer.facialExpression = faceHappyImage;
            } else if (celebrationLevel > 0) {
                processedPlayer.facialExpression = faceFrustratedImage;
            } else {
                processedPlayer.facialExpression = faceDeadImage;
            }
            
            if (celebrationLevel > 35) {
                processedPlayer.leftArmRaised = true;
                processedPlayer.rightArmRaised = true;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
            } else if (celebrationLevel > 23) {
                processedPlayer.leftArmRaised = false;
                processedPlayer.rightArmRaised = false;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
            } else if (celebrationLevel > 15) {
                processedPlayer.leftArmRaised = false;
                processedPlayer.rightArmRaised = false;
                processedPlayer.leftArm = "leftArmBent";
                processedPlayer.rightArm = "rightArmBent";
            } else if (celebrationLevel > 0) {
                processedPlayer.leftArmRaised = false;
                processedPlayer.rightArmRaised = false;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
            } else {
                processedPlayer.leftArmRaised = Math.random() > 0.5;
                processedPlayer.rightArmRaised = Math.random() > 0.5;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
            }
            
            if (celebrationLevel > 0) {
                processedPlayer.layingDown = false;
            } else {
                processedPlayer.layingDown = true;
            }
        } else {
            if (celebrationLevel > 100) {
                processedPlayer.facialExpression = faceDealWithItImage;
                processedPlayer.leftArmRaised = true;
                processedPlayer.rightArmRaised = true;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
                processedPlayer.layingDown = false;
            } else if (celebrationLevel > 30) {
                processedPlayer.facialExpression = faceFrustratedImage;
                processedPlayer.leftArmRaised = false;
                processedPlayer.rightArmRaised = false;
                processedPlayer.leftArm = "leftArmBent";
                processedPlayer.rightArm = "rightArmBent";
                processedPlayer.layingDown = false;
            } else if (celebrationLevel > 40) {
                processedPlayer.facialExpression = faceFrustratedImage;
                processedPlayer.leftArmRaised = true;
                processedPlayer.rightArmRaised = true;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
                processedPlayer.layingDown = false;
            } else {
                processedPlayer.facialExpression = faceDeadImage;
                processedPlayer.leftArmRaised = Math.random() > 0.5;
                processedPlayer.rightArmRaised = Math.random() > 0.5;
                processedPlayer.leftArm = "leftArmStraight";
                processedPlayer.rightArm = "rightArmStraight";
                processedPlayer.layingDown = true;
            }
        }
        
        eogStatsBlockDataProcessed.push(processedPlayer);
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
var faceHappyImage;
var faceDeadImage;
var faceFrustratedImage;
var faceDealWithItImage;
var backgroundRedImage;
var backgroundBlueImage;
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
    
    faceHappyImage = document.getElementById("faceHappyImage");
    faceDeadImage = document.getElementById("faceDeadImage");
    faceFrustratedImage = document.getElementById("faceFrustratedImage");
    faceDealWithItImage = document.getElementById("faceDealWithItImage");
    
    backgroundRedImage = document.getElementById("backgroundRed");
    backgroundBlueImage = document.getElementById("backgroundBlue");
    
    armData = {"rightArmStraight": {"image": rightArmImage, "translationX": -30, "translationY": 22, "handX": 14, "handY": 60},
               "leftArmStraight": {"image": leftArmImage, "translationX": 7, "translationY": 20, "handX": 32, "handY": 60},
               "rightArmBent": {"image": rightArmBentImage, "translationX": -34, "translationY": 0, "handX": 14, "handY": 10, "rotation": 0},
               "leftArmBent": {"image": leftArmBentImage, "translationX": 7, "translationY": 0, "handX": 35, "handY": 10, "rotation": 0}};
    
    // uncomment this line to draw right away, instead of waiting for the end game stats to be ready
    //draw();
}

function draw() {
    /*eogDidWin = false;
    eogStatsBlockDataProcessed = [
        {
            "championId": 21,
            "facialExpression": faceDealWithItImage,
            "leftArmRaised": true,
            "rightArmRaised": true,
            "leftArm": "leftArmStraight",
            "rightArm": "rightArmStraight",
            "layingDown": false
        },
        {
            "championId": 150,
            "facialExpression": faceDeadImage,
            "leftArmRaised": Math.random() > 0.5,
            "rightArmRaised": Math.random() > 0.5,
            "leftArm": "leftArmStraight",
            "rightArm": "rightArmStraight",
            "layingDown": false
        },
        {
            "championId": 81,
            "facialExpression": faceFrustratedImage,
            "leftArmRaised": false,
            "rightArmRaised": false,
            "leftArm": "leftArmStraight",
            "rightArm": "rightArmStraight",
            "layingDown": false
        },
        {
            "championId": 42,
            "facialExpression": faceDeadImage,
            "leftArmRaised": Math.random() > 0.5,
            "rightArmRaised": Math.random() > 0.5,
            "leftArm": "leftArmStraight",
            "rightArm": "rightArmStraight",
            "layingDown": false
        },
        {
            "championId": 24,
            "facialExpression": faceHappyImage,
            "leftArmRaised": false,
            "rightArmRaised": false,
            "leftArm": "leftArmBent",
            "rightArm": "rightArmBent",
            "layingDown": false
        },
    ];*/
    
    console.log("DRAWING");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    if (eogDidWin) {
        context.drawImage(backgroundRedImage, 0, 0); 
    } else {
        context.drawImage(backgroundBlueImage, 0, 0); 
    }
    
    context.translate(170, 300);
    if (eogStatsBlockDataProcessed && eogStatsBlockDataProcessed.length > 0) {
        console.log(eogStatsBlockDataProcessed);
        for (var i = 0; i < eogStatsBlockDataProcessed.length; ++i) {
            character = eogStatsBlockDataProcessed[i];
            context.save();
            if (character.layingDown) {
                var rotateClockwise = Math.random() > 0.5;
                // Having the upper arm raised and straight looks a little weird if the character is
                // lying down, so prevent that.
                if (rotateClockwise && character.rightArmRaised) {
                    character.rightArm = "rightArmBent";
                } else if (!rotateClockwise && character.leftArmRaised) {
                    character.leftArm = "leftArmBent";
                }
                context.translate(rotateClockwise ? 180 : -80, rotateClockwise ? 200 : 300);
                context.rotate((rotateClockwise ? 90 : -90) * Math.PI / 180);
            }
            drawCharacter(context, character);
            context.restore();
            context.translate(180, 0);
            if (i == 1) {
                context.translate(240, 0);
            }
        }
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
    } else if (hairColor === "darkRed") {
        filter = "hue-rotate(-230deg) saturate(150%) brightness(75%)";
    } else if (hairColor === "purple") {
        filter = "hue-rotate(40deg) saturate(120%) brightness(75%)";
    } else if (hairColor === "pink") {
        filter = "hue-rotate(100deg)";
    } else if (hairColor === "darkPink") {
        filter = "hue-rotate(100deg) brightness(60%)";
    } else if (hairColor === "orange") {
        filter = "hue-rotate(-200deg) saturate(170%) brightness(130%)";
    } else if (hairColor === "blue") {
        filter = "hue-rotate(10deg) saturate(170%) brightness(60%)";
    } else if (hairColor === "green") {
        filter = "hue-rotate(-70deg) brightness(90%)";
    } else if (hairColor === "spookyGreen") {
        filter = "hue-rotate(-70deg) brightness(140%)";
    } else if (hairColor === "lightGreen") {
        filter = "hue-rotate(-110deg) brightness(130%)";
    } else if (hairColor === "tan") {
        filter = "hue-rotate(-170deg) saturate(30%) brightness(160%)";
    } else if (hairColor === "lightBlue") {
        filter = "hue-rotate(-10deg) saturate(130%) brightness(130%)";
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

function drawArmAddOn(context, armType, armRaisedCompensationRotation, addOnDetails) {
    armDetails = armData[armType];
    if (!addOnDetails || !armDetails) {
        return;
    }
    
    context.save();
    context.translate(armDetails.handX, armDetails.handY);
    if (armDetails.rotation) {
        context.rotate(armDetails.rotation * Math.PI / 180);
    }
    if (addOnDetails.rotation) {
        context.rotate(addOnDetails.rotation * Math.PI / 180);
    }
    context.rotate(armRaisedCompensationRotation * Math.PI / 180);
    context.translate(-addOnDetails.handX, -addOnDetails.handY);
    if (addOnDetails.drawAsHair) {
        drawHairWithColor(context, document.getElementById(addOnDetails.id), addOnDetails.hair);
    } else {
        context.drawImage(document.getElementById(addOnDetails.id), 0, 0);
    }
    context.restore();
}

function drawCharacter(context, character) {
    context.save();
    var champion = championData[character.championId.toString()];
    var hairColor;
    if (champion) {
        hairColor = champion.hair;
    } else {
        hairColor = generateRandomHairColor();
    }
    
    if (champion) {
        drawAddOn(context, champion.addOnBeforeHead);
    }
    
    if (champion && champion.longHair) {
        drawLongHair(context, hairColor);
    }
    
    context.drawImage(headImage, 0, 0);
    if (!champion || !champion.hideFace) {
        drawFacialExpression(context, character);
    }
    drawHair(context, hairColor);
    drawBody(context, champion, character);
    if (champion) {
        drawAddOn(context, champion.addOnAfterHead);
    }
    context.restore();
}

function drawFacialExpression(context, character) {
    var facialExpression = faceHappyImage;
    if (character.facialExpression) {
        facialExpression = character.facialExpression;
    }
    context.drawImage(facialExpression, 0, 0);
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

function drawBody(context, champion, character) {
    context.save();
    context.translate(27, headImage.height - 14);
    var hueRotationDegrees = Math.floor(Math.random() * 360);
    if (champion) {
        drawAddOn(context, champion.addOnBeforeShirt);
    }
    drawPants(context, champion);
    drawRightSleeve(context, hueRotationDegrees, champion, character, false);
    drawLeftSleeve(context, hueRotationDegrees, champion, character, false);
    drawImageWithHueRotation(context, shirtImage, hueRotationDegrees);
    if (champion) {
        drawAddOn(context, champion.addOnAfterShirt);
    }
    drawRightSleeve(context, hueRotationDegrees, champion, character, true);
    drawLeftSleeve(context, hueRotationDegrees, champion, character, true);
    context.restore();
}

function drawRightSleeve(context, hueRotationDegrees, champion, character, drawAddOns) {
    context.save();
    context.translate(-6, 1);
    armType = character.rightArm;
    armRaised = character.rightArmRaised;
    if (armRaised) {
        context.rotate(105 * Math.PI / 180);
        context.translate(-10, -26);
    }
    drawRightArm(context, champion, armType, armRaised, drawAddOns);
    if (!drawAddOns) {
        drawImageWithHueRotation(context, rightSleeveImage, hueRotationDegrees);
    }
    context.restore();
}

function drawRightArm(context, champion, armType, armRaised, drawAddOns) {
    context.save();
    context.translate(armData[armType].translationX, armData[armType].translationY);
    if (!drawAddOns) {
        context.drawImage(armData[armType].image, 0, 0);
    }
    if (champion && drawAddOns) {
        var armCompensationRotation = armRaised ? -90 : 0;
        // Ezreal power glove special case
        if (champion.addOnAfterRightArm && champion.addOnAfterRightArm.id === "ezrealRightHand") {
            if (!armRaised && armType === "rightArmBent") {
                armCompensationRotation = 110;
            } else if (armRaised) {
                if (armType === "rightArmStraight") {
                    armCompensationRotation = 0;
                } else if (armType === "rightArmBent") {
                    armCompensationRotation = 120;
                }
            }
        }
        drawArmAddOn(context, armType, armCompensationRotation, champion.addOnAfterRightArm);
    }
    context.restore();
}

function drawLeftSleeve(context, hueRotationDegrees, champion, character, drawAddOns) {
    context.save();
    context.translate(shirtImage.width - 17, 0);
    armType = character.leftArm;
    armRaised = character.leftArmRaised;
    if (armRaised) {
        context.rotate(-105 * Math.PI / 180);
        context.translate(-20, -5);
    }
    drawLeftArm(context, champion, armType, armRaised, drawAddOns);
    if (!drawAddOns) {
        drawImageWithHueRotation(context, leftSleeveImage, hueRotationDegrees);
    }
    context.restore();
}

function drawLeftArm(context, champion, armType, armRaised, drawAddOns) {
    context.save();
    context.translate(armData[armType].translationX, armData[armType].translationY);
    if (!drawAddOns) {
        context.drawImage(armData[armType].image, 0, 0);
    }
    if (champion && drawAddOns) {
        drawArmAddOn(context, armType, armRaised ? 90 : 0, champion.addOnAfterLeftArm);
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
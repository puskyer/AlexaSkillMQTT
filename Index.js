
/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var mqtt = require('mqtt');

var Skill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Skill.prototype = Object.create(AlexaSkill.prototype);
Skill.prototype.constructor = Skill;

Skill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Skill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Skill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Skill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to your Skill";
    var repromptText = "You can ask for bla bla here";
    response.ask(speechOutput, repromptText);
};

Skill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Skill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Skill.prototype.intentHandlers = {
    // change here your intent name
    "IntentName": function (intent, session, response) {

        var optionsMqtt = {
            port: 12345, //port number to change
            clientId: 'mqtt_lambda' + Math.random().toString(16).substr(2, 8),
            username: 'your MQTT Provider userName',
            password: 'your Mqtt Provider password',
        };

        var client  = mqtt.connect('mqtt_url_provider',optionsMqtt);

        client.publish('your topic', 'value here', function() {
            client.end();
            response.tellWithCard("the message you wanna speech", "Skill", "Skill");
        });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Help message", "");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var skill = new Skill();
    skill.execute(event, context);
};


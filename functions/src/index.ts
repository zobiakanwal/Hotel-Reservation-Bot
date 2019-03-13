//'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

const { WebhookClient } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.firestorehotelreservation = functions.https.onRequest((request, response) => {


  //const _agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const params = request.body.queryResult.parameters   //intializing parameters

  //const intentName = request.body.queryResult.intent.displayName   //getting parameters from dialogflow
  //console.log("Intent name", intentName);   
  // exports.firestorehotelreservation = functions.https.onRequest((request, response) => {
  // let params = request.body.result.parameters;

  switch (request.body.result.action) {
    case 'input.welcome':
      //let params = request.body.result.parameters;
      firestore.collection('orders').add(params)
        .then((agent) => {
          // response.send({
          //   speech: "Welcome to my agent!"
          // });
          agent.add(`Welcome to my agent!`);
        })
        .catch((e => {
          console.log("error: ", e);
          response.send({
            speech: "something went wrong when writing on database"
          });
        }))
      break;
    case 'input.unknown':
      firestore.collection('orders').add(params)
        .then((agent) => {
          agent.add(`I didn't understand`);
          agent.add(`I'm sorry, can you try again?`);
        })

        .catch((e => {
          console.log("error: ", e);
          response.send({
            speech: "something went wrong when writing on database"
          });
        }))
      break;
    case 'RoomBooking':
      firestore.collection('orders').add(params)
        .then((agent) => {
          agent.add(`${params.name} your hotel booking request for ${params.RoomType}room is forwarded for 
          ${params.persons}persons. We will contact you on ${params.email} soon`);
        })
        .catch((e => {
          console.log("error: ", e);
          response.send({
            speech: "something went wrong when writing on database"
          });
        }))
      break;
    case 'complaint':
      firestore.collection('orders').add(params)
        .then((agent) => {
          agent.add(`Your ${params.typeFeedback} is duly noted against: \n Subject: ${params.subject}.
          \n Description: ${params.description}`);
        })
        .catch((e => {
          console.log("error: ", e);
          response.send({
            speech: "something went wrong when writing on database"
          });
        }))
      break;
    default:
      response.send({
        speech: "no action matched in webhook"
      })
  }
});


  // // Run the proper handler based on the matched Dialogflow intent
  // const intentMap = new Map();
  // intentMap.set('Default Welcome Intent', welcome);
  // intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('RoomBooking', roombooking);
  // intentMap.set('Complaint', complaint);


  // _agent.handleRequest(intentMap);
  // });

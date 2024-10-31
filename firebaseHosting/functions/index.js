/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// lines 12-15 taken from
// https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js
const required = require("firebase-functions/v1");
const admin = require("firebase-admin");
const app = admin.initializeApp();
require("dotenv").config();

// line 19 taken from https://firebase.google.com/docs/hosting/serverless-overview
exports.search = required.https.onRequest(async (request, response) => {
  // lines 21-31 taken from
  // https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js
  if (!request.headers.authorization) {
    response.status(401).send("Unauthorized");
    return;
  }

  try {
    await app.auth().verifyIdToken(request.headers.authorization);
  } catch (e) {
    response.status(401).send("Unauthorized");
    return;
  }

  const url = `https://api.ucsb.edu/academics/curriculums/v3/classes/search${request.url.slice(1)}`;
  const headers = new Headers();
  headers.append("ucsb-api-key", process.env.UCSB_API_KEY);
  headers.append("accept", "application/json");
  headers.append("ucsb-api-version", "3.0");
  const sendRequest = new Request(url, {headers: headers} );
  const gotResponse = await fetch(sendRequest).then((response) => response.json());
  response.send(gotResponse);
});

// line 43 taken from https://firebase.google.com/docs/hosting/serverless-overview
exports.poll = required.https.onRequest(async (request, response) => {
  // lines 45-56 taken from
  // https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js
  if (!request.headers.authorization) {
    response.status(401).send("Unauthorized");
    return;
  }

  try {
    await app.auth().verifyIdToken(request.headers.authorization);
  } catch (e) {
    response.status(401).send("Unauthorized");
    return;
  }

  const url =
      `https://api.ucsb.edu/academics/curriculums/v3/classes${request.url}`
  const headers = new Headers();
  headers.append("ucsb-api-key", process.env.UCSB_API_KEY);
  headers.append("accept", "application/json");
  headers.append("ucsb-api-version", "3.0");
  const sendRequest = new Request(url, {headers: headers} );
  const gotResponse = await fetch(sendRequest).then((response) => response.json());
  response.send(gotResponse);
});

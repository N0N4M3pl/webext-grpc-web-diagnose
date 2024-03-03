"use strict";

var browser = browser || chrome;

let certStats = {};

async function logRootCert(details) {
  try {
    let securityInfo = await browser.webRequest.getSecurityInfo(
      details.requestId,
      {"certificateChain": true}
    );
    securityInfo.certificates.forEach(cert => {
      let certSubject = cert.subject;
      if (certStats[certSubject] === undefined) {
        certStats[certSubject] = 1;
      } else {
        certStats[certSubject] = certStats[certSubject] + 1;
      }
      
    });
  }
  catch(error) {
    console.error(error);
  }
}

function logOnBeforeRequest(requestDetails) {
  console.log(`logOnBeforeRequest: ${requestDetails.url}`);
}
function logOnBeforeSendHeaders(requestDetails) {
  console.log(`logOnBeforeSendHeaders: ${requestDetails.url}`);
}
function logOnSendHeaders(requestDetails) {
  console.log(`logOnSendHeaders: ${requestDetails.url}`);
}
function logOnResponseStartedL(requestDetails) {
  console.log(`logOnResponseStartedL: ${requestDetails.url}`);
}
function logOnCompleted(requestDetails) {
  console.log(`logOnCompleted: ${requestDetails.url}`);
}
function logOnErrorOccurred(requestDetails) {
  console.log(`logOnErrorOccurred: ${requestDetails.url}`);
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest
browser.webRequest.onBeforeRequest.addListener(logOnBeforeRequest, {urls: ["*://*.xtb.com/*"]});
browser.webRequest.onBeforeSendHeaders.addListener(logOnBeforeSendHeaders, {urls: ["*://*.xtb.com/*"]});
browser.webRequest.onSendHeaders.addListener(logOnSendHeaders, {urls: ["*://*.xtb.com/*"]});
browser.webRequest.onHeadersReceived.addListener(logRootCert, {urls: ["*://*.xtb.com/*"]}, ["blocking"]);
browser.webRequest.onResponseStarted.addListener(logOnResponseStartedL, {urls: ["*://*.xtb.com/*"]});
browser.webRequest.onCompleted.addListener(logOnCompleted, {urls: ["*://*.xtb.com/*"]});
browser.webRequest.onErrorOccurred.addListener(logOnErrorOccurred, {urls: ["*://*.xtb.com/*"]});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getRootCertStats") {
    sendResponse({ certStats: certStats });
  }
});

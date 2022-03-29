// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";

// Import from "@inrupt/solid-client"
import {
  getSolidDataset,
  getThing,
  getStringNoLocale
} from "@inrupt/solid-client";

import { VCARD, FOAF } from "@inrupt/vocab-common-rdf";

const buttonLogin = document.querySelector("#btnLogin");
const buttonRead = document.querySelector("#btnRead");

// 1a. Start Login Process. Call login() function.
function loginToInruptDotCom() {
  return login({

    oidcIssuer: "https://broker.pod.inrupt.com",

    redirectUrl: window.location.href,
    clientName: "Getting started app"
  });
}

// 1b. Login Redirect. Call handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    document.getElementById("labelStatus").textContent = "Your session is logged in.";
    document.getElementById("labelStatus").setAttribute("role", "alert");
  }
}

// The example has the login redirect back to the index.html.
// This calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();

// 2. Read profile
async function readProfile() {
  const webID = document.getElementById("webID").value;

  // The example assumes the WebID has the URI <profileDocumentURI>#<fragment> where
  // <profileDocumentURI> is the URI of the SolidDataset
  // that contains profile data.
  
  // Parse ProfileDocument URI from the `webID` value.
  const profileDocumentURI = webID.split('#')[0];
  document.getElementById("labelProfile").textContent = profileDocumentURI;


  // Use `getSolidDataset` to get the Profile document.
  // Profile document is public and can be read w/o authentication; i.e.: 
  // - You can either omit `fetch` or 
  // - You can pass in `fetch` with or without logging in first. 
  //   If logged in, the `fetch` is authenticated.
  // For illustrative purposes, the `fetch` is passed in.
  const myDataset = await getSolidDataset(profileDocumentURI, { fetch: fetch });

  // Get the Profile data from the retrieved SolidDataset
  const profile = getThing(myDataset, webID);

  // Get the formatted name using `FOAF.name` convenience object.
  // `FOAF.name` includes the identifier string "http://xmlns.com/foaf/0.1/name".
  // As an alternative, you can pass in the "http://xmlns.com/foaf/0.1/name" string instead of `FOAF.name`.
 
  const fn = getStringNoLocale(profile, FOAF.name);

  // Get the role using `VCARD.role` convenience object.
  // `VCARD.role` includes the identifier string "http://www.w3.org/2006/vcard/ns#role"
  // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#role" string instead of `VCARD.role`.

  const role = getStringNoLocale(profile, VCARD.role);

  // Update the page with the retrieved values.
  document.getElementById("labelFN").textContent = fn;
  document.getElementById("labelRole").textContent = role;
}

buttonLogin.onclick = function() {  
  loginToInruptDotCom();
};

buttonRead.onclick = function() {  
  readProfile();
};
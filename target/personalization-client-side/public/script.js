/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
function createIdentityPayload(
  id,
  authenticatedState = "ambiguous",
  primary = true
) {
  if (id.length === 0) {
    return undefined;
  }

  return {
    id,
    authenticatedState,
    primary,
  };
}

function sendDisplayEvent(decision) {
  const { id, scope, scopeDetails = {} } = decision;

  alloy("sendEvent", {
    xdm: {
      eventType: "decisioning.propositionDisplay",
      _experience: {
        decisioning: {
          propositions: [
            {
              id: id,
              scope: scope,
              scopeDetails: scopeDetails,
            },
          ],
        },
      },
    },
  });
}

function updateButtons(buttonActions) {
  buttonActions.forEach((buttonAction) => {
    const { id, text, content } = buttonAction;

    const element = document.getElementById(`action-button-${id}`);
    element.innerText = text;

    element.addEventListener("click", () => alert(content));
  });
}

function applyPersonalization(decisionScopeName) {
  return function (result) {
    const { propositions = [], decisions = [] } = result;

    // send display event for the decision scope / target mbox
    // decisions.forEach((decision) => sendDisplayEvent(decision));

    // const mbox = propositions.find(
    //   (proposition) => proposition.scope === decisionScopeName
    // );

    const mbox = true;

    if (mbox) {
      // console.log(JSON.stringify(mbox));
      const element = document.querySelector("img.target-offer");

      const {
        buttonActions = [],
        heroImageName = "demo-marketing-offer1-default.png",
      // } = mbox.items[0].data.content;
      } = personalizationContent;

      updateButtons(buttonActions);

      element.src = `img/${heroImageName}`;
    }
  };
}

function displayError(err) {
  const containerElement = document.getElementById("main-container");
  if (!containerElement) {
    return;
  }

  containerElement.innerHTML = `<div id="error-detail" class="page-header">
                                      <h3>&#128565; There was an error</h3>
                                      <div class="alert alert-danger" role="alert">${err.message}</div>
                                    </div>`;
}

const personalizationContent =  {
  heroImageName: "demo-marketing-offer1-exp-B.png",
  buttonActions: [
    {
      "id": 1,
      "text": "Buy now and Save 20%",
      "content": "Thank you for your purchase!"
    },
    {
      "id": 2,
      "text": "Subscribe to the Pod",
      "content": "Thank you for subscribing!"
    },
    {
      "id": 3,
      "text": "Get FREE stuff",
      "content": "Use coupon code THANKYOU at checkout."
    }
  ]
};

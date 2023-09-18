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

function applyPersonalization(surfaceName) {
  return function (result) {
    const { propositions = [], decisions = [] } = result;
    // send display event for the surface
    decisions.forEach((decision) => sendDisplayEvent(decision));

    const proposition = propositions.filter((p) =>
      p.scope.endsWith(surfaceName)
    )[0];

    if (proposition) {
      const element = document.querySelector("img.ajo-decision");

      const {
        buttonActions = [],
        heroImageName = "demo-marketing-decision1-default.png",
      } = proposition.items[0].data.content;

      updateButtons(buttonActions);

      element.src = `img/${heroImageName}`;
    }
  };
}
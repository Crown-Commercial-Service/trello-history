## Summary
A Trello Power-Up that makes the full history of each card available through an additional button on the card. By
default, Trello shows only a subset of historical activity at the bottom of each card. Full(er) History lists all
events (as exposed by Trello) which allows you to see a more detailed view of how things have changed over time.

## Caveats
While Trello does track changes to a card's title and description, there are some things it either does not track or
does not allow end-users to see. Most notably:

* There is no history of the creation, modification, and deletion of individual checklist items
* There is no history of how comments have changed over time - only the current content is available.

## Setup
This Power-Up is built to deploy as a Node.js app on GOV.UK PaaS / Cloud Foundry. It uses the Express framework and Swig
for templating. The power-up relies on an environment variable `TRELLO_DEVELOPER_KEY`.

## Integrating with Trello
Once you have deployed the application and it's publically available, go to [Trello Power-Ups
Admin](https://trello.com/power-ups/admin). Select the team you want to enable the power-up for and then click 'Create
New Power-Up'. Supply a name and the public URL of the deployed app's `manifest.json` file, then save. You will need to
enable the Power-Up on each board individually through the board's menu.

## Existing deployment
This Power-Up is currently deployed on GOV.UK PaaS under digitalmarketplace/sandbox. If you are part of GDS, feel free
to contact Digital Marketplace to use our existing deployment for your integration (sans service guarantees as an
internal tool).

If you are in the Digital Marketplace and want to update the existing deployment, refer to the [PaaS Quick Setup
Guidance](https://docs.cloud.service.gov.uk/#setting-up-the-command-line) for how to login, then run `cf push` from
the root of this directory. The Trello Developer key is stored in the dm-credentials repository under 
`vars/trello.yaml`; if it ever changes, use `cf set-env` to update it.

## Testing changes
Deploy to a personal heroku account or PaaS sandbox and integrate with a personal board. Yep... I've come up with
nothing better in the few seconds I spent thinking about it.

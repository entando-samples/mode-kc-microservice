var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: process.env["KEYCLOAK_CLIENT_ID"],
    bearerOnly: process.env["KEYCLOAK_BEARER_ONLY"],
    serverUrl: process.env["KEYCLOAK_AUTH_URL"],
    realm: process.env["KEYCLOAK_REALM"],
    credentials: {
        secret: process.env["KEYCLOAK_CLIENT_SECRET"]
    }
};

function initKeycloak(memoryStore) {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    }
    else {
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        _keycloak.accessDenied = (request, response) => {
            if(request.headers.authorization) {
                response.status(403).end();
            }else{
                response.status(401).end();
            }
        };
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};

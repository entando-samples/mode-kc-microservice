const express = require('express');
const rewrite = require('express-urlrewrite')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const contextPath = process.env.SERVER_SERVLET_CONTEXT_PATH


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require("express-session");

const app = express();
// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

const keycloak = require('./config/keycloak-config.js').initKeycloak();


app.use(rewrite(contextPath+'/*', '/$1'));
app.use(keycloak.middleware());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(contextPath,express.static(path.join(__dirname, 'public')));


var apiController = require('./controller/api-controller.js');
var healthController = require('./controller/health-controller.js');



app.use('/api', apiController);
app.use('/actuator', healthController);

const options = {
    definition: {
        "openapi": "3.0.1",
        "info": {
            "title": process.env["APP_NAME"],
            "version": process.env["APP_VERSION"]
        },
        "servers": [
            {
                "url": contextPath,
                "description": "Generated server url"
            }
        ],
        "security": [
            {
                "keycloak": [
                    "read",
                    "write"
                ]
            }
        ],
        "components": {
            "schemas": {
                "Response": {
                    "type": "object",
                    "properties": {
                        "metric": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                }
            },
            "securitySchemes": {
                "keycloak": {
                    "type": "oauth2",
                    "flows": {
                        "implicit": {
                            "authorizationUrl": process.env["KEYCLOAK_AUTH_URL"]+"/realms/"+process.env["KEYCLOAK_REALM"]+"/protocol/openid-connect/auth",
                            "scopes": {}
                        }
                    }
                }
            }
        }
    },
    apis: ['./controller/*controller.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
/*
app.use(contextPath+'/api-docs', function (req, res, next) {
    res.json(openapiSpecification)
    next();
});
*/


//https://github.com/scottie1984/swagger-ui-express/issues/152
app.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

module.exports = app;

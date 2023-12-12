const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'EDU_HUB LMS Software Limited',
        description: 'Learning Management easy peasy with EDU_HUB LMS Software Limited'
    },
    host: process.env.URL,
    tags: [
        {
            name: 'Authentication',
            description: 'Authentication endpoint for manage user'
        },
        {
            name: 'Files',
            description: 'File upload endpoint'
        },
        {
            name: 'Pupils',
            description: 'Pupils endpoint'
        },
        {
            name: 'Teaching Center',
            description: "Teaching center dashboard",
        },
        {
            name: 'Telegram Bot',
            description: "Telegram bot endpoint",
        },
        {
            name: 'Topic',
            description: "Topic endpoint",
        },
        {
            name: 'Teachers',
            description: "Teachers endpoint for teaching center",
        },
        {
            name: 'Groups',
            description: "Groups endpoint for teaching center",
        },
        {
            name: 'Localization',
            description: "Localization endpoint",
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Some description...'
        }
    }
};


const APP_ROUTES = [
    './index.js'
];


const outputFile = './swagger.json';

swaggerAutogen(outputFile, APP_ROUTES, doc);


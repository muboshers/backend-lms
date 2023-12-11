const swaggerAutogen = require('swagger-autogen')({openapi: '3.1.0'});


const doc = {
    info: {
        title: 'EDU_HUB LMS Software Limited',
        description: 'Learning Management easy peasy with EDU_HUB LMS Software Limited'
    },
    servers: [
        {
            url: 'http://localhost:5000/',
            description: 'Development server',
        },
        {
            url: 'https://lms-management.vercel.app/',
            description: 'Production server',
        }
    ],
    tags: [
        {
            name: 'Authentication',
            description: 'Authentication endpoint for manage user'
        },
    ],
    securityDefinitions: {},
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};


const APP_ROUTES = [
    './index.js'
];


const outputFile = './swagger.json';

swaggerAutogen(outputFile, APP_ROUTES, doc);


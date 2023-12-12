const swaggerOptions = {
    "openapi": "3.0.0",
    "info": {
        "title": "My API",
        "description": "Description",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:5000/"
        }
    ],
    "paths": {
        "/login": {
            "post": {
                "description": "",
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                },
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "login": {
                                        "example": "any"
                                    },
                                    "password": {
                                        "example": "any"
                                    },
                                    "is_teacher": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/get-me": {
            "get": {
                "description": "",
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        }
    }
}


module.exports = swaggerOptions
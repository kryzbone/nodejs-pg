exports.pagination = (req) => {
    const defaultSize = 10
    let {page=1, page_size=defaultSize} = req.query
    page = page? page : 1
    page_size = page_size? page_size : defaultSize

    let limit = page_size > 100? 100 : page_size
    let offset = (page - 1) * page_size
    offset = offset < 0? 0 : offset
    limit = limit < 0? defaultSize : limit
    return {limit, offset }
}


exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Car Rental API",
            version: "1.0.0",
            description: "REST API documentation for the app",
            license: {
                name: 'licensed Under MIT'
            },
            contact: {
                name: "Kryzbone",
                url: "http://github.com/krybone",
                email: "support@example.com"
            }
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            },
            {
                url: "https://example.com",
                description: "Test server"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "Bearer",
                    description: "This app uses Bearer Token authentication \n \
                    Once you have a valid token you need to add it to the HTTP header of any \
                    request that require authentication. \n \
                    `Authorization: Bearer <jwt token>`"
                }
            },
            schemas: {
                DefaultResponse: {
                    type: "object",
                    properties: {
                        message: "string"
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "uuid",
                            example: "0b43694f-8d1b-4be7-9881-f180a26c34e5",
                        },
                        username: {
                            type: "string",
                            example: "john",
                        },
                        email: {
                            type: "string",
                            example: "user@example.com"
                        },
                        profile: {
                            type: "object",
                            properties: {
                                uuid: {
                                    type: "uuid",
                                    example: "0b43694f-8d1b-4be7-9881-f180a26c34e5",
                                },
                                firstName: {
                                    type: "string",
                                    example: "John",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Doe",
                                },
                                phone: {
                                    type: "string",
                                    example: "+233544000000",
                                },
                                dob: {
                                    type: "date",
                                    example: "2021-12-09",
                                },
                                country: {
                                    type: "string",
                                    example: "Ghana",
                                },
                            }

                        }
                    }
                },
                UserRegister: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: {
                            type: "string",
                            example: "nickname",
                        },
                        email: {
                            type: "string",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            example: "password",
                        }
                    }
                }

            }
        },
        security: [{
            BearerAuth: []
        }]
    },
    apis: ["./src/routes/*.js"]
}
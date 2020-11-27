const jsonGenerator = (response, source = 'AI Core V3', errorCode = 1, errorMessage = null, buttons = null, images = null) => ({
    provider: {
        website: "https://rotic.ir",
        source
    },
    status: errorCode,
    response,
    options: {
        buttons,
        images
    },
    error: {
        code: errorCode,
        message: errorMessage
    }
});

module.exports = jsonGenerator;
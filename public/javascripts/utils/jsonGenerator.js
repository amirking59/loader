const response = (response, buttons = null, images = null) => ({
    provider: {
        website: "https://rotic.ir",
        source: 'AI Core V3'
    },
    status: 0,
    response,
    options: {
        buttons,
        images
    },
    error: {
        code: 0,
        message: null
    }
});

const error = (errorCode = 1, errorMessage = null) => ({
    provider: {
        website: "https://rotic.ir",
        source: 'AI Core V3'
    },
    status: errorCode,
    response: null,
    options: {
        buttons: null,
        images: null
    },
    error: {
        code: errorCode,
        message: errorMessage
    }
});


module.exports = {
    response,
    error
};
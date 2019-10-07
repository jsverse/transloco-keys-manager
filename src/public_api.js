module.exports = {
    ...require('./builder/public_api'),
    ...require('./helpers'),
    ...require('./keys-detective'),
    ...require('./messages'),
    ...require('./regexs'),
    ...require('./webpack-plugin'),
};
const webpack = require('webpack')
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    )
    config.ignoreWarnings = [/Failed to parse source map/]

    return config
}

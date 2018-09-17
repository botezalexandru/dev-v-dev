const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = ({
    mode
}) => ({
    mode,
    entry: "./src/index.js",
    devtool: mode === "development" ? "source-map" : "none",
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    },
    devServer: {
        publicPath: '/src/'
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "bundle.css"
    }), new OptimizeCSSAssetsPlugin()]
});
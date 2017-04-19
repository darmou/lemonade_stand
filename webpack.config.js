var path = require("path");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestRevisionPlugin = require("manifest-revision-webpack-plugin");

var rootAssetPath = "./assets";

var BUILD_DIR = path.resolve(__dirname, "./build/public");
// var APP_DIR = path.resolve(__dirname, "./scripts");

module.exports = {
    entry: {
        app_js: [
            rootAssetPath + "/scripts/index.jsx"
        ],
        app_css: [
            rootAssetPath + "/styles/main.css"
        ]
    },
	include: [
	    path.resolve(__dirname, "assets")
	],
    output: {
        path: BUILD_DIR,
        publicPath: "http://localhost:2992/assets/",
        filename: "[name].[chunkhash].js",
        chunkFilename: "[id].[chunkhash].js"
    },
    resolve: {
        root: [
            path.resolve("./scripts"),
            path.resolve("./scripts/vendor/modules")
        ],
        extensions: ["", ".js", ".css"]
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(jpe?g|png|gif|svg([\?]?.*))$/i,
                loaders: [
                    "file?context=" + rootAssetPath + "&name=[path][name].[hash].[ext]",
                    "image?bypassOnDebug&optimizationLevel=7&interlaced=false"
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].[chunkhash].css"),
        new ManifestRevisionPlugin(path.join("build", "manifest.json"), {
            rootAssetPath: rootAssetPath,
            ignorePaths: ["/styles", "/scripts"]
        })
    ]
};

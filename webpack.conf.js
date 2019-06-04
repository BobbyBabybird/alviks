import webpack from "webpack";
import path from "path";

export default {
	mode: "development",
	devtool: "source-map",
	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},
	module: {
		rules: [{
			test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
			loader: "file-loader?name=/[hash].[ext]"
		},
		{
			loader: "babel-loader",
			test: /\.(js|jsx)?$/,
			exclude: /node_modules/,
			query: {
				cacheDirectory: true
			}
		}
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
			"fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
		})
	],

	context: path.join(__dirname, "src"),
	entry: {
		app: ["./js/app"],
		cms: ["./js/cms"]
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/",
		filename: "[name].js"
	},
	externals: [/^vendor\/.+\.js$/]
};

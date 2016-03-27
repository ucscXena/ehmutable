/*global require: false, module: false, __dirname: false */
'use strict';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
	historyApiFallback: true,
	entry: "./js/bogorouter",
	output: {
		path: "build",
		publicPath: "/",
		filename: "[name].js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [
					path.join(__dirname, 'js'),
					path.join(__dirname, 'test')
				],
				loaders: ['babel-loader'],
				type: 'js'}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Template Project",
			filename: "index.html",
			template: "page.template"
		}),
		new webpack.OldWatchingPlugin()
	],
	resolve: {
		extensions: ['', '.js', '.json', '.coffee'],
		root: __dirname + "/js"
	}
};

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

module.exports = {
	plugins: [
		new NxAppWebpackPlugin({
			target: 'node',
			compiler: 'tsc',
			main: './src/main.ts',
			tsConfig: './tsconfig.app.json',
			buildLibsFromSource: true,
			assets: ['./src/assets'],
			optimization: false,
			outputHashing: 'none',
			generatePackageJson: true,
			sourceMap: true,
		}),
	],
};

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production'

	return {
		target: 'node',
		entry: './src/main.ts',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle.min.js',
			clean: true,
		},
		externals: [nodeExternals()],
		resolve: {
			extensions: ['.ts', '.js', '.json'],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: {
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
					exclude: /node_modules/,
				},
			],
		},
		stats: {
			errorDetails: true,
		},
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						// Настройки минификации и обфускации
						compress: {
							drop_console: true, // Удалить console.log
							drop_debugger: true, // Удалить debugger
							pure_funcs: ['console.info', 'console.debug'], // Удалить указанные функции
						},
						mangle: {
							toplevel: true, // Обфусцировать имена переменных верхнего уровня
						},
						keep_classnames: false, // Не сохранять имена классов
						keep_fnames: false, // Не сохранять имена функций
					},
				}),
			],
		},
	}
}

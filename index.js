'use strict';

const { name } = require('./package');
const fastbootTransform = require('fastboot-transform');

module.exports = {
	name,
	options: {
		babel: {
			plugins: [
				'ember-auto-import/babel-plugin'
			]
		},
		nodeAssets: {
			'opus-recorder': {
				public: {
					srcDir: 'dist',
					destDir: 'opus-recorder',
					include: [
						'waveWorker.min.js', 
						'encoderWorker.min.js',
						'decoderWorker.min.js',
						'encoderWorker.min.wasm',
						'decoderWorker.min.wasm'
					],
					processTree(input) {
						return fastbootTransform(input);
					}
				}
			}
		}
	}
};
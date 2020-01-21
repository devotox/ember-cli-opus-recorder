'use strict';

const { name } = require('./package');
const fastbootTransform = require('fastboot-transform');

module.exports = {
	name,
	options: {
		nodeAssets: {
			'opus-recorder': {
				vendor: {
					srcDir: 'dist',
					destDir: 'opus-recorder',
					include: [
						'recorder.min.js'
					],
					processTree(input) {
						return fastbootTransform(input);
					}
				},
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
	},

	included() {
		this._super.included.apply(this, arguments);

		this.import('vendor/opus-recorder/recorder.min.js', {
			using: [
				{ transformation: 'amd', as: 'opus-recorder' }
			]
		});
	}
};
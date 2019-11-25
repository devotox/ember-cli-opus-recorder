import Recorder from 'opus-recorder';

import { later, cancel } from '@ember/runloop';

import Service, { inject } from '@ember/service';

const {
	URL,
	Blob,
	Promise,
	document,
	FileReader,
} = window;

const crypto = {
	createURL(blob) {
		return URL.createObjectURL(blob);
	},
	fromBlob(blob, type = 'text') {
		let func = type === 'data' ? 'readAsDataURL' : 'readAsText';

		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			reader[func](blob);
			reader.onerror = (error) => reject(error);
			reader.onload = () => resolve(reader.result);
		});
	},
	toBlob(dataURI) {
		let { buffer, mimeString } = this.toArrayBuffer(dataURI);
		return new Blob([buffer], { type: mimeString });
	}
};

function delayPromise(timeout) {
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

export default Service.extend({

	router: inject(),

	recorder: null,

	isRecording: false,

	audioTimeout: null,

	recordingTime: 5000,

	recorderOptions: null,

	audioElementType: 'audio/wav',

	audioElementID: 'audio-playback',

	encoderPath: 'opus-recorder/waveWorker.min.js',

	init() {
		this._super(...arguments);
		return this.setup();
	},

	async setup() {
		let recorder = this.get('recorder') 
			|| await this.createNewRecorder();

		return new Promise(async (resolve) => {	
			recorder.loadWorker();
			await delayPromise(0);
			resolve(recorder);
		});
	},

	async createNewRecorder() {
		let rootURL = this.get('router').rootURL;
		let encoderPath = `${rootURL}${this.encoderPath}`;
		let recorder = new Recorder(Object.assign({ encoderPath }, this.recorderOptions));

		recorder.ondataavailable = (typedArray) => {
			this.recorderData = new Blob([typedArray], { 
				type: this.audioElementType
			});
		}

		this.set('recorder', recorder);
		return recorder;
	},

	async stop() {
		if(!this.get('isRecording')) { return; }

		let audioTimeout = this.get('audioTimeout');
		let resolvePromise = this.get('resolvePromise');

		resolvePromise && resolvePromise();
		audioTimeout && cancel(audioTimeout);

		this.resetRecorder();
	},

	async start() {
		try {
			await this.reset();
			await this.setup();
		} catch(e) {
			throw e;
		}

		let recordingTime = this.get('recordingTime');
		let recorder = this.get('recorder');
		this.set('isRecording', true);
		recorder.start();

		return recordingTime
			&& new Promise((resolve, reject) => {
				let finish = () => resolve(this.stop());
				let audioTimeout = later(finish, recordingTime);

				this.set('audioTimeout', audioTimeout);
				this.set('resolvePromise', resolve);
				this.set('rejectPromise', reject);
			});
	},

	async play(audio) {
		this.removeAudioElement();
		let recordingTime = this.get('recordingTime');

		let { audioURL } = audio || await this.getAudio();

		let $audio = document.createElement('audio');
		let $source = document.createElement('source');

		$source.src = audioURL;
		$source.type = this.audioElementType;

		$audio.autoplay = true;
		$audio.id = this.audioElementID;
		$audio.addEventListener('ended', this.removeAudioElement.bind(this));

		$audio.appendChild($source);
		document.body.appendChild($audio);

		return recordingTime
			&& new Promise((resolve, reject) => {
				let finish = () => resolve(this.stop());
				let audioTimeout = later(finish, recordingTime);

				this.set('audioTimeout', audioTimeout);
				this.set('resolvePromise', resolve);
				this.set('rejectPromise', reject);
			});
	},

	async reset() {
		this.removeAudioElement();

		let audioTimeout = this.get('audioTimeout');
		let rejectPromise = this.get('rejectPromise');

		audioTimeout && cancel(audioTimeout);
		rejectPromise && rejectPromise(new Error('Recorder Reset'));

		this.resetRecorder();
	},

	async getAudio() {
		let recorder = this.get('recorder');
		if(!recorder) { throw new Error('Recorder not initialized'); }

		await delayPromise(0);
		const blob = this.recorderData;
		let audioURL = crypto.createURL(blob);
		let base64 = await crypto.fromBlob(blob, 'data');
		return { blob, base64, audioURL };
	},

	removeAudioElement() {
		let $audio = document.getElementById(this.audioElementID);
		if (!$audio) { return; }

		$audio.removeEventListener('ended', this.removeAudioElement.bind(this));
		$audio.parentElement.removeChild($audio);
	},

	resetRecorder() {
		this.set('isRecording', false);
		this.set('audioTimeout', null);
		this.set('rejectPromise', null);
		this.set('resolvePromise', null);

		let recorder = this.get('recorder');
		recorder && recorder.stop();
	}
});

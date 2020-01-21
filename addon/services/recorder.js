import { tracked } from '@glimmer/tracking';

import { later, cancel } from '@ember/runloop';

import Service, { inject as service } from '@ember/service';

const {
	URL,
	Blob,
	Promise,
	document,
	FileReader
} = window;

const crypto = {
	createURL(blob) {
		return URL.createObjectURL(blob);
	},
	fromBlob(blob, type = 'text') {
		const func = type === 'data' ? 'readAsDataURL' : 'readAsText';

		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader[func](blob);
			reader.onerror = (error) => reject(error);
			reader.onload = () => resolve(reader.result);
		});
	},
	toBlob(dataURI) {
		const { buffer, mimeString } = this.toArrayBuffer(dataURI);
		return new Blob([buffer], { type: mimeString });
	}
};

function delayPromise(timeout) {
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

export default class RecorderService extends Service {
	@service 
	router;

	@service 
	fastboot;

	@tracked
	recorder;

	@tracked
	audioTimeout;

	@tracked
	resolvePromise;

	@tracked
	rejectPromise;

	@tracked
	recorderOptions = {};

	@tracked
	recordingTime = 5000;

	@tracked
	numberOfChannels = 1;

	@tracked
	audioElementType ='audio/wav';

	@tracked
	audioElementID = 'audio-playback';

	@tracked
	encoderPath = 'opus-recorder/encoderWorker.min.js';

	constructor() {
		super(...arguments);
		this.setup();
	}

	async setup() {
		if(this.fastboot.isFastBoot) { return; }

		const recorder = this.recorder 
			|| await this.createNewRecorder();

		recorder.loadWorker();
	}

	async createNewRecorder() {
		const numberOfChannels = this.numberOfChannels;
		const encoderPath = `${this.router.rootURL}${this.encoderPath}`;

		// Dynamic import so it does not run in fastboot
		const Recorder = (await import('opus-recorder')).default;

		const recorder = new Recorder({ 
			encoderPath, 
			numberOfChannels,
			...this.recorderOptions 
		});

		recorder.ondataavailable = (typedArray) => {
			this.recorderData = new Blob([typedArray], { 
				type: this.audioElementType
			});
		}

		this.recorder = recorder;
		return recorder;
	}

	async stop() {
		if(!this.isRecording) { return; }

		const audioTimeout = this.audioTimeout;
		const resolvePromise = this.resolvePromise;

		resolvePromise && resolvePromise();
		audioTimeout && cancel(audioTimeout);

		this.resetRecorder();
	}

	async start() {
		await this.reset();
		await this.setup();

		const recorder = this.recorder;
		const recordingTime = this.recordingTime;

		this.isRecording = true;
		recorder.start();

		return recordingTime
			&& new Promise((resolve, reject) => {
				const finish = () => resolve(this.stop());
				const audioTimeout = later(finish, recordingTime);

				this.set('audioTimeout', audioTimeout);
				this.set('resolvePromise', resolve);
				this.set('rejectPromise', reject);
			});
	}

	async play(audio) {
		this.removeAudioElement();
		const recordingTime = this.recordingTime;

		const { audioURL } = audio || await this.getAudio();

		const $audio = document.createElement('audio');
		const $source = document.createElement('source');

		$source.src = audioURL;
		$source.type = this.audioElementType;

		$audio.autoplay = true;
		$audio.id = this.audioElementID;
		$audio.addEventListener('ended', this.removeAudioElement.bind(this));

		$audio.appendChild($source);
		document.body.appendChild($audio);

		return recordingTime
			&& new Promise((resolve, reject) => {
				const finish = () => resolve(this.stop());
				const audioTimeout = later(finish, recordingTime);

				this.set('audioTimeout', audioTimeout);
				this.set('resolvePromise', resolve);
				this.set('rejectPromise', reject);
			});
	}

	async reset() {
		this.removeAudioElement();

		const audioTimeout = this.audioTimeout;
		const rejectPromise = this.rejectPromise;

		audioTimeout && cancel(audioTimeout);
		rejectPromise && rejectPromise(new Error('Recorder Reset'));

		this.resetRecorder();
	}

	async getAudio() {
		const recorder = this.recorder;
		if(!recorder) { throw new Error('Recorder not initialized'); }

		await delayPromise(0);
		const blob = this.recorderData;
		const audioURL = crypto.createURL(blob);
		const base64 = await crypto.fromBlob(blob, 'data');
		return { blob, base64, audioURL };
	}

	removeAudioElement() {
		const $audio = document.getElementById(this.audioElementID);
		if (!$audio) { return; }

		$audio.removeEventListener('ended', this.removeAudioElement.bind(this));
		$audio.parentElement.removeChild($audio);
	}

	resetRecorder() {
		this.set('isRecording', false);
		this.set('audioTimeout', null);
		this.set('rejectPromise', null);
		this.set('resolvePromise', null);

		const recorder = this.recorder;
		recorder && recorder.stop();
	}
}

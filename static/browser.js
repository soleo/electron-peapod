'use strict';
const electron = require('electron');
const elementReady = require('element-ready');
const Mousetrap = require('mousetrap');
require('mousetrap-global-bind'); // eslint-disable-line import/no-unassigned-import
// const config = require('main/config');

const ipc = electron.ipcRenderer;
let defaultZoomFactor = 1;
const $ = document.querySelector.bind(document);

function registerShortcuts() {
	Mousetrap.bind('backspace', () => {
		window.history.back();
	});

	// vim bindings
	const pageScrollPctHeight = 0.9;
	const fromScrollTop = n => document.body.scrollTop + n;
	const scrollToY = y => window.scrollTo(0, y);

	Mousetrap.bind('g g', () => {
		scrollToY(0);
	});

	Mousetrap.bind('ctrl+d', () => {
		scrollToY(fromScrollTop(window.innerHeight * pageScrollPctHeight));
	});

	Mousetrap.bind('ctrl+u', () => {
		scrollToY(fromScrollTop(window.innerHeight * -pageScrollPctHeight));
	});

	Mousetrap.bind('G', () => {
		scrollToY(document.body.scrollHeight);
	});
	// -- //
}

function removeNoScriptBlocks() {
	document.body.querySelector('noscript') && document.body.querySelector('noscript').remove();
}

function init() {
	// Figure Out the User's ID first
	registerShortcuts();
	removeNoScriptBlocks();
	console.log('Register Shortcuts');
}

ipc.on('log-out', () => {
	window.href= "https://"
});

ipc.on('toggle-night-mode', () => {
	console.log("toggtle night");
});

ipc.on('zoom-reset', () => {
	setZoom(1.0);
});

ipc.on('zoom-in', () => {
	const zoomFactor = defaultZoomFactor + 0.1;

	if (zoomFactor < 1.6) {
		setZoom(zoomFactor);
	}
});

ipc.on('zoom-out', () => {
	const zoomFactor = defaultZoomFactor - 0.1;

	if (zoomFactor >= 0.8) {
		setZoom(zoomFactor);
	}
});

function setZoom(zoomFactor) {
	const node = $('#zoomFactor');
	node.textContent = `body {zoom: ${zoomFactor} !important}`;
	//config.set('zoomFactor', zoomFactor);
}

// Inject a global style node to maintain zoom factor after conversation change.
// Also set the zoom factor if it was set before quitting.
function zoomInit() {
	const zoomFactor = 1 || 1.0;
	const style = document.createElement('style');
	style.id = 'zoomFactor';

	document.body.appendChild(style);
	setZoom(zoomFactor);
}

document.addEventListener('DOMContentLoaded', () => {
	zoomInit();

	// enable OS specific styles
	document.documentElement.classList.add(`os-${process.platform}`);

	// detect when AngularJs is ready before firing init
	elementReady('html.wf-active').then(init);
});

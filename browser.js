'use strict';
const electron = require('electron');
const elementReady = require('element-ready');
const Mousetrap = require('mousetrap');
require('mousetrap-global-bind'); // eslint-disable-line import/no-unassigned-import
const config = require('./config');

const ipc = electron.ipcRenderer;
const $ = document.querySelector.bind(document);


function registerShortcuts(username) {
	Mousetrap.bind('n', () => {
		newTweet();
		return false;
	});

	Mousetrap.bind('m', () => {
		newDM();
		return false;
	});

	Mousetrap.bind(['g h', 'mod+1'], () => {
		$('a[href$="/home"]').click();
	});

	Mousetrap.bind(['g n', 'mod+2'], () => {
		$('a[href$="/notifications"]').click();
	});

	Mousetrap.bind(['g m', 'mod+3'], () => {
		$('a[href$="/messages"]').click();
	});

	Mousetrap.bind(['/', 'mod+4'], () => {
		$('a[href$="/search"]').click();
		return false;
	});

	Mousetrap.bind(['g p', 'mod+5'], () => {
		$('a[href$="/account"]').click();
		$(`a[href$="/${username}"]`).click();
	});

	Mousetrap.bind('g l', () => {
		$('a[href$="/account"]').click();
		$(`a[href$="/${username}"]`).click();
		$(`a[href$="/${username}/likes"]`).click();
	});

	Mousetrap.bind('g i', () => {
		$('a[href$="/account"]').click();
		$(`a[href$="/${username}/lists"]`).click();
	});

	// Closes images, DM windows, etc.
	Mousetrap.bindGlobal('esc', () => {
		const btn = $('button.INAWBu0V._1i_BWev4.QwoCevfW.Q1vpCyfl');

		if (btn) {
			btn.click();
		}
	});

	Mousetrap.bindGlobal('command+enter', () => {
		if (window.location.pathname === '/compose/tweet') {
			$('button._1LQ_VFHl._2cmVIBgK').click();
		}

		if (window.location.pathname.split('/')[1] === 'messages') {
			$('button[data-testid="dmComposerSendButton"]').click();
		}
	});

	Mousetrap.bind('right', () => {
		const nextBtn = $('button._2p6iBzFu._2UbkmNPH');

		if (nextBtn) {
			nextBtn.click();
		}
	});

	Mousetrap.bind('left', () => {
		const prevBtn = $('button._2p6iBzFu.lYVIpMQ4');

		if (prevBtn) {
			prevBtn.click();
		}
	});

	Mousetrap.bind('backspace', () => {
		window.history.back();
	});

	// vim bindings
	const pageScrollPctHeight = 0.9;
	const fromScrollTop = n => document.body.scrollTop + n;
	const scrollToY = y => window.scrollTo(0, y);

	Mousetrap.bind('j', scrollToTweet);
	Mousetrap.bind('k', scrollToTweet);

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

function init() {
	const state = JSON.parse($('.___iso-state___').dataset.state).initialState;
	//const username = state.settings.data.screen_name;

	//registerShortcuts(username);
}

ipc.on('log-out', () => {
	window.location.href = '/logout';
});

ipc.on('zoom-reset', () => {
	setZoom(1.0);
});

ipc.on('zoom-in', () => {
	const zoomFactor = config.get('zoomFactor') + 0.1;

	if (zoomFactor < 1.6) {
		setZoom(zoomFactor);
	}
});

ipc.on('zoom-out', () => {
	const zoomFactor = config.get('zoomFactor') - 0.1;

	if (zoomFactor >= 0.8) {
		setZoom(zoomFactor);
	}
});

function setZoom(zoomFactor) {
	const node = $('#zoomFactor');
	node.textContent = `body {zoom: ${zoomFactor} !important}`;
	config.set('zoomFactor', zoomFactor);
}

// Inject a global style node to maintain zoom factor after conversation change.
// Also set the zoom factor if it was set before quitting.
function zoomInit() {
	const zoomFactor = config.get('zoomFactor') || 1.0;
	const style = document.createElement('style');
	style.id = 'zoomFactor';

	document.body.appendChild(style);
	setZoom(zoomFactor);
}

document.addEventListener('DOMContentLoaded', () => {
	zoomInit();

	// enable OS specific styles
	document.documentElement.classList.add(`os-${process.platform}`);

	// detect when React is ready before firing init
	//elementReady('#react-root header').then(init);
});

'use strict';
const Config = require('electron-config');

module.exports = new Config({
	defaults: {
		lastWindowState: {
			width: 1024,
			height: 768
		}
	}
});

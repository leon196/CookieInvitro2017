'use strict';

const { readdirSync } = require('fs');
const { bundleSFX } = require('jspm');
const { join, resolve } = require('path');
const copyFile = require('quickly-copy-file');
const rimraf = require('rimraf-promise');

const descriptors = require('../browser/asset/descriptors.json');

const rootPath = resolve(__dirname, '..');
const buildPath = resolve(rootPath, 'dist', 'aaa-koltes-ponk-zac');

console.log('Cleaning build directories');
Promise.all([
	rimraf(join(buildPath, '*')),
])
	.then(() => {
		console.log('Copying index');
		return copyFile(join(rootPath, 'browser', 'index-release.html'), join(buildPath, 'index.html'));
	})
	.then(() => {
		console.log('Copying music');
		return copyFile(join(rootPath, 'browser', 'asset', 'music', 'music.ogg'), join(buildPath, 'files', 'music.ogg'));
	})
	.then(() => {
		console.log('Copying static files');
		const staticDirectory = join(rootPath, 'browser', 'static');
		const files = readdirSync(staticDirectory);
		return Promise.all(files.map(file => copyFile(join(staticDirectory, file), join(buildPath, 'files', file))));
	})
	.then(() => {
		console.log('Copying textures');
		const assetDirectory = join(rootPath, 'browser', 'asset');
		Promise.all(Object.keys(descriptors.materials)
			.map(materialName => {
				const file = descriptors.materials[materialName].texture;
				return copyFile(join(assetDirectory, file), join(buildPath, 'asset', file));
			}));
	})
	.then(() => {
		console.log('Bundling JSPM app');
		return bundleSFX('app/main-release.js', join(buildPath, 'files', 'demo.js'), {
			minify: false,
		});
	});

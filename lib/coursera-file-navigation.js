'use babel';

const {CompositeDisposable} = require('atom');
const path = require('path');
const touch = require('touch');
const fs = require('fs');

/* globals atom */

class CourseraFileNavigation {
  constructor() {
    this.subscriptions = null;
  };

  activate() {
    console.log('activated');
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'coursera-file-navigation:go-to-test', this.goToTest)
    );
    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'coursera-file-navigation:go-to-stylus', this.goToStylus)
    );
    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'coursera-file-navigation:go-to-component', this.goToComponent)
    );
  };

  deactivate() {
    this.subscriptions.dispose();
  };

  getCurrentFileName() {
    const fileName = atom.workspace.getActiveTextEditor().getFileName();

    // Remove extension. Some files have dots in them... so just deal with it.
    const fileNameParts = fileName.split('.');
    fileNameParts.pop();
    return fileNameParts.join('.');
  };

  getDirectoryPath() {
    return atom.workspace.getActiveTextEditor().getDirectoryPath();
  };

  openOrCreateAndOpenFile = (filePath) => {
    touch(filePath, {}, () => {
      atom.workspace.open(filePath);
    });
  };

  goToTest = () => {
    console.log('Go to test');
    let directoryPath = this.getDirectoryPath();
    const pathParts = directoryPath.split('/');
    const directoryName = pathParts[pathParts.length - 1];

    if (directoryName === '__tests__') {
      // Likely don't wnat to do this...
      return;
    }

    if (directoryName.indexOf('__') > -1) {
      directoryPath = path.join(directoryPath, '..');
    }

    const specFilePath = path.join(directoryPath, '__tests__', `${this.getCurrentFileName()}.spec.js`)
    const filePath = path.join(directoryPath, '__tests__', `${this.getCurrentFileName()}.js`);
    if (fs.existsSync(specFilePath)) {
      this.openOrCreateAndOpenFile(specFilePath);
    } else {
      this.openOrCreateAndOpenFile(filePath);
    }
  };

  goToStylus = () => {
    console.log('Go to stylus');
    let directoryPath = this.getDirectoryPath();
    const pathParts = directoryPath.split('/');
    const directoryName = pathParts[pathParts.length - 1];

    if (directoryName === '__styles__') {
      // Likely don't want to do this...
      return;
    }

    if (directoryName.indexOf('__') > -1) {
      directoryPath = path.join(directoryPath, '..');
    }

    const filePath = path.join(directoryPath, '__styles__', `${this.getCurrentFileName()}.styl`);
    this.openOrCreateAndOpenFile(filePath);
  };

  goToComponent = () => {
    console.log('Go to component');
    let directoryPath = this.getDirectoryPath();
    const pathParts = directoryPath.split('/');
    const directoryName = pathParts[pathParts.length - 1];

    if (directoryName === 'components') {
      // Likely don't want to do this...
      return;
    }

    if (directoryName.indexOf('__') > -1) {
      directoryPath = path.join(directoryPath, '..');
    }

    const filePath = path.join(directoryPath, `${this.getCurrentFileName()}.jsx`);
    this.openOrCreateAndOpenFile(filePath);
  }
}

const plugin = new CourseraFileNavigation();
export default plugin;

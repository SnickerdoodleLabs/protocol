import { printLine } from './modules/print';


chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log('response', response);
  });
console.log('2 Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

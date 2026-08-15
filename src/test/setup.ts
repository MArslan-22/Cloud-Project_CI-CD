import '@testing-library/jest-dom';

// Mock scrollIntoView which is not supported in JSDOM environment
window.HTMLElement.prototype.scrollIntoView = function() {};

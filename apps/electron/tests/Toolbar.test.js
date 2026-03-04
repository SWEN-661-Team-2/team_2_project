const Toolbar = require('../renderer/src/components/Toolbar');

describe('Toolbar Component', () => {
  test('should create a div element with the correct class and text', () => {
    // 1. Execute the function
    const toolbarElement = Toolbar();

    // 2. Assertions
    // Check if it is an instance of an HTML Element
    expect(toolbarElement).toBeInstanceOf(HTMLElement);
    
    // Check the tag name (JSDOM returns uppercase)
    expect(toolbarElement.tagName).toBe('DIV');

    // Check the class name
    expect(toolbarElement.className).toBe('toolbar');

    // Check the content
    expect(toolbarElement.textContent).toBe('Toolbar placeholder');
  });

  test('should be able to append to the document body', () => {
    const toolbarElement = Toolbar();
    document.body.appendChild(toolbarElement);

    // Verify it exists in the DOM
    const found = document.querySelector('.toolbar');
    expect(found).not.toBeNull();
    expect(found.textContent).toBe('Toolbar placeholder');

    // Cleanup for other tests
    document.body.removeChild(toolbarElement);
  });
});
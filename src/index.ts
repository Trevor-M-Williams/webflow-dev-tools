import './index.css';

import { simulateEvent } from '@finsweet/ts-utils';

window.Webflow ||= [];
window.Webflow.push(() => {
  main();
});

function main(): void {
  if (location.hostname.includes('webflow.io')) {
    initDevTools();
    createGoogleFontsLink(fonts);

    console.log('Webflow dev tools initialized');
  }
}

function initDevTools(): void {
  const devTools: HTMLDivElement = document.createElement('div');
  devTools.classList.add('dev-tools');
  document.body.appendChild(devTools);

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'd') {
      devTools.classList.toggle('active');
    }
  });

  initFontSelector(devTools);
  initColorPicker(devTools);
}

// ------------ Font Selector ------------ //

const fonts: string[] = [
  'Cormorant',
  'Crimson Text',
  'Exo',
  'Fira Sans',
  'Lato',
  'Inter Tight',
  'IBM Plex Sans',
  'IBM Plex Serif',
  'Merriweather',
  'Montserrat',
  'Nunito',
  'Open Sans',
  'Playfair Display',
  'Poppins',
  'Raleway',
  'Red Hat Display',
  'Roboto',
  'Rubik',
  'Source Sans Pro',
  'Space Mono',
  'Spectral',
  'Ubuntu',
  'Work Sans',
  'Zilla Slab',
];
let recentlySelectedFonts: string[] = [];

function initFontSelector(devTools: HTMLDivElement): void {
  const fontSelector: HTMLSelectElement = document.createElement('select');
  fontSelector.classList.add('font-selector');
  updateFontSelectorOptions(fontSelector, fonts);
  fontSelector.addEventListener('change', (event: Event) => {
    const selectedFont: string = (event.target as HTMLSelectElement).value;
    updateFontFamily(selectedFont);
    updateRecentlySelectedFonts(selectedFont);
    updateFontSelectorOptions(fontSelector, fonts);
  });

  const currentFont = getComputedStyle(document.documentElement)
    .getPropertyValue('--font--headings')
    .split(',')[0]
    .trim();

  const currentFontOption = fontSelector.querySelector(
    `option[value="${currentFont}"]`
  ) as HTMLOptionElement;

  if (currentFontOption) {
    currentFontOption.selected = true;
    simulateEvent(fontSelector, 'change');
  }

  devTools.appendChild(fontSelector);
}

function updateFontFamily(font: string): void {
  document.documentElement.style.setProperty('--font--headings', font);
}

function updateRecentlySelectedFonts(selectedFont: string): void {
  recentlySelectedFonts = recentlySelectedFonts.filter((font: string) => font !== selectedFont);
  recentlySelectedFonts.unshift(selectedFont);
  if (recentlySelectedFonts.length > 5) {
    recentlySelectedFonts.pop();
  }
}

function updateFontSelectorOptions(selector: HTMLSelectElement, fonts: string[]): void {
  selector.innerHTML = '';

  if (recentlySelectedFonts.length > 0) {
    recentlySelectedFonts.forEach((font) => addOptionToSelect(selector, font, true));
    addSeparatorToSelect(selector);
  }

  fonts.forEach((font) => addOptionToSelect(selector, font, false));
}

function addOptionToSelect(
  selector: HTMLSelectElement,
  font: string,
  isRecentlySelected: boolean
): void {
  const option: HTMLOptionElement = document.createElement('option');
  option.value = font;
  option.textContent = font;

  if (isRecentlySelected) {
    option.style.fontWeight = 'bold';
  }
  selector.appendChild(option);
}

function addSeparatorToSelect(selector: HTMLSelectElement): void {
  const option: HTMLOptionElement = document.createElement('option');
  option.disabled = true;
  option.textContent = '──────────';
  selector.appendChild(option);
}

function createGoogleFontsLink(fonts: string[]): void {
  const baseUrl = 'https://fonts.googleapis.com/css2';
  let fontsQueryParam = fonts
    .map((font) => `family=${font.replace(/\s/g, '+')}:wght@100;200;300;400;500;600;700;800;900`)
    .join('&');
  const href = `${baseUrl}?${fontsQueryParam}&display=swap`;

  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = href;

  document.head.appendChild(linkElement);
}

// ------------ Color Picker ------------ //

function initColorPicker(devTools: HTMLDivElement): void {
  const colorPicker: HTMLInputElement = document.createElement('input');
  colorPicker.classList.add('color-picker');
  colorPicker.type = 'color';
  colorPicker.id = 'colorPicker';
  colorPicker.name = 'colorPicker';
  colorPicker.value = '#ff0000';

  devTools.appendChild(colorPicker);

  colorPicker.addEventListener('input', (event: Event) => {
    const color: string = (event.target as HTMLInputElement).value;
    updateBrandColor(color);
  });

  const currentColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--swatch--brand'
  );
  colorPicker.value = currentColor;
}

function updateBrandColor(color: string): void {
  document.documentElement.style.setProperty('--swatch--brand', color);
}

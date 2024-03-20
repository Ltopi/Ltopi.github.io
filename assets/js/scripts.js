const DEFAULT_LANGUAGE_CODE = 'gr';

async function fetchLanguageJson(langCode) {
  const response = await fetch(`assets/languages/${langCode}.json`, { cache: 'no-cache' });
  return response.json();
}

/**
 * Sets the default language preference,
 * loads language data and updates the contents.
 */
async function changeLanguage(langCode) {
  await setLanguagePreference(lang);

  const langJson = await fetchLanguageJson(langCode);
  updateContent(langJson);
}

/**
 * Set language preference to local storage and updates
 * the website language.
 */
function setLanguagePreference(langCode) {
  localStorage.setItem('language', langCode);
  location.reload();
}

/**
 * Updates the content based on the key, value pairs given
 */
function updateContent(langJson) {
  const data18nElements = document.querySelectorAll("[data-18n]");

  data18nElements.forEach(element => {
    const key = element.getAttribute('data-18n');
    // Translations use <em> and <bold> elements. We do not have any dynamic
    // translation content, which means that we are safe against XSS attacks.
    element.innerHTML = langJson[key];
  });
}

// When site is loaded, load the default language, data
// and update content.
window.addEventListener('DOMContentLoaded', async () => {
  const userPreferredLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE_CODE;
  const langJson = await fetchLanguageJson(userPreferredLanguage);
  updateContent(langJson);
});
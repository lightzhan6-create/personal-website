(() => {
    'use strict';

    const STORAGE_KEY = 'freecat-language';
    const DEFAULT_LANGUAGE = 'zh-CN';
    const LOCALE_BASE_URL = '/locales/';
    const SUPPORTED_LANGUAGES = ['zh-CN', 'en-GB', 'es'];
    const LANGUAGE_LABELS = {
        'zh-CN': '中文简体',
        'en-GB': 'English',
        es: 'Español'
    };

    const cache = new Map();
    let currentLanguage = normalizeLanguage(readStoredLanguage());
    let currentDictionary = {};

    function readStoredLanguage() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return '';
        }
    }

    function writeStoredLanguage(language) {
        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            // Continue without persistence when localStorage is unavailable.
        }
    }

    function normalizeLanguage(language) {
        const value = String(language || '').trim();
        return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
    }

    function deepMerge(base, override) {
        const output = { ...(base || {}) };
        Object.entries(override || {}).forEach(([key, value]) => {
            if (
                value
                && typeof value === 'object'
                && !Array.isArray(value)
                && output[key]
                && typeof output[key] === 'object'
                && !Array.isArray(output[key])
            ) {
                output[key] = deepMerge(output[key], value);
                return;
            }

            output[key] = value;
        });
        return output;
    }

    async function fetchJson(url) {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unable to load locale file: ${url}`);
        }
        return response.json();
    }

    async function fetchLocale(language) {
        const normalizedLanguage = normalizeLanguage(language);
        if (cache.has(normalizedLanguage)) {
            return cache.get(normalizedLanguage);
        }

        const raw = await fetchJson(`${LOCALE_BASE_URL}${normalizedLanguage}.json`);
        let dictionary = raw;

        if (raw.extends) {
            const parent = await fetchLocale(raw.extends);
            const { extends: _extends, ...rest } = raw;
            dictionary = deepMerge(parent, rest);
        } else if (normalizedLanguage !== DEFAULT_LANGUAGE) {
            const fallback = await fetchLocale(DEFAULT_LANGUAGE);
            dictionary = deepMerge(fallback, raw);
        }

        cache.set(normalizedLanguage, dictionary);
        return dictionary;
    }

    function getValue(dictionary, key) {
        return String(key || '')
            .split('.')
            .reduce((value, part) => (
                value && Object.prototype.hasOwnProperty.call(value, part)
                    ? value[part]
                    : undefined
            ), dictionary);
    }

    function setNodeText(node, value) {
        if (value === undefined || value === null) return;
        const nextValue = String(value);
        if (node.textContent !== nextValue) {
            node.textContent = nextValue;
        }
    }

    function applyDataI18n(root, dictionary) {
        root.querySelectorAll('[data-i18n]').forEach((node) => {
            setNodeText(node, getValue(dictionary, node.getAttribute('data-i18n')));
        });

        root.querySelectorAll('[data-i18n-attr]').forEach((node) => {
            String(node.getAttribute('data-i18n-attr') || '')
                .split(';')
                .map((rule) => rule.trim())
                .filter(Boolean)
                .forEach((rule) => {
                    const [attribute, key] = rule.split(':').map((part) => part && part.trim());
                    const value = getValue(dictionary, key);
                    if (attribute && value !== undefined && value !== null) {
                        node.setAttribute(attribute, String(value));
                    }
                });
        });
    }

    function lookupByMap(mapKey, rawValue) {
        const map = getValue(currentDictionary, mapKey) || {};
        const value = String(rawValue || '').trim();
        return map[value] || value;
    }

    function applyStructuredLabels(root) {
        root.querySelectorAll('[data-project-category-label]').forEach((node) => {
            setNodeText(node, lookupByMap('projects.categories', node.getAttribute('data-project-category-label')));
        });

        root.querySelectorAll('[data-project-status-label]').forEach((node) => {
            setNodeText(node, lookupByMap('projects.statuses', node.getAttribute('data-project-status-label')));
        });

        root.querySelectorAll('[data-video-platform-label]').forEach((node) => {
            setNodeText(node, lookupByMap('videos.platforms', node.getAttribute('data-video-platform-label')));
        });

        root.querySelectorAll('[data-video-category-label]').forEach((node) => {
            setNodeText(node, lookupByMap('videos.categories', node.getAttribute('data-video-category-label')));
        });
    }

    function updateLanguageMenu(root, language) {
        root.querySelectorAll('[data-language]').forEach((button) => {
            const buttonLanguage = normalizeLanguage(button.getAttribute('data-language'));
            const isSelected = buttonLanguage === language;
            button.classList.toggle('border-primary', isSelected);
            button.classList.toggle('bg-emerald-50', isSelected);
            button.classList.toggle('dark:bg-emerald-950/30', isSelected);
            button.setAttribute('aria-current', isSelected ? 'true' : 'false');
        });

        root.querySelectorAll('[data-language-status]').forEach((node) => {
            const prefix = getValue(currentDictionary, 'language.currentChoice') || '当前选择';
            node.textContent = `${prefix}: ${LANGUAGE_LABELS[language] || language}`;
        });
    }

    function applyLanguageToDocument(targetDocument, language) {
        if (!targetDocument || !targetDocument.documentElement) return;
        targetDocument.documentElement.lang = language;
        applyDataI18n(targetDocument, currentDictionary);
        applyStructuredLabels(targetDocument);
        updateLanguageMenu(targetDocument, language);
    }

    function applyLanguageToFrames(language) {
        document.querySelectorAll('iframe').forEach((frame) => {
            try {
                applyLanguageToDocument(frame.contentDocument, language);
            } catch (error) {}
        });
    }

    async function applyLanguage(language, options = {}) {
        currentLanguage = normalizeLanguage(language);
        if (options.persist !== false) {
            writeStoredLanguage(currentLanguage);
        }

        currentDictionary = await fetchLocale(currentLanguage);
        applyLanguageToDocument(document, currentLanguage);
        applyLanguageToFrames(currentLanguage);
    }

    function bindFrameLanguageSync() {
        document.querySelectorAll('iframe').forEach((frame) => {
            if (frame.dataset.i18nFrameSync === 'true') return;
            frame.dataset.i18nFrameSync = 'true';
            frame.addEventListener('load', () => {
                if (!currentDictionary || !Object.keys(currentDictionary).length) return;
                applyLanguageToFrames(currentLanguage);
            });
        });
    }

    function bindLanguageMenu() {
        document.addEventListener('click', (event) => {
            const button = event.target.closest('[data-language]');
            if (!button) return;
            const language = normalizeLanguage(button.getAttribute('data-language'));

            event.preventDefault();
            applyLanguage(language)
                .then(() => {
                    const menu = button.closest('details');
                    if (menu) menu.removeAttribute('open');
                    window.setTimeout(() => window.location.reload(), 80);
                })
                .catch(() => {});
        });
    }

    window.FreecatI18n = {
        applyLanguage,
        getCurrentLanguage: () => currentLanguage,
        getDictionary: () => currentDictionary,
        translate: (key) => {
            const value = getValue(currentDictionary, key);
            return value === undefined || value === null ? '' : String(value);
        }
    };

    bindLanguageMenu();
    bindFrameLanguageSync();
    applyLanguage(currentLanguage, { persist: false }).catch(() => {});
})();

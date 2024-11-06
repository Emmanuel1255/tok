// src/utils/textHelpers.js
export const stripHtmlAndLimitWords = (html, wordLimit = 5) => {
    if (!html) return '';
    const plainText = html.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/);
    const limitedWords = words.slice(0, wordLimit);
    return limitedWords.join(' ') + (words.length > wordLimit ? '...' : '');
  };
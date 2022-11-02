import DOMPurify from 'dompurify';
import { memoize } from 'lodash';

function _sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'br',
      'code',
      'details',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'img',
      'li',
      'ol',
      'p',
      'q',
      'strong',
      'summary',
      'table',
      'tbody',
      'td',
      'thead',
      'tr',
      'ul',
    ],
    ALLOWED_ATTR: ['style', 'href', 'src', 'height', 'width', 'align'],
  });
}

export const sanitizeHtml = memoize(_sanitizeHtml);

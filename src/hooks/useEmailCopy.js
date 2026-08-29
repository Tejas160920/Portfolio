import { useState, useCallback, useRef, useEffect } from 'react';

/** The one place the address is written down. */
export const EMAIL = 'tejassgaikwad.dev@gmail.com';
export const MAILTO = `mailto:${EMAIL}`;

/**
 * A Gmail compose URL with the address (and optionally a subject) filled in.
 *
 * Why not a plain mailto: that only opens anything when the visitor's browser
 * has a mail handler registered. Plenty of people use webmail with none set,
 * so the click either does nothing or opens an empty tab. This always opens a
 * real compose window with the recipient already there.
 *
 * The `to` fallback in the URL means a signed-out visitor still lands on
 * Gmail's compose screen after logging in, rather than an empty inbox.
 */
export const composeUrl = (subject = '') => {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: EMAIL
  });
  if (subject) params.set('su', subject);
  return `https://mail.google.com/mail/?${params.toString()}`;
};

/**
 * Copy the address to the clipboard. Used by the Contact section, where
 * copying is the point; the Hire me and footer links open a compose window
 * instead.
 */
export const useEmailCopy = ({ resetAfter = 2000 } = {}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copyEmail = useCallback(() => {
    if (!navigator.clipboard?.writeText) return;

    navigator.clipboard.writeText(EMAIL)
      .then(() => {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetAfter);
      })
      .catch(() => {});
  }, [resetAfter]);

  return [copied, copyEmail];
};

export default useEmailCopy;

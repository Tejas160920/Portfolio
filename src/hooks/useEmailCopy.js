import { useState, useCallback, useRef, useEffect } from 'react';

/** The one place the address is written down. */
export const EMAIL = 'tejassgaikwad.dev@gmail.com';
export const MAILTO = `mailto:${EMAIL}`;

/**
 * Copy the address to the clipboard alongside a mailto link.
 *
 * A bare mailto only works when the visitor's browser has a mail handler
 * registered. Plenty of people use webmail with none set, so the click either
 * does nothing or opens an empty tab — which looks broken. Copying as well
 * means the click always produces something useful, whatever the browser does
 * with the mailto itself.
 */
export const useEmailCopy = ({ resetAfter = 2000 } = {}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copyEmail = useCallback(() => {
    // Deliberately does NOT preventDefault: the mailto still fires for anyone
    // who has a mail client, and this is a belt-and-braces addition.
    if (!navigator.clipboard?.writeText) return;

    navigator.clipboard.writeText(EMAIL)
      .then(() => {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetAfter);
      })
      .catch(() => {
        // Clipboard can be blocked; the mailto is still doing its job
      });
  }, [resetAfter]);

  return [copied, copyEmail];
};

export default useEmailCopy;

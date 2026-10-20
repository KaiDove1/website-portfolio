/**
 * PreviewContext: lets a page tell the Shell which preview image to show.
 * Shell provides its state setter; pages call useSetPreview()(path | null).
 * The default is a no-op so a page rendered outside the Shell never crashes.
 */
import { createContext, useContext } from 'react';

const PreviewContext = createContext(() => {});

export const PreviewProvider = PreviewContext.Provider;

export function useSetPreview() {
  return useContext(PreviewContext);
}

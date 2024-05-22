/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';

if (typeof window !== 'undefined' && !window.navigator.userAgent.includes('Electron')) {
  precacheAndRoute(self.__WB_MANIFEST);
}

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, Route, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

const tasksRoute = new Route(
  ({ url }) => url.pathname === '/tasks',
  new NetworkFirst({
    cacheName: 'tasks-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);
const fonRoute = new Route(
  ({ url }) => /.*assets\/.*.woff/.test(url.pathname),
  new CacheFirst({
    cacheName: 'fon-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

const iconRoute = new Route(
    ({ url }) => /.*\/icons\/.*\.(png|svg|jpg|jpeg|ico)/.test(url.pathname),
    new CacheFirst({
      cacheName: 'icon-cache',
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Tage Cache für Icons
        }),
      ],
      cacheableResponse: {
        statuses: [0, 200],
      },
    }),
  );
  
registerRoute( tasksRoute);
registerRoute(fonRoute);
registerRoute(iconRoute);

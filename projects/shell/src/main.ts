import { initFederation } from '@angular-architects/native-federation';

// initFederation('federation.manifest.json')
//   .catch(err => console.error(err))
//   .then(_ => import('./bootstrap'))
//   .catch(err => console.error(err));
(async () => {
  await initFederation('federation.manifest.json');
  await import('./bootstrap');
})().catch((err) => {
  console.error('Failed to initialize federation/bootstrapping:', err);
});

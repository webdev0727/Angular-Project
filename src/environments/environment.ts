// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: ((window.location.hostname.includes('xilo-dev') ? 'https://xilo-dev-api.herokuapp.com/api/' :
  window.location.hostname.includes('xilo-staging') ? 'https://xilo-staging-api.herokuapp.com/api/' : "https://xilo-staging-api.herokuapp.com/api/")),
  devApiUrl: 'https://xilo-dev-api.herokuapp.com/api/',
  stagingApiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  stripePKey: 'pk_test_8BZV1HDVmH7VBumHF1NwswJv',
  keenProjectId: '5c04243fc9e77c0001255923',
  keenWriteKey: 'DB616D3A37C1614E65B719BFDEF51E75C907C3B50BBA7A21A84EA5B6678C45C127C10217BD4C95A73067A7E0F4E55DD4B588E593651397FEA9BB51C348D973A83F1A9241678C30DEA11B842FC6FD60B966CF3C1D5612B7F970EEDC47F38FF3B0',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBQAjsTHZqpNd-0km49l0xV0KvVOsZNkZQ'
};

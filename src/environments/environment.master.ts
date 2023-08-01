declare var require: any;

export const environment = {
  production: true,
  root: '',
  webRoot: '',
  appVersion: require('../../package.json').version,
  appTitle: require('../../package.json').releaseName,
  dashBoardUrl: 'https://analytics.vertican.com/',
};

declare var window: any;
var apiServer = "http://localhost:3000";

export const prodVariables = {
  apiEndpoint: `${apiServer}/comunicacao/api/`,
  environmentName: 'Production Environment',
  ionicEnvName: 'prod',
  client_id: 'app',
  client_secret: 'app@imagine',
  production: true,
  token: `${apiServer}/oauth/token`
};

declare var window: any;

var environment_type = "dev";
var environment_type = "local";


if (environment_type == "local") {
    var apiServer = "http://localhost:3000";
    var apiEndpoint = `${apiServer}/api/`;
    var client_id = 'app';
    var client_secret = 'app@imagine';
    var token = `${apiServer}/oauth/token`;
}
else if (environment_type == "dev") {
    var apiServer = "https://";
    var apiEndpoint = `${apiServer}/comunicacao/api/`;
    var client_id = 'app';
    var client_secret = 'app@imagine';
    var token = `${apiServer}/oauth/token`;
}



export const devVariables = {
    apiEndpoint: apiEndpoint,
    environmentName: 'Development Environment',
    ionicEnvName: 'dev',
    production: false,
    client_id: client_id,
    client_secret: client_secret,
    token:token
};

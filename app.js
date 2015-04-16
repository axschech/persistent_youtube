angular.module('app',[
  'controllers',
  'services',
  'directives'
])
.constant('AUTH', {
    client_id:'260397451199-vnhh12pguvmtpat7phitbiv2467jla03.apps.googleusercontent.com',
    redirect_uri: "http://dev.axschech.com/youtube",
    response_type: "token",
    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/userinfo.email',
    key: 'AIzaSyChVTrAM1DUiOYZcz_rjXy5KcrXFAEUp3'
});

angular.module('controllers',[]);
angular.module('services', []);
angular.module('directives', []);
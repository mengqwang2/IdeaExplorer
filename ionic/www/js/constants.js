angular.module('starter')
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  internalError: 'internal-server-error',
  notFound: 'not-found',
  badRequest: 'bad-request',
  requestError: 'request-error',
  otherErrors: 'other-error'

})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})

.constant('NETWORK',{
	IP: "10.43.76.44",
	PORT: ":5000"
});
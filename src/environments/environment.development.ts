// ============================================================================
// CONFIGURACIÓN — usado automáticamente con `ng serve` (modo desarrollo).
// ============================================================================
export const environment = {
  production: false,
  msal: {
    clientId: 'b0361a22-65c8-4c6c-ac3a-767662d4a975',
    authority: 'https://login.microsoftonline.com/4a684343-6276-4c46-9913-5450f4672cbe',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  apiScope: 'api://b0361a22-65c8-4c6c-ac3a-767662d4a975/access_as_user',
  apiUrl: 'http://98.82.193.250:8081/api/bff',
};
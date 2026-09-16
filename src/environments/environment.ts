// ============================================================================
// CONFIGURACIÓN — reemplaza apiUrl cuando el BFF esté desplegado en AWS.
// Los IDs de Azure AD no son secretos (es un cliente público SPA con PKCE,
// sin client secret), así que es seguro que vivan en este archivo.
// ============================================================================
export const environment = {
  production: true,
  msal: {
    clientId: 'b0361a22-65c8-4c6c-ac3a-767662d4a975',
    authority: 'https://login.microsoftonline.com/4a684343-6276-4c46-9913-5450f4672cbe',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  apiScope: 'api://b0361a22-65c8-4c6c-ac3a-767662d4a975/access_as_user',
  apiUrl: 'http://localhost:8081/api/bff',
};

# rutaexpress-frontend

Frontend de RutaExpress. Angular 18 (standalone components) + MSAL para login
real contra Azure AD, con guards y UI condicionados por rol.

## Requisitos

- Node.js 18 o 20 (probado también en Node 22)
- Angular CLI: `npm install -g @angular/cli@18` (opcional, puedes usar `npx` sin instalarlo global)

## Correr en local

```bash
npm install
npm start
```

Abre `http://localhost:4200`. Como la ruta `/dashboard` está protegida por
`MsalGuard`, apenas entres te va a redirigir sola a la pantalla de login de
Microsoft — ya no hace falta el truco manual de armar la URL a mano.

**Importante:** el `ms-rutaexpress-bff` tiene que estar corriendo en
`http://localhost:8081` al mismo tiempo (`mvn spring-boot:run` en esa
carpeta), porque el dashboard llama a `/api/bff/me` apenas carga.

## Qué probar

1. Inicia sesión con cualquiera de los 4 usuarios de prueba.
2. El dashboard debería mostrar tu nombre y tu rol como badge junto al botón
   de cerrar sesión.
3. Los "módulos" que aparecen abajo (Envíos, Catálogo, Auditoría) cambian
   según el rol — logueado como `Cliente` no deberías ver el de Catálogo,
   por ejemplo.
4. Cierra sesión y vuelve a entrar con otro usuario para comparar.

## Estructura

```
src/app/
  app.component.ts        Shell: navbar, login/logout, procesa el redirect de Azure AD
  app.config.ts            Configuración de MSAL (instancia, guard, interceptor)
  app.routes.ts             Rutas (dashboard protegido con MsalGuard)
  core/
    role.guard.ts          Guard adicional que revisa el claim "roles"
    bff.service.ts         Llama a /api/bff/me (el interceptor agrega el token solo)
  features/
    dashboard/             Pantalla principal, contenido condicionado por rol
    no-autorizado/         Página que se muestra si el rol no alcanza
```

## Notas de configuración

Los IDs de Azure AD (tenant, client id) están en
`src/environments/environment.ts` y `environment.development.ts`. No son
secretos — es un cliente público SPA con PKCE, sin client secret — así que
es seguro que estén en el código. Si en algún momento cambias de tenant o de
app registration, esos son los dos únicos archivos que hay que tocar.

Antes de desplegar a AWS, cambia `apiUrl` en `environment.ts` (el de
producción) por la URL del API Gateway.

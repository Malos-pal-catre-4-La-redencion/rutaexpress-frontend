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

**Importante:** además del BFF (`localhost:8081`), ahora también necesitas
`ms-rutaexpress-shipments` (`localhost:8082`) y `ms-rutaexpress-catalog`
(`localhost:8083`) corriendo, porque Envíos y Catálogo cargan datos reales
a través del BFF.

## Qué probar

1. Inicia sesión con cualquiera de los 4 usuarios de prueba.
2. El dashboard debería mostrar tu nombre y tu rol como badge junto al botón
   de cerrar sesión.
3. Las tarjetas de "Envíos" y "Catálogo" ahora llevan a páginas reales —
   logueado como `Cliente` no deberías ver la de Catálogo, ni en el
   dashboard ni en el navbar.
4. En **Envíos**: crea uno nuevo. Si entraste como `admin` o `despachador`,
   prueba los botones de cambio de estado — deberían respetar la máquina de
   estados (no vas a poder saltar directo a "ENTREGADO").
5. En **Catálogo**: `admin` y `despachador` ven servicios y flota; solo
   `admin` puede crear o desactivar servicios.
6. Cierra sesión y vuelve a entrar con otro usuario para comparar.

## Estructura

```
src/app/
  app.component.ts         Shell: navbar (con enlaces por rol), login/logout, procesa el redirect de Azure AD
  app.config.ts             Configuración de MSAL (instancia, guard, interceptor)
  app.routes.ts              Rutas (dashboard, envios, catalogo — cada una con su guard)
  core/
    role.guard.ts           Guard que revisa el claim "roles" contra data.roles de la ruta
    session.service.ts      Lee el rol activo del usuario (usado dentro de los componentes)
    bff.service.ts          Llama a /api/bff/me
    envio.service.ts        Llama a /api/bff/envios (+ mapa de transiciones válidas para la UI)
    catalogo.service.ts     Llama a /api/bff/servicios y /api/bff/vehiculos
  features/
    dashboard/              Pantalla principal, tarjetas-enlace condicionadas por rol
    envios/                 Lista + creación + cambio de estado de envíos
    catalogo/                Servicios de envío (tarifas) + flota de vehículos
    no-autorizado/           Página que se muestra si el rol no alcanza
```

## Notas de configuración

Los IDs de Azure AD (tenant, client id) están en
`src/environments/environment.ts` y `environment.development.ts`. No son
secretos — es un cliente público SPA con PKCE, sin client secret — así que
es seguro que estén en el código. Si en algún momento cambias de tenant o de
app registration, esos son los dos únicos archivos que hay que tocar.

Antes de desplegar a AWS, cambia `apiUrl` en `environment.ts` (el de
producción) por la URL del API Gateway.

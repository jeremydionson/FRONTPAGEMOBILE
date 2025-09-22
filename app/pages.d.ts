// app/pages.d.ts
declare module "expo-router" {
  interface RegisteredRoutes {
    "/login": undefined;
    "/onboarding": undefined;
    "/": undefined;          // main feed (index.tsx inside (tabs))
    "/test": undefined;      // test page
  }
}

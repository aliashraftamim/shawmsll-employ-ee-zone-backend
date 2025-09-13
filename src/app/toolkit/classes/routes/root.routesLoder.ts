// // src/core/RouteLoader.ts
// import { Application } from "express";
// import { readdirSync, statSync } from "fs";
// import path from "path";
// import { BaseRoute } from "./BaseRoutes";

// export const registerRoutes = (app: Application) => {
//   const modulesPath = path.join(__dirname, "../modules");

//   const loadRoutesRecursively = (dir: string) => {
//     const items = readdirSync(dir);

//     for (const item of items) {
//       const fullPath = path.join(dir, item);

//       if (statSync(fullPath).isDirectory()) {
//         loadRoutesRecursively(fullPath);
//       } else if (item.endsWith(".route.js") || item.endsWith(".route.ts")) {
//         try {
//           // eslint-disable-next-line @typescript-eslint/no-var-requires
//           const routeModule = require(fullPath) as {
//             default: new () => BaseRoute;
//           };
//           if (routeModule && routeModule.default) {
//             const routeInstance: BaseRoute = new routeModule.default();
//             routeInstance.register(app);
//             console.log(`✅ Loaded route: ${routeInstance.path}`);
//           }
//         } catch (err) {
//           console.error(`❌ Failed to load route from ${fullPath}`, err);
//         }
//       }
//     }
//   };

//   loadRoutesRecursively(modulesPath);
// };

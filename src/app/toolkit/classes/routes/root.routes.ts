// src/core/BaseRoute.ts
import { Application, Router } from "express";

export abstract class BaseRoute {
  public router: Router;
  public path: string;

  constructor(path: string) {
    this.router = Router();
    this.path = path;
    this.initRoutes();
  }

  protected abstract initRoutes(): void;

  public register(app: Application) {
    app.use(this.path, this.router);
  }
}

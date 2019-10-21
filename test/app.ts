import express from "express";
import { Tresor, FileAdapter } from "../src/index";

const app = express();

app.get(
  "/memory/slow-html",
  new Tresor({ responseType: "html", maxAge: "500ms" }).init(),
  async (req: express.Request, res: express.Response) => {
    setTimeout(() => {
      res.$tresor.send("Hello world!");
    }, 500);
  }
);

app.get(
  "/memory/slow-json",
  Tresor.json({ maxAge: "500ms" }).init(),
  async (req: express.Request, res: express.Response) => {
    setTimeout(() => {
      res.$tresor.send({ hello: "world" });
    }, 500);
  }
);

app.get(
  "/file/slow-html",
  Tresor.html({ maxAge: "500ms", adapter: new FileAdapter() }).init(),
  async (req: express.Request, res: express.Response) => {
    setTimeout(() => {
      res.$tresor.send("Hello world!");
    }, 500);
  }
);

app.get(
  "/file/slow-json",
  new Tresor({
    maxAge: "500ms",
    adapter: new FileAdapter("test/cache")
  }).init(),
  async (req: express.Request, res: express.Response) => {
    setTimeout(() => {
      res.$tresor.send({ hello: "world" });
    }, 500);
  }
);

const limiter100 = Tresor.html({
  maxAge: "1.5 seconds"
});
export { limiter100 };

app.get("/limit100", limiter100.init(), async (req, res) => {
  res.$tresor.send(
    "This route is limited to 100 cached items that last 1.5 seconds each"
  );
});

const twentyfourhours = Tresor.html({
  maxAge: "24h"
});
export { twentyfourhours };

app.get("/24hours", twentyfourhours.init(), async (req, res) => {
  res.$tresor.send(
    "This route is limited to 100 cached items that last 24 hours each"
  );
});

export default app;

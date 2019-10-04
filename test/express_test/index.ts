import express from "express"
import { Tresor, FileResolver } from "../../src/index"

const app = express()

async function fromDatabase(): Promise<object> {
  return new Promise(r => setTimeout(() => r({ hello: "world" }), 2500));
}

const fsCache = new Tresor({
  maxAge: 5000,
  resolver: new FileResolver(),
  onCacheHit: (path: string, time: number) => console.log(`Cache hit ${path} ${time}ms`),
  onCacheMiss: (path: string, time: number) => console.log(`Cache miss ${path} ${time}ms`),
})

app.get("/slow-renderer",
  fsCache.init(),
  async (req: express.Request, res: express.Response) => {
    res.$tresor.send(await fromDatabase());
  }
)

const htmlCache = new Tresor({
  resType: "html",
  maxAge: 300000,
  maxAmount: 5,
  onCacheMiss: () => console.log(`Slow render without cache`),
  onCacheHit: (path: string, time: number) => console.log(`Supercharged render using cache: ${time}ms`),
  onCacheFull: () => console.log("Cache full!")
})

app.get("/query",
  htmlCache.init(),
  async (req: express.Request, res: express.Response) => {
    setTimeout(() => {
      res.$tresor.send(`Hello ${req.query.name}!`);
    }, 2500)
  }
)

app.listen(7777, () => {
  console.log("Express on port 7777")
})
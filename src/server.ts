import { Elysia, t } from "elysia";
import * as database from "./database";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import { countAmountOfRedirects } from "./database";

const PORT = process.env["PORT"] || 3001;

export const app = new Elysia({}).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// connect to vue build
app.use(
  staticPlugin({
    assets: "view/dist/assets",
    prefix: "/assets",
  })
);
app.use(
  staticPlugin({
    assets: "view/dist",
    prefix: "/",
  })
);
app.use(html());
app.get("/", (req) => Bun.file("view/dist/index.html"));

// cors
app.use(
  cors({
    origin: "*",
  })
);

// cut stands for custom url target
app.get("/a/:cut", (req) => {
  let cut = req.params.cut;
  let targetUrl = database.returnTargetFromCut(cut);

  console.log({ cut, targetUrl });

  if (targetUrl === "") {
    return req.redirect("/");
  }

  return req.redirect(targetUrl, 302);
});

app.post(
  "/a/:cut",
  (req) => {
    let cut = req.params.cut;

    console.log("attempting to create:", {
      cut,
      target: req.body.target,
    });

    let rCut = database.insertNewRedirect(cut, req.body.target);

    if (rCut === "")
      return {
        e: true,
        $: "cut already exists.",
      };

    return {
      e: false,
      $: rCut,
    };
  },
  {
    params: t.Object({
      cut: t.String({
        pattern: "^[a-zA-Z0-9-]+$",
      }),
    }),
    body: t.Object({
      target: t.String({
        pattern: "^(http|https)://",
      }),
    }),
  }
);

app.get("/a_count", (req) => {
  let count = countAmountOfRedirects();

  if (count < 0) {
    return {
      e: true,
      $: "could not count"
    }
  } else {
    return {
      e: false,
      $: count,
    }
  }
})
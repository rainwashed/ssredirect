import { Database } from "bun:sqlite";
import { randomBytes } from "node:crypto";

const adminDb = new Database("db/admin.sqlite", { create: true });
const redirectsDb = new Database("db/redirects.sqlite", { create: true });
const memoryCache = new Map();
// declare hashing function with salt
const hashFunction = (toBeHashed: string, salt: string) => {
  return new Bun.CryptoHasher("sha256").update(toBeHashed + salt).digest("hex");
};
// generate salt function
const generateSalt = () => randomBytes(12).toString("hex");

function initDatabases() {
  if (!process.env["ADMIN_USER"] || !process.env["ADMIN_PASSWORD"]) {
    console.log(
      "Could not detect ADMIN_USER or ADMIN_PASSWORD in the .env file or as runtime environment variable."
    );

    process.exit(1);
  }

  memoryCache.set("redirectAmount", -1); 

  adminDb.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hash TEXT NOT NULL,
            salt TEXT NOT NULL
        );
    `);
  redirectsDb.run(`
       CREATE TABLE IF NOT EXISTS redirects (
            target_url TEXT NOT NULL,
            cut TEXT PRIMARY KEY UNIQUE NOT NULL,
            created_at TEXT NOT NULL DEFAULT current_timestamp
        );
    `);

  // determine amount of elements in admin table, because if it is empty, create the first and root level account.
  let adminAccounts = adminDb.query("SELECT * FROM admins");
  if (adminAccounts.all().length === 0) {
    console.log("Creating root level account...");
    let salt = generateSalt();
    let hash = hashFunction(process.env["ADMIN_PASSWORD"], salt);

    console.log({ salt, hash });

    adminDb.run(`
        INSERT INTO admins (id, username, hash, salt) VALUES (0, "${process.env["ADMIN_USER"]}", "${hash}", "${salt}")     
    `);
  }
}

function copyRequiredDbValuesToCache() {

}

function deleteDatabases() {
  adminDb.run("DROP TABLE admins");
  redirectsDb.run("DROP TABLE redirects");
}

function returnTargetFromCut(cut: string): string {
  let returnedQuery = redirectsDb
    .query(`SELECT target_url FROM redirects WHERE cut = $cut`)
    .get({ $cut: cut });

  if (!returnedQuery) return "";
  let targetUrl = (returnedQuery as { target_url: string }).target_url;

  return targetUrl;
}

function insertNewRedirect(cut: string, target: string): string {
  if (returnTargetFromCut(cut) !== "") return "";

  redirectsDb.run(
    `INSERT INTO redirects VALUES ("${target}", "${cut}", current_timestamp)`
  );

  return cut;
}

initDatabases();
copyRequiredDbValuesToCache();

function countAmountOfRedirects(): number {
  let amountOfQuery = redirectsDb.query(`SELECT COUNT(*) FROM redirects`).get() as {"COUNT(*)": number};


  if (!amountOfQuery || !amountOfQuery["COUNT(*)"]) return -1;

  let count = amountOfQuery["COUNT(*)"];

  return count;
}

export { adminDb, redirectsDb };
export { returnTargetFromCut, insertNewRedirect, countAmountOfRedirects };

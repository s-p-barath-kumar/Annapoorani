import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "production";

const envPath = path.resolve(
  process.cwd(),
  `config/env/${env}.env`
);

dotenv.config({ path: envPath });

console.log(`Running in ${env} mode`);

export default env;
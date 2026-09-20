const { hashPassword } = require("../utils/passwords");

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: npm run hash -- <password>");
    process.exit(1);
  }

  console.log(await hashPassword(password));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

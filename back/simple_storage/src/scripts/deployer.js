async function main() {
  console.log("test");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

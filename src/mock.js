const { writeJson, getOutputFile } = require("./utils");

async function main() {
  const payments = [];
  // Super ad-hoc. Just for a dry-run where we need 125 transfers in to a Gnosis Safe in Rinkeby and Mainnet
  // Not interested in factoring this out to parameters for now
  for (let i = 0; i < 125; i++) {
    // Transfer 1000 Rinkeby GNO splitted into 125 Addresses (8 GNO each)
    // payments.push({
    //   amount: "8", // GNO amount
    //   tokenAddress: "0xd0dab4e640d95e9e8a47545598c33e31bdb53c7c", // GNO test token
    //   receiver: "0xd9395aeE9141a3Efeb6d16057c8f67fBE296734c", // GP Multisig Rinkeby
    // });

    payments.push({
      amount: "0.0008", // GNO amount
      tokenAddress: "0x6810e776880C02933D47DB1b9fc05908e5386b96", // GNO
      receiver: "0x6C642caFCbd9d8383250bb25F67aE409147f78b2", // GP Multisig
    });
  }

  // Parse CSV
  const outputFile = getOutputFile();

  // Write JSON
  writeJson(outputFile, payments);
}

main().catch(console.error);

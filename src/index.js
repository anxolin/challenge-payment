const fs = require("fs");
const BigNumber = require("bignumber.js");

const { getInputOutputFiles, parseCsvFile, raise } = require("./utils");
const GNO_ADDRESS = "0x6810e776880C02933D47DB1b9fc05908e5386b96";

function toPayment(leaderBoardItem) {
  const { trader, gno_estimation: gnoEstimation } = leaderBoardItem;

  return {
    amount: gnoEstimation,
    tokenAddress: GNO_ADDRESS,
    receiver: trader,
  };
}

async function main() {
  // Parse CSV
  const [inputFile, outputFile] = getInputOutputFiles();
  const results = await parseCsvFile(inputFile);

  // Transform into payment object
  const payments = results
    .map(toPayment)
    // Remove payment with amount zero
    .filter((payment) => {
      const amount = new BigNumber(payment.amount);
      return !amount.isZero();
    });

  // Write JSON
  const jsonContent = JSON.stringify(payments, null, 2);
  fs.writeFileSync(outputFile, jsonContent, "utf8");
}

main().catch(console.error);

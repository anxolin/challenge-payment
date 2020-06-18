const BigNumber = require("bignumber.js");

const { GNO_ADDRESS } = require("./const");
const { getInputOutputFiles, parseCsvFile, writeJson } = require("./utils");

function toPayment(leaderBoardItem) {
  const { trader: receiver, gno_estimation: amount } = leaderBoardItem;

  return {
    amount,
    tokenAddress: GNO_ADDRESS,
    receiver,
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
  writeJson(outputFile, payments);
}

main().catch(console.error);

const BigNumber = require("bignumber.js");

const { GNO_ADDRESS } = require("./const");
const {
  getInputOutputFiles,
  parseCsvFile,
  writeJson,
  getPaymentSummaries,
} = require("./utils");

function toPayment(leaderBoardItem) {
  const { trader: receiver, gno_estimation: amount } = leaderBoardItem;
  const amountOriginal = new BigNumber(amount);
  const amountRounded = amountOriginal.integerValue(BigNumber.ROUND_UP);

  return {
    tokenAddress: GNO_ADDRESS,
    receiver,
    amountRounded,
    amount: amountOriginal,
  };
}

async function main() {
  // Parse CSV
  const [inputFile, outputFile] = getInputOutputFiles();
  const results = await parseCsvFile(inputFile);

  // Transform into payment object and preprocess
  const payments = results
    .map(toPayment)
    // Remove payment with amount zero
    .filter((payment) => !payment.amount.isZero());

  // Print a summary of the payments
  const paymentSummaries = getPaymentSummaries(payments);
  console.log(`The leader board contains ${results.length} participants`);
  console.log(`The file contain ${payments.length} payments:`);
  for (let [tokenAddress, paymentSummary] of paymentSummaries) {
    const { amount, amountOriginal, count } = paymentSummary;
    console.log(
      `  - Token ${tokenAddress}
      Transfers: ${count}
      Total amount: ${amount}
      Total amount before rounding: ${amountOriginal} (+${amount.minus(
        amountOriginal.toFixed(0)
      )})`
    );
  }

  // Prepare data object to print into file (discard unneeded fields)
  const paymentsData = payments.map(
    ({ amount, amountOriginal, receiver, tokenAddress }) => ({
      amount: amount.toString(10),
      amountOriginal: amountOriginal.toString(10),
      receiver,
      tokenAddress,
    })
  );

  // Write JSON
  writeJson(outputFile, paymentsData);
}

main().catch(console.error);

const fs = require("fs");
const csv = require("csv-parser");
var path = require("path");
const BigNumber = require("bignumber.js");

async function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath, { encoding: "utf-8" })
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

function raise(message) {
  console.error(message);
  process.exit(1);
}

function getOutputFile() {
  // Parse arguments. Let's keep it simple. now minimist/yargs for now
  var arguments = process.argv.slice(2);

  // Validate the number of arguments
  if (arguments.length !== 1) {
    raise(
      `Error in parameters: The script expects exactly one argument:
  * Output file (JSON file)

Provided ${arguments.length} parameters: "${arguments}"

i.e.
      yarn mock rinkeby-gno-payments.json
`
    );
  }

  const [outputFile] = arguments;
  console.log("Output JSON file: %s", outputFile);

  if (path.extname(outputFile).toLowerCase() !== ".json") {
    raise("The output file should be a JSON file");
  }

  return outputFile;
}

function getPaymentSummaries(payments) {
  return payments.reduce((acc, payment) => {
    const { amount, amountOriginal, tokenAddress } = payment;

    if (!acc.has(tokenAddress)) {
      acc.set(tokenAddress, {
        count: 0,
        amount: new BigNumber(0),
        amountOriginal: new BigNumber(0),
      });
    }

    // Aggregate the payment into the summaries
    const tokenPaymentSummary = acc.get(tokenAddress);
    tokenPaymentSummary.count++;

    tokenPaymentSummary.amount = tokenPaymentSummary.amount.plus(amount);
    tokenPaymentSummary.amountOriginal = tokenPaymentSummary.amountOriginal.plus(
      amountOriginal
    );

    return acc;
  }, new Map());
}

function writeJson(filePath, data) {
  const jsonContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonContent, "utf8");
}

function getInputOutputFiles() {
  // Parse arguments. Let's keep it simple. now minimist/yargs for now
  var arguments = process.argv.slice(2);

  // Validate the number of arguments
  if (arguments.length !== 2) {
    raise(
      `Error in parameters: The script expects exactly two argument:
1. Input file (CSV file)
2. Output file (JSON file)

Provided ${arguments.length} parameters: "${arguments}"

i.e.
      yarn gen data/leader-board-example.csv gno-payments.json
`
    );
  }

  const [inputFile, outputFile] = arguments;
  console.log("Input CSV file: %s", inputFile);
  console.log("Output JSON file: %s", outputFile);

  if (!fs.existsSync(inputFile)) {
    raise("The input file doesn't exist");
  }

  if (path.extname(outputFile).toLowerCase() !== ".json") {
    raise("The output file should be a JSON file");
  }

  return [inputFile, outputFile];
}

// module.exports.parseCsvFile = parseCsvFile;
module.exports = {
  writeJson,
  getInputOutputFiles,
  getOutputFile,
  parseCsvFile,
  getPaymentSummaries,
  raise,
};

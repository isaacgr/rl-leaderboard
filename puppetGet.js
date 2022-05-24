const puppeteer = require("puppeteer");
const fs = require("fs");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const puppetGet = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en"
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
  );
  page.on("response", async (response) => {
    if (!response.url().includes("api.tracker.gg/api")) {
      return;
    }
    // console.log(`Got response. [${response._url}]`);
    try {
      const data = await response.json();
      console.log(JSON.stringify(data));
      // const filename = argv.filename || "response";
      // fs.writeFileSync(`/tmp/${filename}.json`, JSON.stringify(data));
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  await page.goto(argv.url, { waitUntil: "networkidle0" });
  await browser.close();
};

puppetGet();

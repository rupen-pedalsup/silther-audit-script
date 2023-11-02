const fs = require("fs");
const puppeteer = require("puppeteer");
const jsonData = require("./slither-report.json");

const html = generateHTMLReport(jsonData);

fs.writeFileSync("slither-report.html", html);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const content = fs.readFileSync("slither-report.html", "utf8");

  await page.setContent(content);
  await page.pdf({ path: "slither-report.pdf", format: "A4" });

  await browser.close();

  console.log("Slither report generated successfully");
})();

function generateHTMLReport(data) {
  const htmlTemplate = `
    <html>
    <head>
      <title>Report</title>
    </head>
    <style>
    table {
      border: 1px solid black;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid black;
      padding: 4px;
    }
  </style>
    <body>
      <h1>Slither Report</h1>

      <table id="result-table">
        <tr>
          <th>Impact</th>
          <th>Confidence</th>
          <th>Location</th>
          <th>Description</th>
          <th>Check</th>
        </tr>
        ${generateResultsHTML(data.results.detectors)}
      </table>

     
    </body>
    </html>
  `;

  return htmlTemplate;
}

function generateResultsHTML(results) {
  let html = "";
  for (const result of results) {
    html += `
      <tr class="result">
        <td>${result.impact}</td>
        <td>${result.confidence}</td>
        <td>${result.first_markdown_element}</td>
        <td>${result.description}</td>
        <td>${result.check}</td>
      </tr>
    `;
  }
  return html;
}

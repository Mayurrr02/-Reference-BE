const axios = require("axios");
const cheerio = require("cheerio");
const Reference = require("../models/Reference");

async function scrapeIPIndia() {
  try {
    console.log("Scraping started...");

    const baseUrl = "https://ipindia.gov.in";
    const { data } = await axios.get(baseUrl);

    const $ = cheerio.load(data);

    const links = [];

    $("a").each((i, el) => {
      let title = $(el).text().trim();
      let href = $(el).attr("href");

      // Ignore bad links
      if (!href) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("javascript")) return;
      if (title.length < 8) return;

      // Convert relative to full URL
      if (!href.startsWith("http")) {
        href = baseUrl + href;
      }

      links.push({
        title,
        officialUrl: href
      });
    });

    // Insert only first 20 valid links 
    for (let item of links.slice(0, 20)) {

      const exists = await Reference.findOne({
        officialUrl: item.officialUrl
      });

      if (!exists) {
        await Reference.create({
          title: item.title,
          description: item.description,
          category: item.category,
          sourceName: "Intellectual Property India",
          officialUrl: item.officialUrl,
          tags: ["auto", "scraped"]
        });
      }
    }

    console.log("Scraping finished.");
  } catch (error) {
    console.log("Scraping error:", error.message);
  }
}

module.exports = scrapeIPIndia;

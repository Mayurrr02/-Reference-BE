const axios = require("axios");
const cheerio = require("cheerio");
const Reference = require("../models/Reference");

async function scrapeWIPO() {
  try {
    console.log("WIPO Scraping started...");

    const baseUrl = "https://www.wipo.int";
    const { data } = await axios.get(baseUrl);

    const $ = cheerio.load(data);
    const links = [];

    $("a").each((i, el) => {
      let title = $(el).text().trim();
      let href = $(el).attr("href");

      if (!href) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("javascript")) return;
      if (title.length < 8) return;

      if (!href.startsWith("http")) {
        href = baseUrl + href;
      }

      links.push({
        title,
        officialUrl: href
      });
    });

    for (let item of links.slice(0, 15)) {

      const exists = await Reference.findOne({
        officialUrl: item.officialUrl
      });

      if (!exists) {
        await Reference.create({
          title: item.title,
          description: "Official resource from WIPO.",
          category: "General",
          sourceName: "WIPO",
          officialUrl: item.officialUrl,
          tags: ["auto", "scraped"]
        });
      }
    }

    console.log("WIPO Scraping finished.");
  } catch (error) {
    console.log("WIPO Scraping error:", error.message);
  }
}

module.exports = scrapeWIPO;

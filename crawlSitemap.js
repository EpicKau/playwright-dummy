const axios = require('axios');
const { parseStringPromise } = require('xml2js'); 

const SITEMAP_URL = process.env.SITEMAP_URL;

async function crawlSitemap() {
  try {
    if(!SITEMAP_URL) {
        throw new Error(`SITEMAP_URL muss gesetzt sein!`);
    }

    const response = await axios.get(SITEMAP_URL, {
        responseType: 'text'
    });

    if (response.status !== 200) {
      throw new Error(`Fehler beim Abrufen der Sitemap. Statuscode: ${response.status}`);
    }

    const parsedXml = await parseStringPromise(response.data, { explicitArray: false });

    let urls = [];
    if (parsedXml.urlset && parsedXml.urlset.url) {
        urls = parsedXml.urlset.url.map(entry => entry.loc);
    } else if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
        console.log('Sitemap-Index gefunden. Extrahiere URLs der untergeordneten Sitemaps...');
        urls = parsedXml.sitemapindex.sitemap.map(entry => entry.loc);
    } else {
        throw new Error('Kein gültiges <urlset>- oder <sitemapindex>-Tag in der Sitemap gefunden.');
    }

    urls.forEach(url => {
      console.log(url.trim());
    });

  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error.message);
    process.exit(1);
  }
}

crawlSitemap()
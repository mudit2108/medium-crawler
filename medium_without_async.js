var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var csvWriter = require('csv-write-stream');
var fs = require("fs");

var writer = csvWriter();
var pagesVisited = {};
var pagesToVisit = [];
var connections = 0;

writer.pipe(fs.createWriteStream('links.csv'));

function crawl(){
  connections++;
  var newpage = pagesToVisit.pop();
  // Check if number of pages to be crawled is less than the connections if so close the connections
  if (pagesToVisit.length < connections) {
      return;
  }else if (pagesToVisit.length == 0) {
    // If number of pages to be crawled becomes 0 close the file and exit
    writer.end();
    return;
  }else{
  }
  if (newpage in pagesVisited) {
    // if the page in array is already crawled then don't crawl it again (Duplicacy check)
    connections--;
    crawl();
    return;
  }else{
    console.log(newpage);
    console.log("In Queue " + String(pagesToVisit.length));
    pagesVisited[newpage] = true;
    request(newpage, function(error, response, body) {
       // Check status code (200 is HTTP OK)
       if(response.statusCode !== 200) {
         //  Pages which return 200 OK status code are crawled further
         connections--;
         crawl();
         return;
       }
       // Parse the document body to cheerio
       var $ = cheerio.load(body);
      //  Pass the body of the document to collectInternalLinks to collect all the links on the page
       collectLinks($);
       connections--;
      //  Write the page which has been crawled to the csv file
       writer.write({url: newpage, crawled: true});
       crawl();
    });
  }
}

function collectLinks($) {
    //  Search for relative links such as /about /privacy etc
    var relativeLinks = $("a[href^='/']");
    // Search for absolute links such as http://www.medium.com/......
    var absoluteLinks = $("a[href^='http']");
    // Add the extracted links to pagesToVisit
    relativeLinks.each(function() {
          pagesToVisit.push("http://www.medium.com/" + $(this).attr('href'));
    });
    absoluteLinks.each(function() {
        // Check if there are no external links
        if($(this).attr('href').indexOf("medium.com") > -1){
          pagesToVisit.push($(this).attr('href'));
        }
    });
}

// Run the crawler for the first time for medium home page
request('http://www.medium.com', function(error, response, body) {
   // Check status code (200 is HTTP OK)
   if(response.statusCode !== 200) {
     connections--;
     return;
   }
   // Parse the document body
   var $ = cheerio.load(body);
   //  Collect the links from the page
   collectLinks($);
   //  Run the crawl function five times.
   //  This uses the asynchronous nature of NodeJS as all the five functions are called simultaneously and the code doesn't
   //  stop executing on first function call
   crawl();
   crawl();
   crawl();
   crawl();
   crawl();
});

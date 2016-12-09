# Extract all internal links from medium.com

  The project is built in node.js therefore you need to set up node and npm on your machine.
  For an Ubuntu machine follow all the steps from this link https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server


  There are two versions of the script one using async library (medium_without_async.js) and the other without using async (medium_without_async.js).


  The hunt for all internal links, begins at http://medium.com i.e. the home page of Medium.


  At a time there are maximum five concurrent requests that are being made to get new pages.
  The script doesn't allow more than five requests, hence preventing medium from blocking our IP.

  I have used recursive function 'crawl()' to achieve this.


  All the collected URL are streamed to links.csv file created at the root of the directory after cloning this repository. The links are continuously added to the file as the crawler runs.

### Installing dependencies
  All the dependencies for this project are mentioned in package.json. To install these dependencies run this command from the root of the directory created after cloning this repository.

`npm install`

### Start the script which uses async.js
Run this command from the root of the directory created after cloning this repository.

`node medium_with_async.js`

### Start the script which doesn't uses async.js
Run this command from the root of the directory created after cloning this repository.

`node medium_without_async.js`

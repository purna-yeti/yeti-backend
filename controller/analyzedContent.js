
/**
 * remove hash
 * for google.com/search, only keeps the 'q'
 * 
 * @param {} uri 
 */
function getAnalyzedContent(uri) {
  this.raw = new URL(uri);
  this.clean_uri = `${this.raw.protocol}//${this.raw.hostname}${this.raw.pathname}`;

  if (this.raw.hostname === "www.google.com" && this.raw.pathname === "/search") {
    this.clean_uri = `${this.clean_uri}?q=${this.raw.searchParams.get('q')}`
  } else {
    this.clean_uri = `${this.clean_uri}${this.raw.search}`;
  }


  this.clean = new URL(this.clean_uri);
  return this.clean;
}

exports.getAnalyzedContent = getAnalyzedContent;





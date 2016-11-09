
#### Same as ../0 except this version does NOT remove videoembed

Remove lines that filter videoembed in index.html:

  json1 = json1['fanniemae.com'].filter(function(d) { return d[0].indexOf('videoembed') == -1; });
  json2 = json2['fanniemae.com'].filter(function(d) { return d[0].indexOf('videoembed') == -1; });

TechLib.receiveAndCheckJson = function(url, retries) {

  try {

    if (retries == null) retries = TechLib.DOWNLOAD_FAILURE_REPEAT_COUNT;

    var response = GetURL(url);
    var json_response = response.body.deserialize('json');
    var exp_checksum = json_response.checksum;
    var xml_string = json_response.data;
    var real_checksum = Sha256.hash(xml_string);

    // if the checksums match, return the string
    // otherwise try again if retries > 0 or fail
    if (exp_checksum === real_checksum) return xml_string;
    else throw "Request failed\n Corrupted data received";

  } catch (e) {

    if (retries <= 0) {

      alert(e.toString());
      return('');

    }

    else return TechLib.receiveAndCheckJson(url, retries - 1);

  }

}

TechLib.getArticleList = function(volume, issue) {
  var url = TechLib.API_URL + 'api/issue_lookup/'+volume+'/'+issue;
  var response = TechLib.receiveAndCheckJson(url);

  return response.deserialize('json');
}

TechLib.getArticleXML = function(id, parts) {
  var url = TechLib.API_URL + 'api/article_as_xml/'+id+'?parts='+parts;
  var response = TechLib.receiveAndCheckJson(url);

  return response.deserialize('json').xml;
}

TechLib.getNewestIssue = function() {
  var url = TechLib.API_URL + 'api/newest_issue/';
  var response = TechLib.receiveAndCheckJson(url);

  return response.deserialize('json');
}

TechLib.getArticleParts = function() {
  var url = TechLib.API_URL + 'api/article_parts/';
  var response = TechLib.receiveAndCheckJson(url);

  return response.deserialize('json');
}

TechLib.getStyleMapping = function() {
  var url = TechLib.API_URL + 'api/style_mapping';
  var response = TechLib.receiveAndCheckJson(url);

  return response.deserialize('json');
}

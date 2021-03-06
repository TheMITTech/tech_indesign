#targetengine session_thetech

app.xmlExportPreferences.fileEncoding = XMLFileEncoding.utf8;
(function() {
  function main() {
    #include "../Extendables/extendables.jsx"

    var TechLib = {};
    TechLib.STATE = "Dev"
    TechLib.DIR = (new File($.fileName)).parent
    TechLib.ui = require('ui');
    TechLib.http = require('http');

    if (!TechLib.http.has_internet_access()) {
      alert("You have to be connected to the internet to use TechLib");
      return;
    }

    #include "./helpers/api.jsx"
    #include "./helpers/other.jsx"

    #include "./config/constants.jsx"
    #include "./config/load_cms_constants.jsx"

    #include "./helpers/GetURLs.jsx"

    #include "./functions/checkout.jsx"
    #include "./functions/style_mapping.jsx"

    #include "./panels/checkoutPopup.jsx"

    TechLib.DOC.loadXMLTags(File(TechLib.DIR+'/xml/tags.xml'));

    #include "./indesign_setup.jsx"

  }

  if (app.documents.count() != 0) {
    main();
  }

  app.addEventListener('afterOpen', function(e) {

    if (!(e.target instanceof Document)) {
      main();
    }

  }, false);

})();

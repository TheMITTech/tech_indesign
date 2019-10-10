#targetengine session_thetech

app.xmlExportPreferences.fileEncoding = XMLFileEncoding.utf8;
(function() {
  function main() {
    #include "../Extendables/extendables.jsx"
    #include "./cleanup.jsx"

    var TechLib = {};
    TechLib.STATE = "Dev"
    TechLib.DIR = (new File($.fileName)).parent
    TechLib.ui = require('ui');
    TechLib.http = require('http');

    if (!TechLib.http.has_internet_access()) {
      alert("You have to be connected to the internet to use TechLib");
      return;
    }
    
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

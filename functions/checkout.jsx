/**
 * Checks out an article into the selected textbox
 * @param {Number} id - The id of the article that is being checked out
 * @param {string} parts - a CSV list of parts
 * @param {Object} status_label - the ScriptUI label object
 * @param {Number} [counter=0] - the repeat counter - since xml importing is unstable,
 * counter represents the number of times the function will try again if it fails
 */

var logging = require("logging");

var log = new logging.Log("example.log");
Zygi.doCheckout = function (id, parts, slug, status_label, callback) {
  try {

    // set the target and check if it's a textbox. If not, create a new textbox.
    var target;
    if (app.selection.length != 1 || app.selection[0].constructor.name != "TextFrame") {
      target = app.activeWindow.activePage.textFrames.add({
        geometricBounds: [0, -20, 20, -5],
        contents: "",
      });
    } else {
      target = app.selection[0];
    }



    // there are two ways to do XML in inDesign:
    // the XML class in the core js library makes it easier
    // to work on it while scripting
    // the inDesign Object Model XML class is more complicated
    // and must be used to import XML into the inDesign document

    // load the xml text string
    // deserialize it for easy access in scripts
    // and also put it into a temp file
    // (it's only possible to import XML from a file in inDesing)
    id = parseInt(id);
    var xml = Zygi.getArticleXML(id, parts);

    log.debug(xml);
    // replace a non-breaking space with a normal space
    // because the xml parser can't deal with those for some reason.
    xml = xml.replace(/&/g,'&amp;');
    var deserialized = new XML(xml);
    var file = Zygi.putDataToTempFile(xml);

    // load the tags before importing the actual document
    Zygi.DOC.loadXMLTags(file);

    var root = Zygi.DOC.xml(0);
    var storyElem = null;

    // check if an xml element for this article id already exists.
    // if it does, remove it
    var stories = root.children();
    _.each(stories, function(elem) {
        if (elem.attr('textbox_id') === target.id.toString()) {
            storyElem = elem;
        }
    });

    if (storyElem != null) {
      storyElem.remove();
    }


    // set up paragraph style mapping
    // pass the Core Lib XML element
    Zygi.setupParagraphMapping(deserialized);

    // create a new 'story' tag, add atributes to it and
    // put the received xml inside it
    var storyTag = Zygi.DOC.xmlTags.itemByName('story');
    storyElem = root.xmlElements.add(storyTag);
    storyElem.xmlAttributes.add('textbox_id', target.id.toString());
    storyElem.xmlAttributes.add('article_id', id.toString());
    storyElem.xmlAttributes.add('article_slug', slug);
    storyElem.importXML(file);


    // place the content into the target textbox
    storyElem.find('document').find('content').placeXML(target);
  } catch (e) {
    alert("Failed to download the article.\nPlease try again - that should work. Debug info below:\n\n"+e.toString());
  } finally {
    if (typeof file !== 'undefined' && file !== null) {
      file.remove();
      file.close();
    }

    // After everything's done, update the panel
    status_label.text = '';
    callback();
  }
}

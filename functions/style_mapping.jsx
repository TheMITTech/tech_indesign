TechLib.setupBoldItalicMapping = function() {
  // Find or create character styles for bold and italic text
  var boldCharStyle = TechLib.DOC.characterStyles.item('IMPORTED-Bold');
  if (boldCharStyle == null) {
    TechLib.DOC.characterStyles.add({name: "IMPORTED-Bold", fontStyle:"Bold"});
    boldCharStyle = TechLib.DOC.characterStyles.item('IMPORTED-Bold');
  }

  var italicCharStyle = TechLib.DOC.characterStyles.item('IMPORTED-Italic');
  if (italicCharStyle == null) {
    TechLib.DOC.characterStyles.add({name: "IMPORTED-Italic", fontStyle:"Italic"});
    italicCharStyle = TechLib.DOC.characterStyles.item('IMPORTED-Italic');
  }

  // set the actual mapping
  TechLib.DOC.xmlImportMaps.add(TechLib.DOC.xmlTags.item("strong"), boldCharStyle);
  TechLib.DOC.xmlImportMaps.add(TechLib.DOC.xmlTags.item("em"), italicCharStyle);
}

// story_xml must be passed as a Core Library XML object
TechLib.setupParagraphMapping = function(story_xml) {
  // make sure bold and italic are still mapped correctly
  TechLib.setupBoldItalicMapping();

  // set up the style mapping
  try {
    // load the mapping from the cms
    var style_mapping = TechLib.getStyleMapping();

    //get the section and the primary tag
    var meta = story_xml.child('metadata');
    var section = meta.child('section').toString();
    var primary_tag = meta.child('primary_tag').toString();

    // check if the mapping is defined for the section
    if (! section in style_mapping) {
        throw "Styles for this section are not defined.";
    }

    var section_styles = style_mapping[section];

    // use the primary tag to get the actual array of mappings
    // if the mapping for a given primary tag doesn't exist,
    // load the '_default' mapping
    var style_array;
    if (primary_tag != '' && primary_tag in section_styles)
      style_array = section_styles[primary_tag];
    else if ('_default' in section_styles)
      style_array = section_styles['_default']
    else
      throw "Default styles are not defined"

    // do the actual mapping:
    // for each [tag, style] pair
    _.each(style_array, function(elem) {
      var tag = TechLib.DOC.xmlTags.item(elem[0]);
      // if the tag doesn't exist, don't throw an error - just skip it
      if (tag == null) return;

      // the style can be in a group:
      // set group to the document by default
      var group = TechLib.DOC;
      // split the path to get the group and the style name
      var style_args = elem[1].split('::');
      // if the group exists, set group to that group
      if (style_args.length == 2) {
        group = TechLib.DOC.paragraphStyleGroups.item(style_args[0]);
        // if the group doesn't exist, throw an error
        if (group == null) throw "Group\n"+style_args[0]+"\nnot found";
      }

      // get the style
      var style = group.paragraphStyles.item(style_args[style_args.length - 1]);
      if (style == null)
        throw "Style\n"+elem[1]+"\nnot found";

      // map the tag to the style
      TechLib.DOC.xmlImportMaps.add(tag, style);
    });
  } catch (error) {
    alert("Failed to map the article's styles: \n" + error);
  }
}

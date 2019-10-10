if (TechLib.DELAULT_VOLUME == 0 || TechLib.DEFAULT_VOLUME == 0) {
  var defaults = TechLib.getNewestIssue();
  TechLib.DEFAULT_VOLUME = defaults.volume;
  TechLib.DEFAULT_ISSUE = defaults.issue;
}


TechLib.ARTICLE_PARTS = TechLib.getArticleParts().parts;

// I forgot why the parts are loaded from the cms. If we want to keep
// it that way, the default choices should be moved to an api call too.
TechLib.ARTICLE_PARTS_DEFAULT = {"byline": true, "bytitle": true, "body": true};

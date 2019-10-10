var mainMenu = app.menus.item("$ID/Main");

try{

  var menu = mainMenu.submenus.item("Tech Lib "+TechLib.STATE);

  menu.remove();

} catch (error) {

  alert(error.toString());

}

var scriptAction = app.scriptMenuActions.add("Check Out Panel");
var resetAction = app.scriptMenuActions.add("Reset Script");

scriptAction.eventListeners.add("onInvoke", function() {
  TechLib.checkoutPopup();
});

resetAction.eventListeners.add("onInvoke", function() {
  $.evalFile(TechLib.DIR+'/init.jsx');
});


menu = mainMenu.submenus.add("Tech Lib "+TechLib.STATE);

menu.menuItems.add(scriptAction);
menu.menuItems.add(resetAction);

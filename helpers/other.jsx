TechLib.randomString = function(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

TechLib.putDataToTempFile = function(data) {

    var file_name = TechLib.TEMP_FILE_LOCATION+TechLib.randomString(10)+'temp.xml';
    var temp = new File(file_name);

    temp.encoding = 'UTF-8';
    temp.open('w');
    temp.write(data);
    temp.close();

    return temp;

}

TechLib.isInt = function(value) {

    return !isNaN(value) && parseInt(Number(value)) == value;

}

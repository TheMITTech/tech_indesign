TechLib.putDataToTempFile = function(data) {

    var file_name = TechLib.TEMP_FILE_LOCATION+'temp.xml';
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

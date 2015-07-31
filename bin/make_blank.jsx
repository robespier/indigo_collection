#target illustrator

// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

var workFolder = new Folder ('Y:\\d3\\012\\071'); // Ссылка на рабочий каталог
var blank_template = new File (workFolder + '\\blank.ai'); // Ссылка на файл blank.ai
var label_list = new File (workFolder + '\\label_list.csv'); //Ссылка на label-лист

var label_listArray = []; // Массив строк из label-листа
var label_listName = [];
label_list.open(); // Открываем label-лист
		while (line = label_list.readln()) {
			var line_part = line.split(";");
				file_name = workFolder + '\\' + line_part[0] + '.eps';
						var label_file = new File (file_name); // Создаем ссылку на файл этикетки
						label_listArray.push(label_file); // Сохраняем ссылку на файл в экземплярной переменной
				label_name = line_part[1];
				label_listName.push(label_name); // Сохраняем имя этикетки
		};
label_list.close();


for (i=0, l=label_listArray.length; i < l; i++) {

app.open (blank_template);	// Открываем blank
var myDoc = app.activeDocument; // Создаем ссылку на активный документ
var cut_layer = myDoc.layers['cut']; // Ссылка на слой высечки
var blank_layer = myDoc.layers['blank']; // Ссылка на слой бланка

	// Находим координаты контура высечки

cut_path = cut_layer.pathItems[0]; // Ссылка на контур высечки
cut_xPos = cut_path.position[0];
cut_yPos = cut_path.position[1];

	// Создаем слой для размещения этикетки

newlayer = myDoc.layers.add(); // Создаем новый слой
newlayer.name = 'label'; // называем его именем label
newlayer.zOrder(ZOrderMethod.SENDTOBACK); // и помещаем его в самый низ в пачке слоев документа
var label_list = myDoc.layers['label']; // Ссылка на слой label

	// Загружаем этикетку

label_place = label_list.placedItems.add();
lp = label_place;
lp.file = File(workFolder + '\\' + label_listArray[i].name);

    // Выравниваем этикетку относительно высечки
    // 2.835 px = 1 мм

lp.position = new Array (cut_xPos - 2.835, cut_yPos + 2.835);

							// Заполняем бланк

	// Текущая дата

current_date = blank_layer.pageItems['current_date'];
d = new Date();
date = d.getDate() + '.0' + (d.getMonth()+1) + '.' + d.getFullYear();
current_date.contents = date;


	// Название этикетки

label_name = blank_layer.pageItems['label_name'];
label_name.contents = label_listName[i];

	// Экспорт в jpg

exportOptions  = new ExportOptionsJPEG();
type = ExportType.JPEG;
fileSpec = new File (workFolder +  '\\' + label_listArray[i]);
exportOptions.antiAliasing = true;
exportOptions.qualitySetting = 100;
exportOptions.horizontalScale = 500;
exportOptions.verticalScale = 500;


myDoc.exportFile (fileSpec, type, exportOptions);



	// Закрываем документ без сохранения

myDoc.close (SaveOptions.DONOTSAVECHANGES);

}

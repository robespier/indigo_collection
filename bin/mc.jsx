#target Illustrator-13


function mc(app) {
	this.illustrator = app;
	this.illustrator.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
}

mc.prototype = {
	setup: function() {
		this.task = '3104054'; //Определяем переменные для паспорта 
		this.temp = '1152571'; //шаблона высечки
		this.roll_number = 3; //и намотки, которые задаются в окне диалога или выцепляются из базы данных
		this.hotfolderName = 'CMYK';
		this.hotFolder = new Folder ('X:\\' + this.hotfolderName); //Горячая папка
		this.jobFolder = new Folder ('Y:\\d' + this.task); //Папка паспорта (рабочего каталога)
		this.templateFolder = new Folder ('D:\\work\\template'); //Каталог шаблонов сборки
		this.prListFolder = new Folder ('D:\\work\\print_list'); //Папка, где находятся принт-листы
		this.prList = new File (this.prListFolder + '\\d' + this.task + '.csv'); //Ссылка на файл принт-листа
		this.printList = []; //Массив строк из принт-листа
		this.PDFSettings = new PDFSaveOptions(); // Настройки экспорта в PDF
		this.PDFSettings.acrobatLayers = false;
	},
	/*
	 * Имя шаблона
	 */
	getTemplateName: function () {
		var template = new File (this.templateFolder + '\\short\\' + this.temp + '_short' + '.ait'); //Ссылка на файл шаблона
		return template;	
	},

	/*
	 * Открытие шаблона
	 * @returns Document Object
	 */
	openTemplate: function() {
		var template = this.getTemplateName();
		this.illustrator.open (template); //Открываем шаблон
		var myDoc = app.activeDocument; //Создаем ссылку на активный документ
		myDoc.rulerOrigin = [0,0]; //Обнуляем центр координат
		this.template = myDoc;
		return this.template;
	},
	/*
	 * Установка слоя 'Label'
	 * @returns Layer Object
	 */
	setLabelLayer: function() {
		// TODO newlayer в глобальном пространстве имен :(
		newlayer = this.template.layers.add(); // Создаем слой для размещения этикеток
		newlayer.name = 'label'; // называем его именем label
		newlayer.zOrder(ZOrderMethod.SENDTOBACK); // и помещаем его в самый низ в пачке слоев документа
		return this.template.layers['label'];
	},
	/*
	 * Находим левый нижний контур высечки
	 * @returns PathItem
	 */
	getLowerCut: function() {
		var cuts = this.template.layers['cut'].pathItems; // Создаем ссылку на массив высечек
		sumXY = new Array (cuts.length); // Cоздаем массив, в котором сохраняем сумму X и Y-позиций всех элементов массива высечек.
		for (i=0, l=cuts.length; i < l; i++) {
			var xPos = cuts[i].position[0];
			var yPos = cuts[i].position[1];
			sumXY[i] = xPos+yPos;
		}
		var target_index = 0; // Находим индекс мин. значения массива
		target_sum = sumXY[0];

		for (i=0, l=sumXY.length; i < l; i++) {
			if (sumXY[i] <= target_sum) {
				target_index = i;
				target_sum = sumXY[i];
			}
		}
		var targetCut = cuts[target_index]; // Определяем целевой контур
		this.targetCut = targetCut;
		return this.targetCut;
	},
	/*
	 * Получить массив этикеток для печати
	 * @returns Array of File Objects
	 */
	getLabels: function() {
		this.labels = []; // Экземплярная переменная для хранения этикеток
		this.prList.open(); // Открываем принт-лист ; TODO Слишком жесткая связь

		while (line=this.prList.readln()) {
			file_name = line;
			var labelObjectFile= new File (file_name); // Создаем ссылку на файл этикетки
			this.labels.push(labelObjectFile); // Сохраняем ссылку на файл в экземплярной переменной
		}
		this.prList.close();
		return this.labels;
	},
	/*
	 * Выбор намоток
	 * @returns graphicStyle object
	 */
	getStyle: function() {
		var myRolls = this.template.graphicStyles; // Считываем массив намоток (графических стилей) документа
		switch(this.roll_number) {
			case 0:
				if (this.transform()) {
					myStyle=myRolls['roll_1_6']; // Крутить
				} else {
					myStyle=myRolls['roll_4_8']; // Не крутить
				}
				break;
			case 1:
				myStyle=myRolls['roll_1_6']
					break;
			case 2:
				myStyle=myRolls['roll_2_5']
					break;
			case 3:
				myStyle=myRolls['roll_3_7']
					break;
			case 4:
				myStyle=myRolls['roll_4_8']
					break;
			case 5:
				myStyle=myRolls['roll_2_5']
					break;
			case 6:
				myStyle=myRolls['roll_1_6']
					break;
			case 7:
				myStyle=myRolls['roll_3_7']
					break;
			case 8:
				myStyle=myRolls['roll_4_8']
					break;
			default:
				alert ('No such roll');
				break;
		}
		return myStyle;
	},
	/*
	 * Логика определения намотки
	 * Вызывается из getStyle.switch...
	 * @returns boolean
	 */
	transform: function() {
		// Ручная намотка
		// ПРЯМОУГОЛЬНАЯ / ОВАЛЬНАЯ ЭТИКЕТКА
		// 1 - квадрат, крутить не надо;
		// 0.999 ширина меньше высоты, крутим на -90 градусов
		// 1.999 ширина больше высоты, крутить не надо
		targetCutRate = this.targetCut.width/this.targetCut.height;
		labelRate = this.currentLabel.width/this.currentLabel.height;
		return (((targetCutRate < 1) && (labelRate > 1)) || ((targetCutRate > 1) && (labelRate < 1)));
	},
	/*
	 * Поместить и позиционировать этикетку на слой labels
	 * @param origin - pathItem, arrange target;
	 * @param file - File object to place on;
	 * @returns void;
	 */ 
	placeLabel: function(origin, file) {
		var LsizeX = this.targetCut.width; //Определяем ширину единичного контура высечки
		var LsizeY = this.targetCut.height; //Определяем высоту единичного контура высечки
		this.currentLabel = newlayer.placedItems.add();
		cl = this.currentLabel;
		cl.file = file;
		clX = origin.position[0]+(LsizeX/2) - (cl.width/2);
		clY = origin.position[1]-(LsizeY/2) + (cl.height/2);
		cl.position = new Array (clX, clY); //Выравниваем этикетку по целевому контуру
	},
	/*
	 * Применить шаблон к ТЕКУЩЕЙ этикетке
	 * @param label PlacedItem object
	 * @returns void
	 */
	applyStyle: function() {
		myStyle = this.getStyle();
		myStyle.applyTo(this.currentLabel); // Применям графический стиль к этикетке
	},

	getPDFName: function(index) {

	if (this.currentLabel instanceof File) {
		this.child = this.currentLabel.parent;
	} else {
		this.child = this.currentLabel.file.parent;
	}

	var mother = this.child.parent;
	var father = mother.parent;
	
		// Определяем диапазон папок 
	var targetName = [];
	for (i=0, l=this.labels.length; i < l; i++) {
		targetName[i]= this.labels[i].parent.name;
	}

if (targetName.length == 1) {
	this.range = targetName[0];
	
// Если массив из одного значения, то this.range равен ему.
// в противном случае, мы проверяем на уникальность все элементы массива

} else {
		
	targetName.sort();
	var unique;
	
	for (i=1, l=targetName.length; i < l; i++) {
		if (targetName[0] == targetName[i]) {
			unique = 0;			
		} else {
			unique = 1;
		}		
	}

	if (unique < 1) {
	this.range = targetName[0];
// если уникальность равна нулю, значит элементы  targetName одинаковые
// и range будет представлен одним числом,
// в противном случае, элементы  targetName - разные, тогда range будет составной.
		} else {
	this.range = targetName[0] + '_' + targetName[targetName.length-1];			
	}
}
	
	var NamePart = this.getNamePart(index);
	var PDFName = father.name + mother.name;
	return PDFName + NamePart;
	},

	/*
	 * Экспорт готовой продукции
	 * @returns void
	 */
	exportPDF: function(fileName) {
		this.ResultFilePDF = new File (fileName);
		this.template.saveAs(this.ResultFilePDF, this.PDFSettings);
	},


	/*
	 * Кидаем сборку в горячую папку
	 */

	sendtoHotFolder: function() {
		this.ResultFilePDF.copy(this.hotFolder + '\\' + this.ResultFilePDF.name);	
	},
	/*
	 * Закрываем активный документ
	 * @returns void;
	 */
	closeTemplate: function() {
		this.template.close (SaveOptions.DONOTSAVECHANGES);
	},
	/*
	 * Шаблонный метод -- Make Collection
	 */
	run: function() {
		this.openTemplate();
		this.setLabelLayer();
		this.getLowerCut();
		this.getLabels();
		this.imposeLabels();
		this.closeTemplate();
	},
}

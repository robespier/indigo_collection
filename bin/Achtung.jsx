#target Illustrator-13

#include "mc.jsx"

function achtung() {};
achtung.prototype = new mc(app);
achtung.prototype.constructor = achtung;

	
achtung.prototype.imposeLabels = function() {

			
	var myDoc = this.template;

	this.achtung = new File ('Y:\\ACHTUNG.eps'); // Ссылка на объектную переменную типа файл
	var achtungPlace = newlayer.placedItems.add();
	achtungPlace.file = this.achtung; //Помещаем на слой layer файл ACHTUNG.eps
	var targetPlace = new Array ((myDoc.width/2)-(achtungPlace.width/2), (myDoc.height/2)+(achtungPlace.height/2));

	this.currentLabel = newlayer.placedItems.add(); // Плейсим "левую" этикетку
	this.currentLabel.file = this.labels[0]; // Получаем ссылку для child из getPDFName()
	
//Выравниваем ахтунг по центру артбоарда

	achtungPlace.position = targetPlace;

//Корректируем размеры ахтунга

var width_percent = (myDoc.width*88)/achtungPlace.width;
var height_percent = (myDoc.height*99)/achtungPlace.height;

achtungPlace.resize (width_percent, height_percent);
	
	this.getFullPDFName();	
	var PDFName = this.getPDFName(); //
	this.currentLabel.remove(); // Удаляем "левую" этикетку
	this.exportPDF(PDFName);
	this.sendtoHotFolder(); // Кидаем сборку в горячую папку

}

// Получаем изменяемую часть имени PDF-файла

	achtung.prototype.getNamePart = function() {
var NamePart = '_ACHTUNG.pdf';
	return NamePart;
	}
/*
 * Сгенерировать имя PDF для экспорта
 * @index int File number
 * @returns string
 */
	achtung.prototype.getPDFName = function(index) {
	
// Определяем диапазон папок 
	var targetName = [];
		for (i=0, l=this.labels.length; i < l; i++) {
		targetName[i]= this.labels[i].parent.name;
}

	targetName.sort();
	
range = targetName[0] + '-' + targetName[targetName.length-1];

	var PDFName = this.father.name + this.mother.name + range;	
	

// Имя файла сборки
	PDFName +=this.getNamePart();
// Путь для файла сборки
	return this.child + '\\' + PDFName;
}

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

	//Выравниваем ахтунг по центру артбоарда

	achtungPlace.position = targetPlace;

	//Корректируем размеры ахтунга

	var width_percent = (myDoc.width*88)/achtungPlace.width;
	var height_percent = (myDoc.height*99)/achtungPlace.height;

	achtungPlace.resize (width_percent, height_percent);

	this.currentLabel = this.labels[0];
	this.exportPDF(this.currentLabel.parent + '\\' + this.getPDFName());
	this.sendtoHotFolder(); // Кидаем сборку в горячую папку
}

achtung.prototype.getNamePart = function() {
	NamePart = this.range + '_ACHTUNG.pdf';
	return NamePart;
}
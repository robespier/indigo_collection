#target Illustrator-13

#include "mc.jsx"

function matching() {};
matching.prototype = new mc(app);
matching.prototype.constructor = matching;

matching.prototype.currentLabel = null;

/*
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * @returns void
 */
matching.prototype.imposeLabels = function() {
	var cuts = this.template.layers['cut'].pathItems;
	var cutsCount = cuts.length;
	var labelsCount = this.labels.length;
	var i = 0;
	var l = labelsCount;
	utvCount = 1; // Счетчик имен сборок-утверждений
	while (labelsCount > 0) {
		newlayer.placedItems.removeAll();
		for (i,k=0; i < l && k < cutsCount; k++, i++) {
			// Помещаем на слой layer файл этикетки
			this.placeLabel(cuts[k], this.labels[i]);
			// Крутим
			this.applyStyle();
		}
		labelsCount -= cutsCount;
		this.exportPDF(this.currentLabel.file.parent + '\\' + this.getPDFName(utvCount));
		this.sendtoHotFolder(); // Кидаем сборку в горячую папку
		utvCount++;
	}
}

matching.prototype.getNamePart = function(index) {
	NamePart = this.range + '_UTV_' + index.toString() + '.pdf';
	return NamePart;
}

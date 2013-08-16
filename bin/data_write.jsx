 function job(order, customer, descript, manager, designer, task, temp, roll, ink) {
   this.order = order; // Номер заказа (Job ID)
   this.customer = customer; // Заказчик
   this.descript = descript; // Описание заказа
   this.manager = manager; // Ответственное лицо (менеждер)
   this.designer = designer; // Дизайнер
   this.task = task; // Номер задания (farher + mather + child / children)
   this.temp = temp; // Номер шаблона
   this.roll = roll; // Номер намотки
   this.ink = new Array(); // Красочность тиража
   this.finish =new Array(); // Отделка (лак, тиснение, конгрев)
   }

job1 = new job('113-00436', 'Гудь ИП', 'Отделочные материалы', 'Хафизова А.', 'Сергеев Р.', '5006006', '4090354', '2');

db_name = 'db_emulation';
tempFolder = new Folder('D:\\work\\temp');
tempFile = new File(tempFolder + '\\' + db_name + '.txt');
tempFile.open('e');
tempFile.write(job1.toSource());
tempFile.close;

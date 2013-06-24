@echo off

echo css文件开始复制
copy ..\src\cssreset\css\cssreset.css+..\src\cssfonts\css\cssfonts.css+..\src\csslayout\css\csslayout.css cSun.css /b
copy ..\src\cssbase\css\cssbase.css+..\src\list\css\list.css+..\src\searcher\css\searcher.css+..\src\nav\css\nav.css+..\src\table\css\table.css cWidget.css /b
copy ..\src\list\css\list.theme.css+..\src\searcher\css\searcher.theme.css+..\src\nav\css\nav.theme.css++..\src\table\css\table.theme.css tWidget.css /b
copy ..\src\cssfonts\css\cssfonts.site.css+..\src\sitelogo\css\sitelogo.css cSite.css /b
echo css文件复制完成

echo 压缩css文件
java -jar yuicompressor-2.4.7.jar cSun.css -o cSun.min.css
java -jar yuicompressor-2.4.7.jar cWidget.css -o cWidget.min.css
java -jar yuicompressor-2.4.7.jar tWidget.css -o tWidget.min.css


echo prototype-lang文件开始复制
copy ..\src\jslang\prototype\object.js+..\src\jslang\prototype\function.js+..\src\jslang\prototype\enumerable.js+ ..\src\jslang\prototype\array.js+..\src\jslang\prototype\class.js+..\src\jslang\prototype\date.js+..\src\jslang\prototype\regexp.js+..\src\jslang\prototype\periodical_executer.js+..\src\jslang\prototype\string.js+..\src\jslang\prototype\template.js+..\src\jslang\prototype\hash.js+..\src\jslang\prototype\number.js+..\src\jslang\prototype\range.js ..\src\jslang\prototype-lang.js /b
echo prototype-lang文件复制完成

copy ..\lib\yepnope.min.js+..\src\jslang\prototype-lang.js+..\src\jslang\hashmap\js\hashmap.js+..\src\jslang\event\js\event.js+..\src\jslang\eventlisteneradapter\js\eventlisteneradapter.js+..\src\core\js\core.js+..\src\element\js\element.js+..\src\view\js\view.js+..\src\page\js\page.js jClass.js /b
java -jar yuicompressor-2.4.7.jar jClass.js -o jClass.min.js

copy ..\src\list\js\list.js jWidget.js /b
java -jar yuicompressor-2.4.7.jar jWidget.js -o jWidget.min.js

pause










@echo off
set jBrowser_Version=0.0.1
set jClass_Version=0.2.1
set jWidget_Version=0.1.1
set cSun_Version=0.2.1
set cWidget_Version=0.1.1
set tWidget_Version=0.1.1
set cSite_Version=0.1.1
echo css文件开始复制
copy ..\src\cssreset\css\cssreset.css+..\src\cssfonts\css\cssfonts.css+..\src\csslayout\css\csslayout.css cSun-%cSun_Version%.css /b
copy ..\src\cssbase\css\cssbase.css+..\src\list\css\list.css+..\src\searcher\css\searcher.css+..\src\nav\css\nav.css+..\src\table\css\table.css+..\src\article\css\article.css+..\src\chart\css\chart.css+..\src\form\css\form.css+..\src\binarypad\css\binarypad.css+..\src\wizard\css\wizard.css cWidget-%cWidget_Version%.css /b
copy ..\src\list\css\list.theme.css+..\src\searcher\css\searcher.theme.css+..\src\nav\css\nav.theme.css+..\src\table\css\table.theme.css+..\src\article\css\article.theme.css+..\src\chart\css\chart.theme.css+..\src\form\css\form.theme.css+..\src\binarypad\css\binarypad.theme.css+..\src\wizard\css\wizard.theme.css tWidget-%tWidget_Version%.css /b
copy ..\src\cssfonts\css\cssfonts.site.css+..\src\sitelogo\css\sitelogo.css cSite-%cSite_Version%.css /b
echo css文件复制完成

echo 压缩css文件
java -jar yuicompressor-2.4.8.jar cSun-%cSun_Version%.css -o cSun-%cSun_Version%.min.css
java -jar yuicompressor-2.4.8.jar cWidget-%cWidget_Version%.css -o cWidget-%cWidget_Version%.min.css
java -jar yuicompressor-2.4.8.jar tWidget-%tWidget_Version%.css -o tWidget-%tWidget_Version%.min.css

rem 处理prototype
echo prototype-lang文件开始复制
文件开始复制
copy ..\src\jslang\prototype\prototype.js+..\src\jslang\prototype\object.js+..\src\jslang\prototype\function.js+..\src\jslang\prototype\enumerable.js+ ..\src\jslang\prototype\array.js+..\src\jslang\prototype\class.js+..\src\jslang\prototype\date.js+..\src\jslang\prototype\regexp.js+..\src\jslang\prototype\periodical_executer.js+..\src\jslang\prototype\string.js+..\src\jslang\prototype\template.js+..\src\jslang\prototype\hash.js+..\src\jslang\prototype\number.js+..\src\jslang\prototype\range.js ..\src\jslang\prototype-lang.js /b
echo prototype-lang文件复制完成

rem 处理iui-lang
echo iui-lang文件开始复制
copy ..\src\jslang\hashmap\js\hashmap.js+..\src\jslang\event\js\event.js+..\src\jslang\extensions\js\extensions.js+..\src\jslang\eventadapter\js\eventadapter.js ..\src\jslang\iui-lang.js /b
echo iui-lang文件复制完成

echo jBrowser-%jBrowser_Version%.js文件开始复制
copy ..\src\core\js\core.js jBrowser-%jBrowser_Version%.js /b
rem java -jar yuicompressor-2.4.8.jar jBrowser-%jBrowser_Version%.js -o jBrowser-%jBrowser_Version%.min.js
java -jar closure-compiler.jar --js jBrowser-%jBrowser_Version%.js --js_output_file jBrowser-%jBrowser_Version%.min.js
 
echo jClass-%jClass_Version%.js文件开始复制
copy ..\src\jslang\prototype-lang.js+..\src\jslang\iui-lang.js jClass-%jClass_Version%.js /b
rem java -jar yuicompressor-2.4.8.jar jClass-%jClass_Version%.js -o jClass-%jClass_Version%.min.js
java -jar closure-compiler.jar --js jClass-%jClass_Version%.js --js_output_file jClass-%jClass_Version%.min.js

echo jWidget-%jWidget_Version%.js文件开始复制
copy ..\src\element\js\element.js+..\src\view\js\view.js+..\src\page\js\page.js+..\src\list\js\list.js+..\src\chart\js\chart.js+..\src\binarypad\js\binarypad.js+..\src\wizard\js\wizard.js jWidget-%jWidget_Version%.js /b
rem java -jar yuicompressor-2.4.8.jar jWidget-%jWidget_Version%.js -o jWidget-%jWidget_Version%.min.js
java -jar closure-compiler.jar --js jWidget-%jWidget_Version%.js --js_output_file jWidget-%jWidget_Version%.min.js


pause










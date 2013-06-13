@echo off
echo js文件开始复制
copy /b  ..\lib\jquery.js+..\lib\moderniz.js+..\lib\qunit.js+..\src\element\js\element.js+..\src\jslang\class\js\class.js+..\src\jslang\event\js\event.js+..\src\jslang\eventlisteneradapter\js\eventlisteneradapter.js+..\src\jslang\object\js\object.js+..\src\list\js\list.js+..\src\page\js\page.js+..\src\searcher\js\searcher.js+..\src\tip\js\tip.js+\..\src\view\js\view.js jsUltimate.js
echo js文件复制完成


echo css文件开始复制
copy /b  ..\lib\qunit.css+..\src\cssfonts\css\cssfonts.css+..\src\csslayout\css\csslayout.css+..\src\cssreset\css\cssreset.css+..\src\list\css\list.css+..\src\list\css\list.theme.css+..\src\searcher\css\searcher.css+..\src\tip\css\tip.css+..\src\tip\css\tip.theme.css  cssUltimate.css
echo css文件复制完成

echo 压缩js文件
java -jar yuicompressor-2.4.7.jar jsUmitate.js -o jsUltimateMin.css

echo 压缩css文件
java -jar yuicompressor-2.4.7.jar cssUmitate.css -o cssUltimateMin.css

echo 删除文件
del /F jsUltimate.js
del /F cssUltimate.css










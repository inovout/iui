@echo off

echo css文件开始复制
copy ..\src\cssreset\css\cssreset.css+..\src\csslayout\css\csslayout.css  cSun.css /b
copy ..\src\cssfonts\css\cssfonts.css tSun.css /b
echo css文件复制完成

echo 压缩css文件
java -jar yuicompressor-2.4.7.jar cSun.css -o cSun.min.css
java -jar yuicompressor-2.4.7.jar tSun.css -o tSun.min.css












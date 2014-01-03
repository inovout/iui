@echo off
set rsa_Version=1.0.0
echo rsa.iui-%rsa_Version%.js文件开始复制
copy ..\lib\rsa\jsbn.js+..\lib\rsa\random.js+..\lib\rsa\hash.js+..\lib\rsa\rsa.js+..\lib\rsa\aes.js+..\lib\rsa\api.js  rsa.iui-%rsa_Version%.js /b
java -jar closure-compiler.jar --js rsa.iui-%rsa_Version%.js --js_output_file  rsa.iui-%rsa_Version%.min.js

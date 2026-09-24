@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1
set PATH=%JAVA_HOME%\bin;%PATH%
cd backend
FOR /F "tokens=1,2 delims==" %%i IN (..\.env) DO set %%i=%%j
echo Starting Spring Boot Backend...
mvnw.cmd spring-boot:run
pause

@set service_name=kaservice
@set cur_path=%~dp0

@sc query %service_name% 
@if not ERRORLEVEL 1060 GOTO SERVICE_EXIST

@echo Installing...
@sc create %service_name% displayname= "KA Logistic Services" binpath= "%cur_path%KLogistic.ServiceHost" start= auto
@echo Service '%service_name%' has been installed successfully
@GOTO END

:SERVICE_EXIST
@echo Service '%service_name%' already existed

:END
@pause
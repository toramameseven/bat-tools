rem ^\s*(::|REM|@REM)\s*(#+)\s*(.*)
@REM # index1
REM ## index2
  @rem ### index3
rem #### index4
@REM ##### index5
  @REM no index
@REM ###### index6
@REM ####### index7

rem ^\s*(::|REM|@REM)\s*(=+)\s*(.*)
@REM = index1(adoc)
REM == index2(adoc)
@rem === index3(adoc)

exit /b

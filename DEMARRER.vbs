Set WshShell = CreateObject("WScript.Shell")

dossier = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))

WshShell.Run """" & dossier & "LANCER.bat" & """", 0, False

Set WshShell = Nothing
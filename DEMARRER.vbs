Set WshShell = CreateObject("WScript.Shell")

chemin = Replace(WScript.ScriptFullName, "DEMARRER.vbs", "LANCER.bat")

WshShell.Run """" & chemin & """", 0, False

Set WshShell = Nothing
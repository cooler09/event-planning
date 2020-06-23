param(
    [string]$fireBaseToken,
    [string]$fireBaseProject
)
$dir = Split-Path $MyInvocation.MyCommand.Path
Push-Location $dir

write-host "params" + $fireBaseToken + " " + $fireBaseProject;
npm i -g firebase-tools
write-host "starting deploy...";
firebase --version;
firebase deploy --token $fireBaseToken --project $fireBaseProject --only hosting;
write-host "deployment completed";

Pop-Location
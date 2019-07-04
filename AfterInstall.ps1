Import-Module WebAdministration
$versionNumber = 1

if ($PSHOME -like "*SysWOW64*")
{
  Write-Warning "Restarting this script under 64-bit Windows PowerShell."

  # Restart this script under 64-bit Windows PowerShell.
  #   (\SysNative\ redirects to \System32\ for 64-bit mode)

  & (Join-Path ($PSHOME -replace "SysWOW64", "SysNative") powershell.exe) -File `
    (Join-Path $PSScriptRoot $MyInvocation.MyCommand) @args

  # Exit 32-bit script.

  Exit $LastExitCode
}

[bool]$SubDomainRequired=$true
$DeployPath='C:\inetpub\wwwroot\'
$ApplicationPoolName='App'
[int]$Port=8082

#deployment path which gets updated in the script automatically... Leave it black...
$global:DeploymentFullPath=''
$global:ArtifactFullPath= 'C:\AppTemp\build\*'

#Domain Variables
$DomainName='maksbeatflow.com'
$DomainApplications=''

#SubDomain Variables
$SubDomainName='ir.maksbeatflow.com'
$SubDomainApplications='App'
 
 
function CreateDomain([string] $DomainName, [string] $ApplicationPoolName, [string] $Application, [string] $PhysicalPath)
   {
     CreateAppPool -ApplicationPoolName $ApplicationPoolName
        #Create Domain Subdomain if not exists,then Specific Apps will create.
         if(!(Get-Website | where-object { $_.name -eq $DomainName }) -and (!($DomainName -eq '')))
         {
            if(!(Test-Path $PhysicalPath ))
				{
					New-Item -ItemType Directory -Force -Path $PhysicalPath
				} 
           New-Website -Name $DomainName  -PhysicalPath $PhysicalPath -Port $Port -HostHeader $DomainName -ApplicationPool $ApplicationPoolName -Force
           if(!($Application -eq ''))
			   {
					CreateDomainSubDomainApplications -Application $Application -DomainName $DomainName -ApplicationPoolName $ApplicationPoolName -PhysicalPath $PhysicalPath
			   }
         }
		 elseif(Get-Website | where-object { $_.name -eq $DomainName })
		 {
			CreateDomainSubDomainApplications -Application $Application -DomainName $DomainName -ApplicationPoolName $ApplicationPoolName -PhysicalPath $PhysicalPath
		 }
   }

function CreateDomainSubDomainApplications([string] $Application, [string] $DomainName, [string] $ApplicationPoolName, [string] $PhysicalPath)
   {
        if((Get-WebApplication -Name $Application) -eq $null)
        { 
            $global:DeploymentFullPath=Join-Path $PhysicalPath $Application
            if(!(Test-Path $DeploymentFullPath ))
            {
                New-Item -ItemType Directory -Force -Path $DeploymentFullPath
            }
            New-WebApplication -Name $Application -Site $DomainName -PhysicalPath $DeploymentFullPath -ApplicationPool $ApplicationPoolName
        }
     
   }

function CreateAppPool([string] $ApplicationPoolName)
   {
        if(!(Test-Path IIS:\AppPools\$ApplicationPoolName))
        {
            New-WebAppPool "$ApplicationPoolName" -Force
        }
   }
 
function CreateDomainSubDomain()
   {
	   #Path created for Domain
	   $PhysicalDomainPath=Join-Path $DeployPath $DomainName
	   CreateDomain -DomainName $DomainName -ApplicationPoolName $ApplicationPoolName -Application $DomainApplications -PhysicalPath $PhysicalDomainPath
	   #IF Sub Domain creation required, then true else false.
	   if($SubDomainRequired)
	   {
			#Path created for SubDomain
			$PhysicalSubDomainPath=Join-Path $PhysicalDomainPath $SubDomainName
			CreateDomain -DomainName $SubDomainName -ApplicationPoolName $ApplicationPoolName -Application $SubDomainApplications -PhysicalPath $PhysicalSubDomainPath
	   }
   }

#Main Function to create Domain and SubDomain
CreateDomainSubDomain
Write-Host "I gonna copy files to" $global:DeploymentFullPath
Copy-Item $global:ArtifactFullPath -Destination $global:DeploymentFullPath -Recurse
Write-Host "I've just copied the files to" $global:DeploymentFullPath
#Remove-Item $global:ArtifactFullPath -Recurse
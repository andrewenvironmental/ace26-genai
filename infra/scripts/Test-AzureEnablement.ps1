param(
    [Parameter(Mandatory = $true)]
    [string]$SubscriptionId,

    [string[]]$RequiredProviders = @(
        'Microsoft.CognitiveServices',
        'Microsoft.Search',
        'Microsoft.Storage',
        'Microsoft.KeyVault',
        'Microsoft.Insights',
        'Microsoft.ContainerRegistry',
        'Microsoft.Web',
        'Microsoft.OperationalInsights'
    )
)

$ErrorActionPreference = 'Stop'

Write-Host "Checking Azure context..."
az account set --subscription $SubscriptionId
$account = az account show --output json | ConvertFrom-Json

if ($account.id -ne $SubscriptionId) {
    throw "Azure CLI did not switch to subscription '$SubscriptionId'. Current subscription is '$($account.id)'. Run 'az login --tenant <workshop-tenant-id>' and try again."
}

Write-Host ""
Write-Host "Account"
Write-Host "  Subscription: $($account.name)"
Write-Host "  Subscription ID: $($account.id)"
Write-Host "  Tenant ID: $($account.tenantId)"
Write-Host "  User: $($account.user.name)"

Write-Host ""
Write-Host "Resource Providers"
foreach ($provider in $RequiredProviders) {
    $state = az provider show --namespace $provider --query registrationState --output tsv 2>$null
    if ([string]::IsNullOrWhiteSpace($state)) {
        $state = 'NotFoundOrNoAccess'
    }

    $marker = if ($state -eq 'Registered') { 'OK' } else { 'ACTION' }
    Write-Host "  [$marker] $provider = $state"
}

Write-Host ""
Write-Host "Role Assignments For Current User"
$assignee = $account.user.name
$signedInUser = az ad signed-in-user show --query id --output tsv 2>$null
if (-not [string]::IsNullOrWhiteSpace($signedInUser)) {
    $assignee = $signedInUser
}

$roles = @()
try {
    $roles = az role assignment list `
        --assignee $assignee `
        --scope "/subscriptions/$SubscriptionId" `
        --include-inherited `
        --query "[].{role:roleDefinitionName,scope:scope}" `
        --output json 2>$null | ConvertFrom-Json
} catch {
    Write-Host "  Could not resolve role assignments for $($account.user.name)."
    Write-Host "  This often means the signed-in account is external to the tenant or Microsoft Graph lookup is restricted."
}

if (-not $roles) {
    Write-Host "  No subscription-scope assignments visible for $assignee."
} else {
    foreach ($role in $roles) {
        Write-Host "  $($role.role) at $($role.scope)"
    }
}

Write-Host ""
Write-Host "Likely IT Enablement Items"
Write-Host "  - Register any provider above marked ACTION."
Write-Host "  - Confirm an Owner or User Access Administrator can run RBAC role assignments."
Write-Host "  - Confirm Azure AI Foundry / Azure OpenAI model access, quota, region, and SKU."
Write-Host "  - Confirm policy allows the selected regions and public network access for workshop resources."

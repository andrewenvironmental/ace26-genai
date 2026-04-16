[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$ResourceGroup = 'rg-ace26-genai-workshop-dev',
    [string]$AiServicesAccountName = 'aceaiworksho-ai-is6hct',

    [ValidateSet('Dev', 'Workshop')]
    [string]$Mode = 'Workshop',

    [int]$ProCapacity = 0,
    [int]$MiniCapacity = 0,
    [int]$NanoCapacity = 0,
    [int]$EmbeddingCapacity = 0
)

$ErrorActionPreference = 'Stop'

$profiles = @{
    Dev = @(
        @{
            Name = 'gpt-5.4-pro'
            Model = 'gpt-5.4-pro'
            Version = '2026-03-05'
            Capacity = 100
        },
        @{
            Name = 'gpt-5.4-mini'
            Model = 'gpt-5.4-mini'
            Version = '2026-03-17'
            Capacity = 1
        },
        @{
            Name = 'gpt-5.4-nano'
            Model = 'gpt-5.4-nano'
            Version = '2026-03-17'
            Capacity = 1
        },
        @{
            Name = 'text-embedding-3-small'
            Model = 'text-embedding-3-small'
            Version = '1'
            Capacity = 1
        }
    )
    Workshop = @(
        @{
            Name = 'gpt-5.4-pro'
            Model = 'gpt-5.4-pro'
            Version = '2026-03-05'
            Capacity = 160
        },
        @{
            Name = 'gpt-5.4-mini'
            Model = 'gpt-5.4-mini'
            Version = '2026-03-17'
            Capacity = 300
        },
        @{
            Name = 'gpt-5.4-nano'
            Model = 'gpt-5.4-nano'
            Version = '2026-03-17'
            Capacity = 1000
        },
        @{
            Name = 'text-embedding-3-small'
            Model = 'text-embedding-3-small'
            Version = '1'
            Capacity = 100
        }
    )
}

$deployments = foreach ($deployment in $profiles[$Mode]) {
    $copy = $deployment.Clone()
    switch ($copy.Name) {
        'gpt-5.4-pro' {
            if ($ProCapacity -gt 0) {
                $copy.Capacity = $ProCapacity
            }
        }
        'gpt-5.4-mini' {
            if ($MiniCapacity -gt 0) {
                $copy.Capacity = $MiniCapacity
            }
        }
        'gpt-5.4-nano' {
            if ($NanoCapacity -gt 0) {
                $copy.Capacity = $NanoCapacity
            }
        }
        'text-embedding-3-small' {
            if ($EmbeddingCapacity -gt 0) {
                $copy.Capacity = $EmbeddingCapacity
            }
        }
    }
    $copy
}

Write-Host "Applying $Mode model capacity profile to $AiServicesAccountName..."

foreach ($deployment in $deployments) {
    $target = "$($deployment.Name) capacity $($deployment.Capacity)"
    if ($PSCmdlet.ShouldProcess($target, 'create or update Azure OpenAI deployment')) {
        az cognitiveservices account deployment create `
            --resource-group $ResourceGroup `
            --name $AiServicesAccountName `
            --deployment-name $deployment.Name `
            --model-name $deployment.Model `
            --model-version $deployment.Version `
            --model-format OpenAI `
            --sku-name GlobalStandard `
            --sku-capacity $deployment.Capacity `
            --output none

        Write-Host "Updated $($deployment.Name) to capacity $($deployment.Capacity)."

        # Cognitive Services rejects concurrent deployment updates on the same account.
        Start-Sleep -Seconds 20
    }
}

az cognitiveservices account deployment list `
    --resource-group $ResourceGroup `
    --name $AiServicesAccountName `
    --query "[].{name:name,model:properties.model.name,version:properties.model.version,sku:sku.name,capacity:sku.capacity,rateLimits:properties.rateLimits}" `
    --output table

@description('Create an Azure AI Services / Azure OpenAI account. If false, accountName is treated as existing.')
param createAiServicesAccount bool

@description('Azure AI Services / Azure OpenAI account name.')
param accountName string

@description('Azure region for a new account.')
param location string

@allowed([
  'AIServices'
  'OpenAI'
])
@description('Kind of Cognitive Services account to create.')
param accountKind string

@description('Enable public network access on a new account.')
param enablePublicNetworkAccess bool

@description('Create or update model deployments.')
param deployModelDeployments bool

@description('Model deployments to create or update.')
param modelDeployments array

@description('Chat deployment name to expose in outputs.')
param chatDeploymentName string

@description('Embedding deployment name to expose in outputs.')
param embeddingDeploymentName string

@description('Tags applied to a new account.')
param tags object

resource createdAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' = if (createAiServicesAccount) {
  name: accountName
  location: location
  tags: tags
  kind: accountKind
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: accountName
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
  }
}

resource existingAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = if (!createAiServicesAccount) {
  name: accountName
}

resource createdAccountDeployments 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = [for deployment in modelDeployments: if (createAiServicesAccount && deployModelDeployments) {
  parent: createdAccount
  name: deployment.name
  sku: {
    name: deployment.skuName
    capacity: deployment.capacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: deployment.modelName
      version: deployment.modelVersion
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
  }
}]

resource existingAccountDeployments 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = [for deployment in modelDeployments: if (!createAiServicesAccount && deployModelDeployments) {
  parent: existingAccount
  name: deployment.name
  sku: {
    name: deployment.skuName
    capacity: deployment.capacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: deployment.modelName
      version: deployment.modelVersion
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
  }
}]

output accountName string = accountName
output accountId string = createAiServicesAccount ? createdAccount!.id : existingAccount!.id
output endpoint string = createAiServicesAccount ? createdAccount!.properties.endpoint : existingAccount!.properties.endpoint
output chatDeploymentName string = chatDeploymentName
output embeddingDeploymentName string = embeddingDeploymentName

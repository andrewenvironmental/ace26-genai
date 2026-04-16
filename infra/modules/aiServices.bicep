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

@description('Create or update an account-native Azure AI Foundry project.')
param createAiServicesProject bool

@description('Azure AI Foundry project name under the AI Services account.')
param projectName string

@description('Azure AI Foundry project display name.')
param projectDisplayName string

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
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  properties: {
    allowProjectManagement: true
    customSubDomainName: accountName
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
  }
}

resource existingAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = if (!createAiServicesAccount) {
  name: accountName
}

resource createdAccountProject 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' = if (createAiServicesAccount && createAiServicesProject) {
  parent: createdAccount
  name: projectName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    displayName: projectDisplayName
    description: 'Azure AI Foundry project for the ACE AI workshop playground activity.'
  }
}

resource existingAccountProject 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' = if (!createAiServicesAccount && createAiServicesProject) {
  parent: existingAccount
  name: projectName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    displayName: projectDisplayName
    description: 'Azure AI Foundry project for the ACE AI workshop playground activity.'
  }
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
output aiFoundryEndpoint string = 'https://${accountName}.services.ai.azure.com'
output projectName string = createAiServicesProject ? projectName : ''
output projectId string = createAiServicesProject ? (createAiServicesAccount ? createdAccountProject!.id : existingAccountProject!.id) : ''
output projectEndpoint string = createAiServicesProject ? 'https://${accountName}.services.ai.azure.com/api/projects/${projectName}' : ''
output projectPrincipalId string = createAiServicesProject ? (createAiServicesAccount ? createdAccountProject!.identity.principalId : existingAccountProject!.identity.principalId) : ''
output chatDeploymentName string = chatDeploymentName
output embeddingDeploymentName string = embeddingDeploymentName

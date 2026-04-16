@description('Key Vault name.')
param keyVaultName string

@description('Storage account name.')
param storageAccountName string

@description('Workshop document container name.')
param documentContainerName string

@description('Azure AI Services / Azure OpenAI account name.')
param aiServicesAccountName string

@description('Azure AI Services / Azure OpenAI endpoint.')
param aiServicesEndpoint string

@description('Chat deployment name.')
param chatDeploymentName string

@description('Embedding deployment name.')
param embeddingDeploymentName string

@description('Azure AI Search service name.')
param searchServiceName string

@description('Azure AI Search endpoint.')
param searchEndpoint string

@description('Azure AI Search index name used for the workshop.')
param searchIndexName string

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

resource aiServicesAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = {
  name: aiServicesAccountName
}

resource searchService 'Microsoft.Search/searchServices@2025-05-01' existing = {
  name: searchServiceName
}

var storageKeys = storageAccount.listKeys()
var aiServicesKeys = aiServicesAccount.listKeys()
var searchAdminKeys = searchService.listAdminKeys()

var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageKeys.keys[0].value};EndpointSuffix=${environment().suffixes.storage}'

resource aiEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-ai-services-endpoint'
  properties: {
    value: aiServicesEndpoint
  }
}

resource aiKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-ai-services-key'
  properties: {
    value: aiServicesKeys.key1
  }
}

resource chatDeploymentSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-openai-chat-deployment'
  properties: {
    value: chatDeploymentName
  }
}

resource embeddingDeploymentSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-openai-embedding-deployment'
  properties: {
    value: embeddingDeploymentName
  }
}

resource searchEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-search-endpoint'
  properties: {
    value: searchEndpoint
  }
}

resource searchAdminKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-search-admin-key'
  properties: {
    value: searchAdminKeys.primaryKey
  }
}

resource searchIndexSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-search-index-name'
  properties: {
    value: searchIndexName
  }
}

resource storageConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-storage-connection-string'
  properties: {
    value: storageConnectionString
  }
}

resource storageContainerSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'azure-storage-container-name'
  properties: {
    value: documentContainerName
  }
}

output storedSecretNames array = [
  aiEndpointSecret.name
  aiKeySecret.name
  chatDeploymentSecret.name
  embeddingDeploymentSecret.name
  searchEndpointSecret.name
  searchAdminKeySecret.name
  searchIndexSecret.name
  storageConnectionStringSecret.name
  storageContainerSecret.name
]

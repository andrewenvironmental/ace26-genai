targetScope = 'resourceGroup'

@description('Short workshop name used to generate resource names when dedicated resources are created.')
param workshopName string = 'ace-ai-workshop'

@description('Azure region for regional workshop resources such as AI Foundry, storage, key vault, and search.')
param location string = resourceGroup().location

@description('Azure region for Azure AI Services / Azure OpenAI. Keep this in a region where the required model quota exists.')
param aiServicesLocation string = 'eastus2'

@description('Tags applied to resources created by this template.')
param tags object = {
  workload: 'ace26-genai-workshop'
  workshop: 'ace26-genai'
  environment: 'dev'
}

@description('Enable public network access for newly created resources. Set false only if private networking is also configured.')
param enablePublicNetworkAccess bool = true

@description('Create a storage account. If false, existingStorageAccountName is used.')
param createStorageAccount bool = true

@description('Existing storage account used for workshop grounding documents.')
param existingStorageAccountName string = ''

@description('Storage account name to create. Leave empty to generate a deterministic name.')
param storageAccountName string = ''

@description('Blob container used for workshop documents.')
param documentContainerName string = 'workshop-docs'

@description('Create a Key Vault. If false, existingKeyVaultName is used.')
param createKeyVault bool = true

@description('Existing Key Vault used for optional workshop secrets.')
param existingKeyVaultName string = ''

@description('Key Vault name to create. Leave empty to generate a deterministic name.')
param keyVaultName string = ''

@description('Create an Azure Container Registry for optional app/container workflows. Not required for the Foundry account-native project.')
param createContainerRegistry bool = true

@description('Existing Azure Container Registry used for optional app/container workflows.')
param existingContainerRegistryName string = ''

@description('Container Registry name to create. Leave empty to generate a deterministic name.')
param containerRegistryName string = ''

@description('Create Application Insights for optional app diagnostics. If false, existingApplicationInsightsName is used.')
param createApplicationInsights bool = true

@description('Existing Application Insights component used for optional app diagnostics.')
param existingApplicationInsightsName string = ''

@description('Application Insights name to create. Leave empty to generate a deterministic name.')
param applicationInsightsName string = ''

@description('Create a dedicated Azure AI Services / Azure OpenAI account. If false, existingAiServicesAccountName is used.')
param createAiServicesAccount bool = false

@description('Existing Azure AI Services or Azure OpenAI account name.')
param existingAiServicesAccountName string = ''

@description('Azure AI Services / Azure OpenAI account name to create. Leave empty to generate a deterministic name.')
param aiServicesAccountName string = ''

@description('Create or update an account-native Azure AI Foundry project under the AI Services account.')
param createAiServicesProject bool = true

@description('Azure AI Foundry project name. Leave empty to use <ai-services-account-name>-project.')
param aiServicesProjectName string = ''

@allowed([
  'AIServices'
  'OpenAI'
])
@description('Kind of Cognitive Services account to create when createAiServicesAccount is true.')
param aiServicesKind string = 'AIServices'

@description('Create or update model deployments on the AI Services / OpenAI account. Leave false when reusing known deployments.')
param deployModelDeployments bool = false

@description('Model deployments to create when deployModelDeployments is true.')
param modelDeployments array = [
  {
    name: 'gpt-5.4-mini'
    modelName: 'gpt-5.4-mini'
    modelVersion: '2026-03-17'
    skuName: 'GlobalStandard'
    capacity: 1
  }
  {
    name: 'text-embedding-3-small'
    modelName: 'text-embedding-3-small'
    modelVersion: '1'
    skuName: 'GlobalStandard'
    capacity: 1
  }
]

@description('Chat model deployment name workshop participants should select in Foundry.')
param chatDeploymentName string = 'gpt-5.4-mini'

@description('Embedding deployment name used when creating a grounded data connection.')
param embeddingDeploymentName string = 'text-embedding-3-small'

@description('Create an Azure AI Search service for workshop document grounding. If false, existingSearchServiceName is used.')
param createSearchService bool = true

@description('Existing Azure AI Search service name. Required when createSearchService is false.')
param existingSearchServiceName string = ''

@description('Azure AI Search service name to create. Leave empty to generate a deterministic name.')
param searchServiceName string = ''

@allowed([
  'free'
  'basic'
  'standard'
  'standard2'
  'standard3'
])
@description('Azure AI Search SKU. Basic or higher is recommended when using semantic or vector search in the playground.')
param searchSku string = 'free'

@minValue(1)
@description('Azure AI Search replica count.')
param searchReplicaCount int = 1

@minValue(1)
@description('Azure AI Search partition count.')
param searchPartitionCount int = 1

@description('Enable Azure RBAC role assignments for Foundry, Search, Storage, AI Services, and optional participants. Requires Owner or User Access Administrator permissions.')
param enableRoleAssignments bool = false

@description('Participant user, group, or service principal object IDs to grant workshop access when enableRoleAssignments is true.')
param participantPrincipalIds array = []

@allowed([
  'User'
  'Group'
  'ServicePrincipal'
])
@description('Principal type for participantPrincipalIds.')
param participantPrincipalType string = 'Group'

@description('Store generated connection values and keys in Key Vault. Requires permissions to set Key Vault secrets.')
param storeSecretsInKeyVault bool = false

@description('Azure AI Search index name used for workshop documents.')
param searchIndexName string = 'documents'

@description('Create a free-tier demo web app placeholder.')
param createWebApp bool = true

@description('Web app name to create. Leave empty to generate a deterministic name.')
param webAppName string = ''

@description('App Service plan name to create. Leave empty to generate a deterministic name.')
param appServicePlanName string = ''

@allowed([
  'F1'
  'B1'
])
@description('App Service plan SKU. F1 is lowest-cost/free but limited.')
param appServicePlanSku string = 'F1'

var normalizedWorkshopName = toLower(replace(replace(replace(workshopName, '-', ''), '_', ''), ' ', ''))
var shortName = length(normalizedWorkshopName) > 12 ? substring(normalizedWorkshopName, 0, 12) : normalizedWorkshopName
var suffix = substring(uniqueString(subscription().id, resourceGroup().id, workshopName), 0, 6)

var effectiveStorageAccountName = createStorageAccount
  ? (empty(storageAccountName) ? '${shortName}st${suffix}' : storageAccountName)
  : existingStorageAccountName
var effectiveKeyVaultName = createKeyVault
  ? (empty(keyVaultName) ? '${shortName}-kv-${suffix}' : keyVaultName)
  : existingKeyVaultName
var effectiveContainerRegistryName = createContainerRegistry
  ? (empty(containerRegistryName) ? '${shortName}acr${suffix}' : containerRegistryName)
  : existingContainerRegistryName
var effectiveApplicationInsightsName = createApplicationInsights
  ? (empty(applicationInsightsName) ? '${shortName}-appi-${suffix}' : applicationInsightsName)
  : existingApplicationInsightsName
var effectiveAiServicesAccountName = createAiServicesAccount
  ? (empty(aiServicesAccountName) ? '${shortName}-ai-${suffix}' : aiServicesAccountName)
  : existingAiServicesAccountName
var effectiveAiServicesProjectName = empty(aiServicesProjectName) ? '${effectiveAiServicesAccountName}-project' : aiServicesProjectName
var effectiveSearchServiceName = createSearchService
  ? (empty(searchServiceName) ? '${shortName}-search-${suffix}' : searchServiceName)
  : existingSearchServiceName
var effectiveWebAppName = empty(webAppName) ? '${shortName}-web-${suffix}' : webAppName
var effectiveAppServicePlanName = empty(appServicePlanName) ? '${shortName}-asp-${suffix}' : appServicePlanName

module storage 'modules/storage.bicep' = {
  name: 'workshop-storage'
  params: {
    createStorageAccount: createStorageAccount
    storageAccountName: effectiveStorageAccountName
    location: location
    containerNames: [
      documentContainerName
    ]
    enablePublicNetworkAccess: enablePublicNetworkAccess
    tags: tags
  }
}

module keyVault 'modules/keyvault.bicep' = {
  name: 'workshop-keyvault'
  params: {
    createKeyVault: createKeyVault
    keyVaultName: effectiveKeyVaultName
    location: location
    enablePublicNetworkAccess: enablePublicNetworkAccess
    tags: tags
  }
}

module containerRegistry 'modules/containerRegistry.bicep' = {
  name: 'workshop-acr'
  params: {
    createContainerRegistry: createContainerRegistry
    containerRegistryName: effectiveContainerRegistryName
    location: location
    enablePublicNetworkAccess: enablePublicNetworkAccess
    tags: tags
  }
}

module appInsights 'modules/appInsights.bicep' = {
  name: 'workshop-appinsights'
  params: {
    createApplicationInsights: createApplicationInsights
    applicationInsightsName: effectiveApplicationInsightsName
    location: location
    tags: tags
  }
}

module aiServices 'modules/aiServices.bicep' = {
  name: 'workshop-ai-services'
  params: {
    createAiServicesAccount: createAiServicesAccount
    accountName: effectiveAiServicesAccountName
    location: aiServicesLocation
    accountKind: aiServicesKind
    createAiServicesProject: createAiServicesProject
    projectName: effectiveAiServicesProjectName
    projectDisplayName: 'ACE AI Workshop'
    enablePublicNetworkAccess: enablePublicNetworkAccess
    deployModelDeployments: deployModelDeployments
    modelDeployments: modelDeployments
    chatDeploymentName: chatDeploymentName
    embeddingDeploymentName: embeddingDeploymentName
    tags: tags
  }
}

module search 'modules/search.bicep' = {
  name: 'workshop-search'
  params: {
    createSearchService: createSearchService
    searchServiceName: effectiveSearchServiceName
    location: location
    skuName: searchSku
    replicaCount: searchReplicaCount
    partitionCount: searchPartitionCount
    enablePublicNetworkAccess: enablePublicNetworkAccess
    tags: tags
  }
}

module webApp 'modules/webApp.bicep' = {
  name: 'workshop-webapp'
  params: {
    createWebApp: createWebApp
    appServicePlanName: effectiveAppServicePlanName
    webAppName: effectiveWebAppName
    location: location
    skuName: appServicePlanSku
    appSettings: {
      AZURE_AI_SERVICES_ENDPOINT: aiServices.outputs.endpoint
      AZURE_OPENAI_CHAT_DEPLOYMENT: chatDeploymentName
      AZURE_OPENAI_EMBEDDING_DEPLOYMENT: embeddingDeploymentName
      AZURE_SEARCH_ENDPOINT: search.outputs.searchEndpoint
      AZURE_SEARCH_INDEX: searchIndexName
      AZURE_STORAGE_CONTAINER: documentContainerName
    }
    tags: tags
  }
}

module roleAssignments 'modules/roleAssignments.bicep' = if (enableRoleAssignments) {
  name: 'workshop-role-assignments'
  params: {
    storageAccountName: storage.outputs.storageAccountName
    documentContainerName: documentContainerName
    keyVaultName: keyVault.outputs.keyVaultName
    searchServiceName: search.outputs.searchServiceName
    aiServicesAccountName: aiServices.outputs.accountName
    aiServicesProjectName: aiServices.outputs.projectName
    foundryPrincipalIds: [
      aiServices.outputs.projectPrincipalId
    ]
    searchPrincipalId: search.outputs.searchManagedIdentityPrincipalId
    participantPrincipalIds: participantPrincipalIds
    participantPrincipalType: participantPrincipalType
  }
}

module keyVaultSecrets 'modules/keyvaultSecrets.bicep' = if (storeSecretsInKeyVault) {
  name: 'workshop-keyvault-secrets'
  params: {
    keyVaultName: keyVault.outputs.keyVaultName
    storageAccountName: storage.outputs.storageAccountName
    documentContainerName: documentContainerName
    aiServicesAccountName: aiServices.outputs.accountName
    aiServicesEndpoint: aiServices.outputs.endpoint
    chatDeploymentName: aiServices.outputs.chatDeploymentName
    embeddingDeploymentName: aiServices.outputs.embeddingDeploymentName
    searchServiceName: search.outputs.searchServiceName
    searchEndpoint: search.outputs.searchEndpoint
    searchIndexName: searchIndexName
  }
}

output aiFoundryPortalUrl string = 'https://ai.azure.com'
output aiServicesAccountName string = aiServices.outputs.accountName
output aiServicesEndpoint string = aiServices.outputs.endpoint
output aiFoundryEndpoint string = aiServices.outputs.aiFoundryEndpoint
output aiServicesProjectName string = aiServices.outputs.projectName
output aiServicesProjectResourceId string = aiServices.outputs.projectId
output aiServicesProjectEndpoint string = aiServices.outputs.projectEndpoint
output aiServicesProjectPrincipalId string = aiServices.outputs.projectPrincipalId
output chatDeploymentName string = aiServices.outputs.chatDeploymentName
output embeddingDeploymentName string = aiServices.outputs.embeddingDeploymentName
output searchServiceName string = search.outputs.searchServiceName
output searchEndpoint string = search.outputs.searchEndpoint
output searchIndexName string = searchIndexName
output storageAccountName string = storage.outputs.storageAccountName
output documentContainerName string = documentContainerName
output keyVaultName string = keyVault.outputs.keyVaultName
output webAppName string = webApp.outputs.webAppName
output webAppUrl string = webApp.outputs.webAppUrl

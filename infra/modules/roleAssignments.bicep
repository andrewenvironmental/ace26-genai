@description('Storage account name.')
param storageAccountName string

@description('Workshop document container name.')
param documentContainerName string

@description('Key Vault name.')
param keyVaultName string

@description('Azure AI Search service name.')
param searchServiceName string

@description('Azure AI Services / Azure OpenAI account name.')
param aiServicesAccountName string

@description('Azure AI Foundry hub workspace name.')
param foundryHubName string

@description('Azure AI Foundry project workspace name.')
param foundryProjectName string

@description('Managed identity principal IDs for Foundry hub/project resources.')
param foundryPrincipalIds array

@description('Managed identity principal ID for Azure AI Search. Leave empty if using an existing service without a managed identity.')
param searchPrincipalId string

@description('Participant user, group, or service principal object IDs to grant workshop access.')
param participantPrincipalIds array

@allowed([
  'User'
  'Group'
  'ServicePrincipal'
])
@description('Principal type for participantPrincipalIds.')
param participantPrincipalType string

var readerRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')
var contributorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')
var azureAiUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '53ca6127-db72-4b80-b1b0-d745d6d5456d')
var cognitiveServicesOpenAiUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd')
var cognitiveServicesUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'a97b65f3-24c7-4388-baec-2e87135dc908')
var searchServiceContributorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7ca78c08-252a-4471-8644-bb5ff32d4ba0')
var searchIndexDataContributorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '8ebe5a00-799e-43f5-93ac-243d3dce84a7')
var searchIndexDataReaderRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '1407120a-92aa-4202-b7e9-c0e197c71c8f')
var storageBlobDataContributorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
var storageBlobDataReaderRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')
var keyVaultSecretsUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource searchService 'Microsoft.Search/searchServices@2025-05-01' existing = {
  name: searchServiceName
}

resource aiServicesAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = {
  name: aiServicesAccountName
}

resource foundryHub 'Microsoft.MachineLearningServices/workspaces@2025-06-01' existing = {
  name: foundryHubName
}

resource foundryProject 'Microsoft.MachineLearningServices/workspaces@2025-06-01' existing = {
  name: foundryProjectName
}

resource searchStorageContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(searchPrincipalId)) {
  name: guid(storageAccount.id, searchPrincipalId, storageBlobDataContributorRoleId, documentContainerName)
  scope: storageAccount
  properties: {
    principalId: searchPrincipalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: storageBlobDataContributorRoleId
  }
}

resource searchAiOpenAiUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(searchPrincipalId)) {
  name: guid(aiServicesAccount.id, searchPrincipalId, cognitiveServicesOpenAiUserRoleId)
  scope: aiServicesAccount
  properties: {
    principalId: searchPrincipalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: cognitiveServicesOpenAiUserRoleId
  }
}

resource foundryStorageReaders 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(storageAccount.id, principalId, storageBlobDataReaderRoleId)
  scope: storageAccount
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: storageBlobDataReaderRoleId
  }
}]

resource foundryStorageContributors 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(storageAccount.id, principalId, storageBlobDataContributorRoleId)
  scope: storageAccount
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: storageBlobDataContributorRoleId
  }
}]

resource foundrySearchReaders 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(searchService.id, principalId, readerRoleId)
  scope: searchService
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: readerRoleId
  }
}]

resource foundrySearchServiceContributors 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(searchService.id, principalId, searchServiceContributorRoleId)
  scope: searchService
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: searchServiceContributorRoleId
  }
}]

resource foundrySearchIndexContributors 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(searchService.id, principalId, searchIndexDataContributorRoleId)
  scope: searchService
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: searchIndexDataContributorRoleId
  }
}]

resource foundrySearchIndexReaders 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(searchService.id, principalId, searchIndexDataReaderRoleId)
  scope: searchService
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: searchIndexDataReaderRoleId
  }
}]

resource foundryAiOpenAiUsers 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(aiServicesAccount.id, principalId, cognitiveServicesOpenAiUserRoleId)
  scope: aiServicesAccount
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: cognitiveServicesOpenAiUserRoleId
  }
}]

resource foundryKeyVaultSecretUsers 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(keyVault.id, principalId, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsUserRoleId
  }
}]

resource foundryKeyVaultContributors 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in foundryPrincipalIds: if (!empty(principalId)) {
  name: guid(keyVault.id, principalId, contributorRoleId)
  scope: keyVault
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: contributorRoleId
  }
}]

resource participantProjectAiUsers 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in participantPrincipalIds: {
  name: guid(foundryProject.id, principalId, azureAiUserRoleId)
  scope: foundryProject
  properties: {
    principalId: principalId
    principalType: participantPrincipalType
    roleDefinitionId: azureAiUserRoleId
  }
}]

resource participantHubAiUsers 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in participantPrincipalIds: {
  name: guid(foundryHub.id, principalId, azureAiUserRoleId)
  scope: foundryHub
  properties: {
    principalId: principalId
    principalType: participantPrincipalType
    roleDefinitionId: azureAiUserRoleId
  }
}]

resource participantAiServicesUsers 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in participantPrincipalIds: {
  name: guid(aiServicesAccount.id, principalId, cognitiveServicesUserRoleId)
  scope: aiServicesAccount
  properties: {
    principalId: principalId
    principalType: participantPrincipalType
    roleDefinitionId: cognitiveServicesUserRoleId
  }
}]

resource participantSearchIndexReaders 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in participantPrincipalIds: {
  name: guid(searchService.id, principalId, searchIndexDataReaderRoleId)
  scope: searchService
  properties: {
    principalId: principalId
    principalType: participantPrincipalType
    roleDefinitionId: searchIndexDataReaderRoleId
  }
}]

output roleAssignmentCount int = (empty(searchPrincipalId) ? 0 : 2) + (length(foundryPrincipalIds) * 8) + (length(participantPrincipalIds) * 4)

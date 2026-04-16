@description('Create a dedicated Azure AI Foundry hub/project. If false, the workspace names are treated as existing.')
param createFoundryResources bool

@description('Azure AI Foundry hub workspace name.')
param hubWorkspaceName string

@description('Azure AI Foundry project workspace name.')
param projectWorkspaceName string

@description('Azure region for new workspaces.')
param location string

@description('Storage account resource ID used by a new hub workspace.')
param storageAccountId string

@description('Key Vault resource ID used by a new hub workspace.')
param keyVaultId string

@description('Container Registry resource ID used by a new hub workspace.')
param containerRegistryId string

@description('Application Insights resource ID used by a new hub workspace.')
param applicationInsightsId string

@description('Enable public network access on new workspaces.')
param enablePublicNetworkAccess bool

@description('Tags applied to new workspaces.')
param tags object

resource createdHub 'Microsoft.MachineLearningServices/workspaces@2025-06-01' = if (createFoundryResources) {
  name: hubWorkspaceName
  location: location
  kind: 'Hub'
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: union({
    friendlyName: '${hubWorkspaceName} Hub'
    description: 'Azure AI Foundry hub for the ACE AI workshop.'
    storageAccount: storageAccountId
    keyVault: keyVaultId
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
    v1LegacyMode: false
    workspaceHubConfig: {
      defaultWorkspaceResourceGroup: resourceGroup().id
    }
  }, empty(containerRegistryId) ? {} : {
    containerRegistry: containerRegistryId
  }, empty(applicationInsightsId) ? {} : {
    applicationInsights: applicationInsightsId
  })
}

resource existingHub 'Microsoft.MachineLearningServices/workspaces@2025-06-01' existing = if (!createFoundryResources) {
  name: hubWorkspaceName
}

resource createdProject 'Microsoft.MachineLearningServices/workspaces@2025-06-01' = if (createFoundryResources) {
  name: projectWorkspaceName
  location: location
  kind: 'Project'
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    friendlyName: '${projectWorkspaceName} Project'
    description: 'Azure AI Foundry project for the ACE AI workshop playground activity.'
    hubResourceId: createdHub.id
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
    v1LegacyMode: false
  }
}

resource existingProject 'Microsoft.MachineLearningServices/workspaces@2025-06-01' existing = if (!createFoundryResources) {
  name: projectWorkspaceName
}

output hubWorkspaceName string = hubWorkspaceName
output projectWorkspaceName string = projectWorkspaceName
output hubWorkspaceId string = createFoundryResources ? createdHub!.id : existingHub!.id
output projectWorkspaceId string = createFoundryResources ? createdProject!.id : existingProject!.id
output hubPrincipalId string = createFoundryResources ? createdHub!.identity.principalId : existingHub!.identity.principalId
output projectPrincipalId string = createFoundryResources ? createdProject!.identity.principalId : existingProject!.identity.principalId

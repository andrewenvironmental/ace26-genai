@description('Create the storage account. If false, storageAccountName is treated as existing.')
param createStorageAccount bool

@description('Storage account name.')
param storageAccountName string

@description('Azure region for a new storage account.')
param location string

@description('Blob containers to ensure exist.')
param containerNames array

@description('Enable public network access on a new storage account.')
param enablePublicNetworkAccess bool

@description('Tags applied to a new storage account.')
param tags object

resource createdStorage 'Microsoft.Storage/storageAccounts@2023-05-01' = if (createStorageAccount) {
  name: storageAccountName
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
  }
}

resource existingStorage 'Microsoft.Storage/storageAccounts@2023-05-01' existing = if (!createStorageAccount) {
  name: storageAccountName
}

resource createdBlobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = if (createStorageAccount) {
  parent: createdStorage
  name: 'default'
  properties: {
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
    containerDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource existingBlobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' existing = if (!createStorageAccount) {
  parent: existingStorage
  name: 'default'
}

resource createdContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [for containerName in containerNames: if (createStorageAccount) {
  parent: createdBlobService
  name: containerName
  properties: {
    publicAccess: 'None'
  }
}]

resource existingAccountContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [for containerName in containerNames: if (!createStorageAccount) {
  parent: existingBlobService
  name: containerName
  properties: {
    publicAccess: 'None'
  }
}]

output storageAccountName string = storageAccountName
output storageAccountId string = createStorageAccount ? createdStorage!.id : existingStorage!.id
output blobEndpoint string = createStorageAccount ? createdStorage!.properties.primaryEndpoints.blob : existingStorage!.properties.primaryEndpoints.blob

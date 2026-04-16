@description('Create the container registry. If false, containerRegistryName is treated as existing.')
param createContainerRegistry bool

@description('Container Registry name.')
param containerRegistryName string

@description('Azure region for a new Container Registry.')
param location string

@description('Enable public network access on a new Container Registry.')
param enablePublicNetworkAccess bool

@description('Tags applied to a new Container Registry.')
param tags object

resource createdRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = if (createContainerRegistry) {
  name: containerRegistryName
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
  }
}

resource existingRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = if (!createContainerRegistry && !empty(containerRegistryName)) {
  name: containerRegistryName
}

output containerRegistryName string = containerRegistryName
output containerRegistryId string = createContainerRegistry ? createdRegistry!.id : (!empty(containerRegistryName) ? existingRegistry!.id : '')
output loginServer string = createContainerRegistry ? createdRegistry!.properties.loginServer : (!empty(containerRegistryName) ? existingRegistry!.properties.loginServer : '')

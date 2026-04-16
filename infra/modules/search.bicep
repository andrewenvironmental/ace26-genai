@description('Create the Azure AI Search service. If false, searchServiceName is treated as existing.')
param createSearchService bool

@description('Azure AI Search service name.')
param searchServiceName string

@description('Azure region for a new search service.')
param location string

@allowed([
  'free'
  'basic'
  'standard'
  'standard2'
  'standard3'
])
@description('Azure AI Search SKU.')
param skuName string

@minValue(1)
@description('Replica count for a new search service.')
param replicaCount int

@minValue(1)
@description('Partition count for a new search service.')
param partitionCount int

@description('Enable public network access on a new search service.')
param enablePublicNetworkAccess bool

@description('Tags applied to a new search service.')
param tags object

resource createdSearch 'Microsoft.Search/searchServices@2025-05-01' = if (createSearchService) {
  name: searchServiceName
  location: location
  tags: tags
  sku: {
    name: skuName
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    replicaCount: replicaCount
    partitionCount: partitionCount
    hostingMode: 'Default'
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
    disableLocalAuth: false
    authOptions: {
      aadOrApiKey: {
        aadAuthFailureMode: 'http401WithBearerChallenge'
      }
    }
  }
}

resource existingSearch 'Microsoft.Search/searchServices@2025-05-01' existing = if (!createSearchService) {
  name: searchServiceName
}

output searchServiceName string = searchServiceName
output searchServiceId string = createSearchService ? createdSearch!.id : existingSearch!.id
output searchEndpoint string = 'https://${searchServiceName}.search.windows.net'
output searchManagedIdentityPrincipalId string = createSearchService ? createdSearch!.identity.principalId : ''

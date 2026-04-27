targetScope = 'subscription'

@description('Name of the resource group that will contain workshop resources.')
param resourceGroupName string

@description('Azure region for the workshop resource group.')
param location string

@description('Tags applied to the workshop resource group.')
param tags object = {
  workload: 'ace26-genai-workshop'
  environment: 'dev'
}

resource workshopResourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

output resourceGroupName string = workshopResourceGroup.name
output resourceGroupId string = workshopResourceGroup.id

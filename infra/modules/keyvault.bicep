@description('Create the Key Vault. If false, keyVaultName is treated as existing.')
param createKeyVault bool

@description('Key Vault name.')
param keyVaultName string

@description('Azure region for a new Key Vault.')
param location string

@description('Enable public network access on a new Key Vault.')
param enablePublicNetworkAccess bool

@description('Tags applied to a new Key Vault.')
param tags object

resource createdKeyVault 'Microsoft.KeyVault/vaults@2023-07-01' = if (createKeyVault) {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    publicNetworkAccess: enablePublicNetworkAccess ? 'Enabled' : 'Disabled'
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: []
  }
}

resource existingKeyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = if (!createKeyVault) {
  name: keyVaultName
}

output keyVaultName string = keyVaultName
output keyVaultId string = createKeyVault ? createdKeyVault!.id : existingKeyVault!.id
output vaultUri string = createKeyVault ? createdKeyVault!.properties.vaultUri : existingKeyVault!.properties.vaultUri

@description('Create a demo web app for the workshop.')
param createWebApp bool

@description('App Service plan name.')
param appServicePlanName string

@description('Web app name.')
param webAppName string

@description('Azure region for the web app.')
param location string

@description('App Service plan SKU name.')
param skuName string

@description('App settings for the web app.')
param appSettings object

@description('Tags applied to web resources.')
param tags object

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = if (createWebApp) {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: skuName
  }
  properties: {
    reserved: false
  }
}

resource app 'Microsoft.Web/sites@2023-12-01' = if (createWebApp) {
  name: webAppName
  location: location
  tags: tags
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [for settingName in items(appSettings): {
        name: settingName.key
        value: string(settingName.value)
      }]
    }
  }
}

output appServicePlanName string = createWebApp ? plan.name : ''
output webAppName string = createWebApp ? app.name : ''
output webAppUrl string = createWebApp ? 'https://${app.properties.defaultHostName}' : ''
output webAppPrincipalId string = createWebApp ? app.identity.principalId : ''

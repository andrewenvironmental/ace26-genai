@description('Create the Application Insights component. If false, applicationInsightsName is treated as existing.')
param createApplicationInsights bool

@description('Application Insights component name.')
param applicationInsightsName string

@description('Azure region for a new Application Insights component.')
param location string

@description('Tags applied to a new Application Insights component.')
param tags object

resource createdAppInsights 'Microsoft.Insights/components@2020-02-02' = if (createApplicationInsights) {
  name: applicationInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource existingAppInsights 'Microsoft.Insights/components@2020-02-02' existing = if (!createApplicationInsights && !empty(applicationInsightsName)) {
  name: applicationInsightsName
}

output applicationInsightsName string = applicationInsightsName
output applicationInsightsId string = createApplicationInsights ? createdAppInsights!.id : (!empty(applicationInsightsName) ? existingAppInsights!.id : '')
output instrumentationKey string = createApplicationInsights ? createdAppInsights!.properties.InstrumentationKey : (!empty(applicationInsightsName) ? existingAppInsights!.properties.InstrumentationKey : '')

targetScope = 'subscription'

@description('Monthly budget name.')
param budgetName string = 'ace26-genai-workshop-monthly-budget'

@description('Monthly budget amount in USD.')
param amount int = 100

@description('Email addresses to notify when budget thresholds are crossed.')
param contactEmails array

@description('Resource group name to filter the budget to.')
param resourceGroupName string

@description('Budget start date. Defaults to the first day of the current UTC month.')
param startDate string = '${utcNow('yyyy-MM')}-01T00:00:00Z'

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = {
  name: budgetName
  properties: {
    category: 'Cost'
    amount: amount
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: startDate
    }
    filter: {
      dimensions: {
        name: 'ResourceGroupName'
        operator: 'In'
        values: [
          resourceGroupName
        ]
      }
    }
    notifications: {
      actual80: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        contactEmails: contactEmails
      }
      actual100: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        contactEmails: contactEmails
      }
    }
  }
}

output budgetName string = budget.name

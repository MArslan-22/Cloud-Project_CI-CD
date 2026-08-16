output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "The name of the resource group."
}

output "storage_account_name" {
  value       = azurerm_storage_account.storage.name
  description = "The generated unique name of the storage account."
}

output "static_website_url" {
  value       = azurerm_storage_account.storage.primary_web_endpoint
  description = "The web endpoint URL of the static website in Azure Storage."
}

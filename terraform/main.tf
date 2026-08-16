terraform {
  required_version = ">= 1.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-cloud-projects-cicd"
  location = "eastus"
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}

resource "azurerm_storage_account" "storage" {
  name                     = "stcloudcicd${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }

  tags = {
    environment = "testing"
    project     = "cloud-projects-cicd"
  }
}

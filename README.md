# Cloud Projects - GitHub CI/CD Pipeline Showcase

A production-ready CI/CD (Continuous Integration and Continuous Deployment) pipeline scaffolded inside a modern React (Vite) + TypeScript application. This project features a built-in **interactive pipeline simulator** as a visual front-end dashboard, deploying seamlessly to **GitHub Pages** using GitHub Actions.

## Pipeline Architecture

The workflow below illustrates the automatic triggers and steps defined for both the CI (Pull Request validation) and CD (Deploying to Main) pipelines.

```mermaid
graph TD
    Developer([Developer]) -->|Push / Pull Request| GitHub[GitHub Repository]
    
    subgraph CI_Pipeline [CI Workflow - Pull Request / Branch Push]
        PR_Trigger[PR to main / Push to branch] --> CI_Runner[ubuntu-latest runner]
        CI_Runner --> Checkout_CI[Checkout Code]
        Checkout_CI --> Setup_Node_CI[Set up Node.js v20]
        Setup_Node_CI --> Install_CI[npm ci]
        Install_CI --> Format_CI[Prettier Check]
        Format_CI --> Lint_CI[ESLint Lint]
        Lint_CI --> Test_CI[Vitest Unit Tests]
        Test_CI --> Build_CI[Vite Production Build]
        Build_CI --> Complete_CI([CI Status: Success])
    end
    
    subgraph CD_Pipeline [CD Workflow - Push to Main]
        Push_Trigger[Push/Merge to main] --> CD_Runner[ubuntu-latest runner]
        CD_Runner --> Checkout_CD[Checkout Code]
        Checkout_CD --> Setup_Node_CD[Set up Node.js v20]
        Setup_Node_CD --> Install_CD[npm ci]
        Install_CD --> Verify_CD[Format, Lint & Test]
        Verify_CD --> Build_CD[Vite Production Build]
        Build_CD --> Deploy_CD[Deploy to GitHub Pages]
        Deploy_CD --> Complete_CD([Site Updated Live])
    end
    
    GitHub --> CI_Pipeline
    GitHub --> CD_Pipeline
```

---

## Project Structure

The project has the following directory structure:

```text
Cloud Projects/
├── .github/
│   └── workflows/
│       ├── ci.yml            # CI validation workflow (lint, test, compile)
│       └── cd.yml            # CD deployment workflow (verification + Azure deployment)
├── src/
│   ├── test/
│   │   └── setup.ts          # Vitest testing environment setup & scroll mock
│   ├── App.tsx               # Main Dashboard application (Pipeline Simulator)
│   ├── App.test.tsx          # Vitest Unit Tests
│   ├── index.css             # Vanilla CSS Custom Design System
│   ├── main.tsx              # React bootstrap script
│   └── vite-env.d.ts         # TypeScript environment declarations
├── terraform/                # Infrastructure as Code (Azure)
│   ├── main.tf               # Storage account & resource group definitions
│   └── outputs.tf            # Exports web URLs and account properties
├── .gitignore                # Node.js specific ignore file
├── .prettierrc               # Prettier format rules
├── eslint.config.js          # ESLint flat config file
├── index.html                # Main entry HTML template
├── package.json              # Script directives & dependencies
├── tsconfig.json             # TS compiler configuration
└── vite.config.ts            # Vite & Vitest configuration
```

---

## Pipeline Workflow Details

### 1. Continuous Integration (CI) — `ci.yml`
* **Trigger**: Triggers on pull requests to the `main` branch or pushes to feature branches.
* **Environment**: Runs on `ubuntu-latest`.
* **Steps**:
  1. **Checkout**: Checks out the repository files.
  2. **Set up Node.js**: Installs Node v22.
  3. **Install Dependencies**: Runs `npm install`.
  4. **Lint code (ESLint)**: Runs `npm run lint`.
  5. **Unit Testing**: Runs Vitest test suites.
  6. **Build**: Compiles code using `tsc` and Vite.

### 2. Continuous Deployment (CD) — `cd.yml`
* **Trigger**: Triggers on merges or direct pushes to `main`.
* **Environment**: Runs on `ubuntu-latest`.
* **Steps**:
  * Inherits all verification checks (install, lint, test, build).
  * **Azure Authentication**: Logs in using `azure/login` with your SP credential secret.
  * **Azure Storage Sync**: Uses `azure/CLI` to synchronize the compiled `/dist` directory to the `$web` storage container.

---

## Local Development & Installation

Ensure you have [Node.js (v18+)](https://nodejs.org) installed.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server**:
   ```bash
   npm run dev
   ```

3. **Run Linting**:
   ```bash
   npm run lint
   ```

4. **Run Unit Tests**:
   ```bash
   npm run test
   ```

---

## Step-by-Step Azure & GitHub Setup Instructions

### Step 1: Provision Azure Resources via Terraform
Configure the cloud hosting infrastructure:
```bash
cd terraform
terraform init
terraform apply -auto-approve
```
*This outputs the storage account name and the primary website URL.*

### Step 2: Generate Service Principal for GitHub Actions
Run this command in your Azure-authenticated local terminal:
```bash
az ad sp create-for-rbac --name "sp-cloud-projects-cicd" --role contributor --scopes /subscriptions/0bd0cf91-5292-40df-b65c-5b4c9c745317/resourceGroups/rg-cloud-projects-cicd --sdk-auth
```
1. Copy the JSON output block.
2. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
3. Create a new repository secret named **`AZURE_CREDENTIALS`** and paste the JSON block as the secret value.

### Step 3: Trigger the Pipeline
Push your changes to the main branch:
```bash
git add .
git commit -m "feat: setup azure static web hosting deployment pipeline"
git push origin main
```
*GitHub Actions will build, test, and deploy the application automatically to the Azure Storage web endpoint!*

---

## Teardown (Infrastructure Deletion)

To completely delete the Azure resources and guarantee zero ongoing cost, run:
```bash
az group delete --name rg-cloud-projects-cicd --yes --no-wait
```


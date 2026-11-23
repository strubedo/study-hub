// Domain 3 — Deploy and manage Azure compute resources. Original questions modelled on Microsoft's published item
// formats (study guide wording, exam sandbox item types, practice assessment style); no recalled exam content.
// Facts checked against Microsoft Learn on 2026-11-23. Command output and portal text in exhibits are
// documentation-based (not captured from a subscription) and are listed in REVIEW-TODO.md.
// ARM JSON exhibits were validated with python3 json; Bicep exhibits were checked by hand (not compiled).
// Ids are generated from array order: append topics 3.3 and 3.4 after the 3.2 block.
const L311 = '3.1-arm-templates';
const L312 = '3.1-bicep-files';
const L313 = '3.1-modify-templates';
const L314 = '3.1-deploy-templates';
const L315 = '3.1-export-convert';
const L321 = '3.2-create-vm';
const L322 = '3.2-disk-encryption';
const L323 = '3.2-move-vms';
const L324 = '3.2-vm-sizes';
const L325 = '3.2-vm-disks';
const L326 = '3.2-availability';
const L327 = '3.2-scale-sets';
const L331 = '3.3-container-registry';
const L332 = '3.3-container-instances';
const L333 = '3.3-container-apps';
const L334 = '3.3-container-scaling';
const L341 = '3.4-app-service-plans';
const L342 = '3.4-create-web-app';
const L343 = '3.4-certificates-tls';
const L344 = '3.4-custom-domains';
const L345 = '3.4-backup';
const L346 = '3.4-networking';
const L347 = '3.4-deployment-slots';

const bank = [
  // 3.1 ARM templates and Bicep
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L311,
    stem: 'Refer to the exhibit. You deploy the template to rg-web-prod by running: az deployment group create -g rg-web-prod --template-file st.json --parameters count=4. What is the name of the last storage account the deployment creates?',
    exhibit: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "prefix": { "type": "string", "defaultValue": "stcontoso", "maxLength": 11 },
    "count": { "type": "int", "defaultValue": 2, "minValue": 1, "maxValue": 5 }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[concat(parameters('prefix'), string(copyIndex(1)))]",
      "location": "[resourceGroup().location]",
      "sku": { "name": "Standard_LRS" },
      "kind": "StorageV2",
      "copy": { "name": "stLoop", "count": "[parameters('count')]" }
    }
  ]
}`,
    answer: ['stcontoso4'],
    explanation: "The `copy` element runs `count` times, and `count=4` is inside the allowed range of 1 to 5. `copyIndex(1)` starts at 1 instead of 0 (`string()` turns the integer into text for `concat`), so the iterations produce `stcontoso1`, `stcontoso2`, `stcontoso3` and **`stcontoso4`**. Without the offset the names would run from `stcontoso0` to `stcontoso3`. The prefix comes from its default value because only `count` was passed." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L314,
    stem: 'Refer to the exhibit. You run the deployment with the current version of the Azure CLI. Which resources does rg-app-prod contain when the deployment finishes?',
    exhibit: `Resource group rg-app-prod (East US), no locks
  Name             Type
  vnet-app         Microsoft.Network/virtualNetworks
  nsg-app          Microsoft.Network/networkSecurityGroups
  stcontosoapp01   Microsoft.Storage/storageAccounts
  pip-app-01       Microsoft.Network/publicIPAddresses

Template app.json declares:
  vnet-app         Microsoft.Network/virtualNetworks
  nsg-app          Microsoft.Network/networkSecurityGroups
  stcontosoapp01   Microsoft.Storage/storageAccounts
                   "condition": "[parameters('deployStorage')]"

Command:
  az deployment group create -g rg-app-prod --template-file app.json \\
    --parameters deployStorage=false --mode Complete`,
    options: ['vnet-app and nsg-app only', 'vnet-app, nsg-app and stcontosoapp01', 'vnet-app, nsg-app and pip-app-01', 'All four resources, because a false condition stops complete mode from deleting anything'],
    answer: [0],
    explanation: "In **complete mode** Resource Manager deletes resources in the group that the template doesn't deploy. **pip-app-01** isn't in the template, so it is deleted. **stcontosoapp01** is in the template but its condition is false; with REST API version 2019-05-10 or later (current CLI and PowerShell), a resource skipped by a false condition is also deleted in complete mode. Only **vnet-app** and **nsg-app** remain. In incremental mode all four would remain. A lock on the group would have prevented the deletions, but there is none. Run what-if before any complete-mode deployment." },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L312,
    stem: 'Refer to the exhibit. Which two statements about deploying main.bicep to a resource group are true? (Choose two.)',
    exhibit: `@secure()
param adminPassword string

@minLength(3)
@maxLength(11)
param prefix string

param location string = resourceGroup().location

var storageName = '\${prefix}\${uniqueString(resourceGroup().id)}'

resource vnet 'Microsoft.Network/virtualNetworks@2025-01-01' = {
  name: 'vnet-app'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.20.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'snet-app'
        properties: {
          addressPrefix: '10.20.1.0/24'
        }
      }
    ]
  }
}

resource nic 'Microsoft.Network/networkInterfaces@2025-01-01' = {
  name: 'nic-app-01'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          subnet: {
            id: vnet.properties.subnets[0].id
          }
        }
      }
    ]
  }
}

output storageName string = storageName`,
    options: ['Resource Manager creates nic-app-01 after vnet-app finishes, without an explicit dependsOn', 'Values for adminPassword and prefix must be supplied at deployment time', 'The adminPassword value appears in the deployment history inputs', 'The deployment creates a storage account named from the storageName variable', "A prefix value of 'st' is accepted", 'The location parameter must be supplied at deployment time'],
    answer: [0, 1],
    explanation: "The NIC references `vnet.properties.subnets[0].id`, a symbolic reference, so Bicep adds an **implicit dependency** and the NIC waits for the VNet. **adminPassword** and **prefix** have no default value, so they must be supplied (the CLI prompts for missing values). `@secure()` keeps adminPassword out of logs and history. `storageName` is only a variable and an output: no `resource` declares a storage account. `'st'` has two characters and fails `@minLength(3)`. `location` has a default of the resource group's location." },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: L313,
    stem: 'Refer to the exhibit. Deployments must be limited to Standard_LRS or Standard_ZRS, and any other value must fail validation before anything is deployed. Which line should you add directly above the param declaration?',
    exhibit: `// main.bicep (excerpt)
param skuName string = 'Standard_LRS'

resource st 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  name: 'stcontosodata01'
  location: resourceGroup().location
  sku: {
    name: skuName
  }
  kind: 'StorageV2'
}`,
    options: ["@allowed([ 'Standard_LRS', 'Standard_ZRS' ])", "@metadata({ allowed: [ 'Standard_LRS', 'Standard_ZRS' ] })", "@description('Standard_LRS or Standard_ZRS')", '@minLength(12)'],
    answer: [0],
    explanation: "**`@allowed([...])`** compiles to `allowedValues` in the ARM template, and Resource Manager rejects any other value during validation, before deployment starts. (The multi-line array form with one value per line is equivalent.) `@metadata` and `@description` only add information; they don't restrict values. `@minLength(12)` checks only the length, so any string of 12 or more characters, such as Standard_GRS, would pass." },
  { topic: '3.1', type: 'order', difficulty: 2, lesson: L314,
    stem: 'You must deploy main.bicep to a new resource group named rg-web-prod and confirm, before anything is created, exactly which resources the file will create or change. Place the steps in the correct order.',
    items: ['Run az group create -n rg-web-prod -l eastus', 'Run az deployment group what-if -g rg-web-prod --template-file main.bicep --parameters environment=prod', 'Review the Create and Modify changes that what-if predicts', 'Run az deployment group create -g rg-web-prod -n deploy-web --template-file main.bicep --parameters environment=prod', 'Run az deployment group show -g rg-web-prod -n deploy-web --query properties.provisioningState'],
    explanation: "A resource group deployment needs an existing **resource group**, so create it first. **What-if** then compares the file with the (empty) group and predicts the changes without deploying; **review** them. Only then run the real **deployment**, naming it so you can find it, and finally check its **provisioning state** in the deployment history. `--confirm-with-what-if` on `az deployment group create` combines the middle three steps into one command with a prompt." },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L314,
    stem: 'Match each deployment requirement to the Azure CLI command that deploys it.',
    pairs: [
      ['A Bicep file that creates the resource groups rg-web-prod and rg-data-prod in the Contoso-Prod subscription', 'az deployment sub create'],
      ['A template that adds a subnet to vnet-hub in rg-net-prod', 'az deployment group create'],
      ['A template that assigns a policy to the management group mg-contoso so that it applies to every subscription below it', 'az deployment mg create'],
      ['A template that creates a new management group under the tenant root group', 'az deployment tenant create'],
    ],
    explanation: "Resource groups are subscription-level resources, so a template that creates them deploys at **subscription** scope (`az deployment sub create -l <location>`, Bicep `targetScope = 'subscription'`). Resources inside a group use **group** scope. A policy assignment at a management group needs **mg** scope (`-m mg-contoso`). Management groups themselves are created at **tenant** scope. Every scope except the resource group needs `--location` for the deployment metadata." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L311,
    stem: 'Refer to the exhibit. Deployments of this template fail intermittently with an error that the subnet referenced by nic-app-01 can\'t be found. What should you change?',
    exhibit: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2025-01-01",
      "name": "vnet-app",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": { "addressPrefixes": [ "10.30.0.0/16" ] },
        "subnets": [ { "name": "snet-app", "properties": { "addressPrefix": "10.30.1.0/24" } } ]
      }
    },
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2025-01-01",
      "name": "nic-app-01",
      "location": "[resourceGroup().location]",
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
              "subnet": { "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', 'vnet-app', 'snet-app')]" }
            }
          }
        ]
      }
    }
  ]
}`,
    options: ["Add \"dependsOn\": [ \"[resourceId('Microsoft.Network/virtualNetworks', 'vnet-app')]\" ] to the nic-app-01 resource", "Add \"dependsOn\": [ \"[resourceId('Microsoft.Network/networkInterfaces', 'nic-app-01')]\" ] to the vnet-app resource", 'Deploy the template with --mode Complete', "Replace resourceId() with concat('vnet-app/snet-app') in the subnet id"],
    answer: [0],
    explanation: "Resource Manager deploys resources in parallel unless it knows about a dependency. `resourceId()` only builds an ID string; it doesn't create a dependency, so the NIC sometimes starts before the VNet and its subnet exist. Adding **dependsOn** on the NIC pointing to the VNet fixes the order. A dependsOn on the VNet pointing to the NIC reverses the order and still fails. Deployment mode affects deletions, not ordering. `concat('vnet-app/snet-app')` isn't a resource ID, so the reference would be invalid." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L311,
    stem: 'Refer to the exhibit. The template is deployed with --parameters environment=Dev. What value does the appName variable evaluate to?',
    exhibit: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "company": { "type": "string", "defaultValue": "Contoso" },
    "workload": { "type": "string", "defaultValue": "Web" },
    "environment": { "type": "string", "defaultValue": "Prod", "allowedValues": [ "Dev", "Prod" ] }
  },
  "variables": {
    "appName": "[toLower(concat(parameters('company'), '-', parameters('workload'), '-', parameters('environment')))]"
  },
  "resources": [],
  "outputs": {
    "appName": { "type": "string", "value": "[variables('appName')]" }
  }
}`,
    answer: ['contoso-web-dev'],
    explanation: "Work from the inside out. `company` and `workload` use their defaults, `Contoso` and `Web`; `environment` is the passed value `Dev` (allowed). `concat` joins them with hyphens into `Contoso-Web-Dev`, and `toLower` converts the whole string to **contoso-web-dev**. Without the parameter, the default `Prod` would give contoso-web-prod." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L315,
    stem: 'The VMs in rg-erp-prod were deployed from an ARM template in January. Since then, administrators have added data disks and NSG rules in the portal. You need a template that reproduces the current configuration of three of the VMs and their NICs. What should you do?',
    options: ['Select the three VMs and their NICs in rg-erp-prod and use Export template', 'Download the January deployment template from the resource group\'s Deployments blade', 'Run az bicep build on the January template', 'Run az deployment group export for the January deployment'],
    answer: [0],
    explanation: "Exporting **from the resource group** (or selected resources) generates a template from the resources' **current state**, including changes made in the portal after deployment, and lets you choose which resources to include. The deployment history (portal Deployments blade or `az deployment group export`) returns the exact January template, without the later disks and rules, and always includes every resource of that deployment. `az bicep build` compiles Bicep to JSON; it doesn't read Azure at all." },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L315,
    stem: 'Which two statements about exporting templates are true? (Choose two.)',
    options: ['A template saved from deployment history is an exact copy of the deployed template, including its parameters', 'Exporting a resource group that contains more than 200 resources fails', 'A template exported from a resource group always includes the VM admin passwords as secureString default values', 'Saving from deployment history can produce a Bicep file directly', 'A template saved from deployment history includes changes made in the portal after the deployment', 'Export from a resource group works only for resources that were originally deployed with a template'],
    answer: [0, 1],
    explanation: "**Save from history** returns the exact template the author deployed, with its parameters. Exporting a group is limited to **200 resources** (\"Export template is not supported for resource groups more than 200 resources\"). Exported templates can **miss** password parameters; you add them yourself. History export supports ARM JSON only; decompile it afterwards for Bicep. History reflects the deployment time, not later manual changes. Export from a resource group works for resources created by any method." },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: L315,
    stem: 'You have an ARM template file named webapp.json that your team deploys every week. You need a Bicep file with the same resources so that future changes are made in Bicep. Which command should you run?',
    options: ['az bicep decompile --file webapp.json', 'az bicep build --file webapp.json', 'az group export --name rg-web-prod --export-format bicep', 'az deployment group export --name webapp --export-format bicep'],
    answer: [0],
    explanation: "**`az bicep decompile`** converts ARM JSON to a `.bicep` file (here `webapp.bicep`). Decompilation is best-effort: review the output, fix warnings and rename symbolic names. `az bicep build` goes the other way, Bicep to JSON. `az group export --export-format bicep` generates Bicep from the deployed resources' current state, not from your file, and produces verbose, mostly hard-coded code. `az deployment group export` has no Bicep output option; history export is JSON only." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L312,
    stem: 'Refer to the exhibit. What does the deployment of this Bicep file create?',
    exhibit: `param prefix string = 'stcontosologs'

resource logs 'Microsoft.Storage/storageAccounts@2025-06-01' = [for i in range(1, 3): {
  name: '\${prefix}0\${i}'
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}]`,
    options: ['Three storage accounts: stcontosologs01, stcontosologs02 and stcontosologs03', 'Two storage accounts: stcontosologs01 and stcontosologs02', 'Three storage accounts: stcontosologs00, stcontosologs01 and stcontosologs02', 'One storage account named stcontosologs03'],
    answer: [0],
    explanation: "`range(startIndex, count)` returns **count** integers beginning at startIndex, so `range(1, 3)` is `[1, 2, 3]`, not 1 to 2 and not 0 to 2. Each iteration interpolates the prefix, a literal `0` and the number: **stcontosologs01**, **02** and **03** (15 characters, lowercase, valid storage names)." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L313,
    stem: 'Refer to the exhibit. The command fails with the error shown. According to the Azure CLI documentation for Bicep parameters files, which parameter must you remove from the command so that the deployment succeeds? Enter the parameter name.',
    exhibit: `$ cat main.prod.bicepparam
using 'main.bicep'

param environment = 'prod'
param vmCount = 3

$ az deployment group create -g rg-web-prod \\
    --template-file main.bicep \\
    --parameters main.prod.bicepparam
ERROR: Only a .bicep file is allowed with a .bicepparam file`,
    answer: ['--template-file', 'template-file', '-f'],
    explanation: "A `.bicepparam` file names its Bicep file in the **`using`** statement, so the Azure CLI takes it through `--parameters` alone. Learn states that including **`--template-file`** with a Bicep parameters file produces this error. Remove it: `az deployment group create -g rg-web-prod --parameters main.prod.bicepparam`. A JSON parameters file, by contrast, does need `--template-file`. (Azure PowerShell is different: Learn's examples pass `-TemplateFile` together with `-TemplateParameterFile main.prod.bicepparam`.)" },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L314,
    stem: 'Refer to the exhibit. rg-web-prod already contains the public IP address pip-web-01, created by an earlier deployment of this file with deployPublicIp=true. You now deploy the file with the command shown. What happens to pip-web-01?',
    exhibit: `// web.bicep (excerpt)
param deployPublicIp bool = false

resource pip 'Microsoft.Network/publicIPAddresses@2025-01-01' = if (deployPublicIp) {
  name: 'pip-web-01'
  location: resourceGroup().location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

// Command
az deployment group create -g rg-web-prod --template-file web.bicep`,
    options: ['It remains unchanged', 'It is deleted because the condition is false', 'The deployment fails because a conditional resource already exists', 'It is converted to a Basic SKU dynamic address'],
    answer: [0],
    explanation: "No parameter is passed, so `deployPublicIp` is false and the resource is **skipped**. The command uses the default **incremental** mode, which never deletes resources that the deployment doesn't touch, so pip-web-01 **remains as it is**. It would be deleted only in complete mode (`--mode Complete`). A skipped resource isn't an error, and nothing in the file changes the SKU (Basic public IPs were retired in September 2025 anyway)." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L313,
    stem: 'Refer to the exhibit. You need to add an output that returns the primary blob endpoint of the storage account. Which value should the output use?',
    exhibit: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "saName": "[concat('stcontoso', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[variables('saName')]",
      "location": "[resourceGroup().location]",
      "sku": { "name": "Standard_LRS" },
      "kind": "StorageV2"
    }
  ],
  "outputs": {
    "blobEndpoint": { "type": "string", "value": "<expression>" }
  }
}`,
    options: ["[reference(resourceId('Microsoft.Storage/storageAccounts', variables('saName'))).primaryEndpoints.blob]", "[resourceId('Microsoft.Storage/storageAccounts', variables('saName')).primaryEndpoints.blob]", "[variables('saName').primaryEndpoints.blob]", "[reference(variables('saName')).properties.primaryEndpoints.blob]"],
    answer: [0],
    explanation: "**`reference()`** reads the runtime state of the deployed account and, by default, returns its **properties** object, so `.primaryEndpoints.blob` is the right path. `resourceId()` returns only an ID string, which has no properties. The variable is just the account name. `reference(...).properties...` would need the `'Full'` argument; without it the returned object already is the properties, so `.properties` doesn't exist and the expression fails." },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L314,
    stem: 'Match each requirement to the Azure Resource Manager feature that meets it.',
    pairs: [
      ['Before running a change in production, list which resources will be created, modified or deleted, without deploying anything', 'What-if operation'],
      ['Publish a versioned template as an Azure resource that other teams can deploy if they have read access to it', 'Template spec'],
      ['Manage a set of resources as one unit, delete resources removed from the file, and block changes to them made outside the deployment', 'Deployment stack'],
      ['Make a resource group hold only the resources defined in the template by setting one option on the deployment command', 'Complete deployment mode'],
      ['Redeploy the exact template and parameters that were used for a deployment last month', 'Save the template from deployment history'],
    ],
    explanation: "**What-if** previews changes. **Template specs** store templates as versioned, RBAC-controlled resources. **Deployment stacks** manage resources as a group with `actionOnUnmanage` (detach or delete) and deny settings; Learn recommends them over complete mode for deletions. **Complete mode** (`--mode Complete`) deletes resources not in the template. The **deployment history** keeps the exact template and parameters of each deployment." },

  // 3.2 Virtual machines
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L321,
    stem: 'Refer to the exhibit. vnet-hub and its subnet snet-web already exist in rg-web-prod. Which three resources does the command create? (Choose three.)',
    exhibit: `az vm create \\
  --resource-group rg-web-prod \\
  --name vm-web-01 \\
  --image Ubuntu2204 \\
  --size Standard_D2s_v5 \\
  --vnet-name vnet-hub --subnet snet-web \\
  --public-ip-address "" \\
  --nsg "" \\
  --admin-username azureuser \\
  --ssh-key-values ~/.ssh/id_rsa.pub`,
    options: ['The virtual machine vm-web-01', 'A network interface for vm-web-01', 'A managed OS disk', 'A Standard SKU public IP address', 'A network security group with an SSH rule', 'A new virtual network'],
    answer: [0, 1, 2],
    explanation: "Every VM needs a **NIC** and an **OS disk**, so `az vm create` creates both along with the **VM**. `--public-ip-address \"\"` tells it not to create a public IP, and `--nsg \"\"` not to create an NSG (by default it would create an NSG allowing SSH for Linux). The named VNet and subnet exist, so no new VNet is created." },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L321,
    stem: 'Refer to the exhibit. vm-web-01 runs Ubuntu, has no public IP address and no inbound rules. You need to run the command shown inside the VM without opening any port. Enter the value that replaces <command-id>.',
    exhibit: `az vm run-command invoke \\
  --resource-group rg-web-prod \\
  --name vm-web-01 \\
  --command-id <command-id> \\
  --scripts "systemctl status nginx"`,
    answer: ['RunShellScript'],
    explanation: "**Run Command** executes scripts through the Azure VM agent, so it needs no network path to the VM. The built-in command ID for Linux shell scripts is **RunShellScript**; Windows uses **RunPowerShellScript**. The equivalent PowerShell cmdlet is `Invoke-AzVMRunCommand -CommandId RunShellScript -ScriptString '...'`." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L322,
    stem: 'Contoso is deploying new Linux and Windows VMs. Security requires that temporary disks, OS and data disk caches, and data flowing to storage are encrypted, without using VM CPU, and the solution must follow Microsoft\'s current recommendation. What should you use?',
    options: ['Encryption at host', 'Azure Disk Encryption with a key encryption key', 'Server-side encryption with customer-managed keys only', 'BitLocker and DM-Crypt configured manually inside each VM'],
    answer: [0],
    explanation: "**Encryption at host** encrypts temp disks, ephemeral OS disks and disk caches at the VM host, with data flowing encrypted to storage, and doesn't use the VM's CPU. Microsoft Learn names it as the replacement for **Azure Disk Encryption**, which is scheduled for retirement on **September 15, 2028** and runs BitLocker or DM-Crypt inside the guest (using its CPU). Server-side encryption, with platform or customer-managed keys, encrypts data at rest in storage but not temp disks or caches. Manual in-guest encryption isn't managed by Azure and also uses guest CPU." },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L322,
    stem: 'You plan to enable Azure Disk Encryption on vm-app-01 in East US, in the Contoso-Prod subscription. Which two requirements must the key vault meet? (Choose two.)',
    options: ['It must be in the same region and subscription as vm-app-01', 'Its access policy setting for Azure Disk Encryption for volume encryption (enabledForDiskEncryption) must be enabled', 'It must use the Premium SKU', 'It must be in a different region from the VM for disaster recovery', 'It must store a certificate that the VM uses to authenticate to Microsoft Entra ID', 'It must have public network access disabled'],
    answer: [0, 1],
    explanation: "Learn requires the key vault to be in the **same region and subscription** as the VM, so encryption secrets don't cross regional boundaries, and to be **enabled for disk encryption** (`az keyvault create|update --enabled-for-disk-encryption`, `-EnabledForDiskEncryption`). Either SKU works (HSM-protected keys are optional). The current ADE release doesn't need an Entra app or certificate; that was the previous release. The VM needs to reach Key Vault, so public access isn't required to be disabled." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L322,
    stem: 'Refer to the exhibit. On which VM can you enable Azure Disk Encryption?',
    exhibit: `Name        Size              vCPUs  Memory (GiB)  OS
vm-ops-01   Standard_B1s      1      1             Ubuntu 22.04
vm-ops-02   Standard_A2_v2    2      4             Windows Server 2022
vm-ops-03   Standard_D2s_v6   2      8             Windows Server 2022
vm-ops-04   Standard_D2s_v5   2      8             Windows Server 2022`,
    options: ['vm-ops-04', 'vm-ops-01', 'vm-ops-02', 'vm-ops-03'],
    answer: [0],
    explanation: "Learn states ADE isn't available on **Basic, A-series, v6, v7 or newer** series, or on VMs with **less than 2 GB of memory**. vm-ops-01 has 1 GiB, vm-ops-02 is A-series and vm-ops-03 is a v6 size, which leaves **vm-ops-04** (Dsv5, 8 GiB). For new deployments Microsoft recommends encryption at host instead, because ADE retires on September 15, 2028." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L323,
    stem: 'Refer to the exhibit. You need to move vm-app-01 and its dependent resources to the Contoso-Dev subscription in the same Microsoft Entra tenant. What must you do first?',
    exhibit: `Subscription: Contoso-Prod     Resource group: rg-app-prod (East US)
Name                Type                     Notes
vm-app-01           Virtual machine          Windows Server 2022, running
                                             Azure Disk Encryption: enabled (OS and data volumes)
vm-app-01_OsDisk    Disk                     Premium SSD
vm-app-01-data01    Disk                     Premium SSD
nic-app-01          Network interface
vnet-app            Virtual network          used only by nic-app-01
kv-contoso-prod     Key vault                rg-security-prod, East US`,
    options: ['Disable encryption on vm-app-01', 'Move kv-contoso-prod to the Contoso-Dev subscription', 'Deallocate vm-app-01 and keep encryption enabled', 'Nothing; the VM, disks, NIC and VNet can be moved as they are'],
    answer: [0],
    explanation: "Learn's VM move guidance: a VM using **Azure Disk Encryption** can be moved to another **resource group** when it is deallocated, but to move it to another **subscription** you must **disable encryption** first (`az vm encryption disable --volume-type all` or `Disable-AzVMDiskEncryption`). The key vault doesn't need to move, and deallocation alone is enough only for a resource group move. After the move, the VM, disks, NIC and VNet travel together because they are in one group." },
  { topic: '3.2', type: 'order', difficulty: 3, lesson: L323,
    stem: 'You need to move vm-sql-01 from East US to West US 2 by using Azure Resource Mover. Place the steps in the correct order.',
    items: ['Select vm-sql-01 in Resource Mover and choose East US as source and West US 2 as target', 'Validate dependencies and add the dependent resources that Resource Mover reports', 'Prepare, initiate and commit the move of the source resource group', 'Prepare vm-sql-01 and its remaining dependent resources', 'Initiate the move to create the VM in West US 2', 'Commit the move', 'Delete the source resources in East US'],
    explanation: "Resource Mover first needs the resources and regions, then **validates dependencies** (NIC, VNet, NSG, public IP...). The **source resource group** must be moved (prepared, initiated, committed) so a target group exists before the VM can be prepared. **Prepare** starts VM replication; **initiate move** creates the replica in the target region and shuts down the source VM; **commit** completes the move (discard would roll back); finally the resources in *Delete source pending* state are **deleted** in the source region." },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L323,
    stem: 'You move vm-web-01, its disks and its NIC from rg-web-old to rg-web-prod in the same subscription. Which two statements are true? (Choose two.)',
    options: ['The resource ID of vm-web-01 changes', 'vm-web-01 stays in the same Azure region', 'vm-web-01 must be deallocated before it can be moved', 'Role assignments made directly on vm-web-01 move with it', 'vm-web-01 restarts during the move', 'vm-web-01 could be moved on its own even if it were in an availability set'],
    answer: [0, 1],
    explanation: "A resource move changes the **resource ID** (it contains the resource group) and **never changes the region**. The VM keeps running with no restart; deallocation is needed only in special cases such as ADE. Role assignments on the moved resource don't move; they are orphaned and must be re-created. VMs in an availability set can't be moved individually." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L324,
    stem: 'Refer to the exhibit. vm-app-01 is running and isn\'t in an availability set. You need to resize it to Standard_E8s_v5. What should you do?',
    exhibit: `$ az vm show -g rg-app-prod -n vm-app-01 --query hardwareProfile.vmSize -o tsv
Standard_D2s_v5
$ az vm list-vm-resize-options -g rg-app-prod -n vm-app-01 --query "[].name" -o tsv
Standard_D2s_v5
Standard_D4s_v5
Standard_D8s_v5
Standard_D16s_v5
$ az vm list-sizes -l eastus --query "[?name=='Standard_E8s_v5'].name" -o tsv
Standard_E8s_v5`,
    options: ['Deallocate vm-app-01, resize it to Standard_E8s_v5, then start it', 'Run az vm resize --size Standard_E8s_v5 while the VM is running', 'Redeploy vm-app-01 to a new host, then resize it while it is running', 'Delete vm-app-01 and re-create it from its OS disk with the new size'],
    answer: [0],
    explanation: "The size exists in the region but isn't in **list-vm-resize-options**, which shows only sizes available on the hardware cluster currently hosting the VM. **Deallocating** releases the host, so the VM can be placed on any cluster in the region that offers E8s_v5; then resize and start it. Resizing while running would fail for this size. Redeploy moves the VM but doesn't guarantee a cluster with the E family. Re-creating the VM works but is more effort than needed." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L324,
    stem: 'Refer to the exhibit. A new VM must use an AMD processor, support Premium SSD disks and include a local temporary disk for scratch data. Which size meets the requirements?',
    exhibit: `Candidate sizes (East US)
  Standard_D4as_v5
  Standard_D4ads_v5
  Standard_D4ds_v5
  Standard_D4a_v4`,
    options: ['Standard_D4ads_v5', 'Standard_D4as_v5', 'Standard_D4ds_v5', 'Standard_D4a_v4'],
    answer: [0],
    explanation: "Decode the additive feature letters: **a** = AMD, **d** = local temporary disk, **s** = Premium SSD capable. Only **D4ads_v5** has all three. D4as_v5 has no temp disk, D4ds_v5 is Intel (no a), and D4a_v4 has AMD and a temp disk in that older series but no **s**, so it can't use Premium SSD (Learn's Dav4-series page: \"To use Premium SSD, use the Dasv4 sizes\")." },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: L324,
    stem: 'Refer to the exhibit. An administrator shut down vm-test-01 from inside Windows on Friday evening to save money over the weekend. What is the billing situation, and what should be done next time?',
    exhibit: `$ az vm get-instance-view -g rg-test -n vm-test-01 --query "instanceView.statuses[1].displayStatus" -o tsv
VM stopped`,
    options: ['Compute charges continue; stop the VM from the Azure portal or run az vm deallocate', 'No charges at all; shutting down from the OS is enough', 'Compute charges stop, but the disks are deleted; take a snapshot first', 'Compute charges continue; run az vm stop instead'],
    answer: [0],
    explanation: "A VM shut down from the guest OS is **Stopped** (allocated): the host stays reserved and **compute is still billed**. Deallocate it from Azure (portal **Stop**, `az vm deallocate`, or `Stop-AzVM` without `-StayProvisioned`) to reach **Stopped (deallocated)**, which has no compute charge. `az vm stop` also leaves the VM allocated and billed. Disks are never deleted by stopping, and they are billed in every state." },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L325,
    stem: 'Match each disk requirement to the managed disk type that meets it at the lowest cost.',
    pairs: [
      ['Data disk for a SAP HANA log volume that needs 300,000 IOPS with sub-millisecond latency', 'Ultra Disk'],
      ['OS disk for a production database VM that needs single-digit millisecond latency and the highest single-VM SLA', 'Premium SSD'],
      ['Data disk for a SQL Server VM in zone 2; IOPS and throughput must be adjustable at any time without fixed size tiers, up to 60,000 IOPS', 'Premium SSD v2'],
      ['OS disk for a lightly used development web server that should use SSD media', 'Standard SSD'],
      ['Data disk that stores weekly backup files read only during restores', 'Standard HDD'],
    ],
    explanation: "Only **Ultra Disk** reaches 300,000 IOPS (up to 400,000; Premium SSD v2 tops out at 80,000). Ultra Disk and Premium SSD v2 can't be OS disks, so a production OS disk uses **Premium SSD**, which also gives the 99.9% single-VM SLA when every disk is premium. **Premium SSD v2** sets IOPS and throughput independently of size, has no fixed tiers, and needs a zonal VM in most zone-enabled regions. **Standard SSD** is the low-cost SSD for dev/test. **Standard HDD** is cheapest for infrequent, latency-tolerant access." },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L325,
    stem: 'Refer to the exhibit. vm-db-01 must stay running. Which disk can you expand to the target size without deallocating the VM?',
    exhibit: `VM: vm-db-01 (running)
Disk              Role       Type          Current size  Target size  Shared (maxShares)
vm-db-01_OsDisk   OS         Premium SSD   128 GiB       256 GiB      1
disk-db-data01    Data LUN0  Premium SSD   1,024 GiB     2,048 GiB    1
disk-db-data02    Data LUN1  Standard SSD  2,048 GiB     8,192 GiB    1
disk-db-quorum    Data LUN2  Premium SSD   256 GiB       512 GiB      2`,
    options: ['disk-db-data01', 'vm-db-01_OsDisk', 'disk-db-data02', 'disk-db-quorum'],
    answer: [0],
    explanation: "Expanding without downtime applies to **data disks** only, so the OS disk needs deallocation. A Standard HDD, Standard SSD or Premium SSD of 4 TiB or less must be deallocated and detached to grow **beyond 4 TiB**, which rules out disk-db-data02 (2 TiB to 8 TiB). **Shared disks** (maxShares > 1) can't be expanded online. **disk-db-data01** stays under 4 TiB and can grow while the VM runs; then extend the volume in the OS." },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L326,
    stem: 'Refer to the exhibit. During planned platform maintenance on avail-web, what is the maximum number of the VMs that can be rebooted at the same time? Enter a number.',
    exhibit: `Availability set: avail-web (East US)
  Fault domains: 2
  Update domains: 5
VMs (created in this order, all running):
  vm-web-01 ... vm-web-12`,
    answer: ['3'],
    explanation: "VMs are placed in update domains round-robin: vm-web-01 to 05 in UD 0 to 4, 06 to 10 in UD 0 to 4 again, and 11 and 12 in UD 0 and 1. UD 0 and UD 1 hold **3** VMs each; the others hold 2. Planned maintenance reboots **one update domain at a time**, so at most 3 VMs are down together (12 / 5 rounded up). The fault domain count matters for unplanned hardware failures (with an even spread, 6 VMs per FD here; Learn documents the round-robin order for update domains only)." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L326,
    stem: 'Refer to the exhibit. The application must qualify for a 99.99% VM connectivity SLA. Which layout should you use?',
    exhibit: `Layout  Description
A       One VM, Premium SSD OS and data disks
B       Two VMs in availability set avail-app (2 fault domains, 5 update domains)
C       Two VMs, both in availability zone 1 of East US 2
D       Two VMs, one in availability zone 1 and one in zone 2 of East US 2`,
    options: ['Layout D', 'Layout A', 'Layout B', 'Layout C'],
    answer: [0],
    explanation: "Microsoft's VM SLA gives **99.99%** to two or more VMs deployed **across two or more availability zones** in a region: layout **D**. Two or more VMs in an availability set get 99.95% (layout B). A single VM with premium disks everywhere gets 99.9% (layout A). Two VMs in the **same** zone (layout C) aren't spread across zones, so they don't qualify for the zone SLA." },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L327,
    stem: 'Refer to the exhibit. At 14:00 the scale set has 4 instances and the metrics shown have held for the last 15 minutes. No scale action has run for an hour. What does autoscale do?',
    exhibit: `Autoscale setting: autoscale-web (target: vmss-web)
Profile: Default    Instance limits: minimum 2, maximum 10, default 2
Rules (all: time grain 1 min, statistic Average, duration 10 min, cool down 5 min)
  1  Percentage CPU     > 75            Increase count by 1
  2  Percentage CPU     < 25            Decrease count by 1
  3  Network In Total   > 600,000,000   Increase count by 1
  4  Network In Total   < 100,000,000   Decrease count by 1

Observed (average over the last 10 minutes)
  Percentage CPU     20
  Network In Total   300,000,000`,
    options: ['Nothing; the instance count stays at 4', 'It scales in to 3 instances', 'It scales in to 2 instances', 'It scales out to 5 instances'],
    answer: [0],
    explanation: "Neither scale-out rule is met (CPU 20 isn't > 75; 300,000,000 isn't > 600,000,000). Autoscale scales **in only when all scale-in rules are met**: rule 2 is met (20 < 25) but rule 4 isn't (300,000,000 isn't < 100,000,000), so **no action** is taken. Scale-out, by contrast, happens when any one scale-out rule is met." },
  { topic: '3.2', type: 'fill', difficulty: 3, lesson: L327,
    stem: 'Refer to the exhibit. Both scale-out rules are met at the same evaluation. How many instances will the scale set have after the scale action? Enter a number.',
    exhibit: `Autoscale setting for vmss-api
Instance limits: minimum 2, maximum 10, default 3
Current instance count: 4
Scale-out rules
  A  Percentage CPU > 70 (average, 10 min)          Increase count by 2   cool down 5 min
  B  Network In Total > 500,000,000 (average, 10 min) Increase count by 3   cool down 5 min
Scale-in rule
  C  Percentage CPU < 30 (average, 10 min)          Decrease count by 1   cool down 5 min`,
    answer: ['7'],
    explanation: "When more than one scale-out rule triggers, Learn says autoscale calculates the new capacity for each and scales to the **highest** one to protect availability. Rule A gives 4 + 2 = 6 and rule B gives 4 + 3 = **7**. The rules aren't added together (that would be 9), and 7 is within the maximum of 10." },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L327,
    stem: 'Refer to the exhibit. Which two statements about vmss-web are true? (Choose two.)',
    exhibit: `az vmss create -g rg-web-prod -n vmss-web \\
  --orchestration-mode Flexible \\
  --image Ubuntu2204 --vm-sku Standard_D2s_v5 \\
  --instance-count 6 --zones 1 2 3 \\
  --scale-in-policy NewestVM \\
  --upgrade-policy-mode Manual \\
  --vnet-name vnet-hub --subnet snet-web \\
  --admin-username azureuser --generate-ssh-keys`,
    options: ['When the set scales in, it keeps the zones balanced and removes the newest VM', 'The scale set can grow to 1,000 VMs', 'The orchestration mode can later be changed to Uniform', 'Instances automatically get default outbound internet access', 'Each zone contains five update domains', 'The instances qualify for the 99.99% SLA only if they are all placed in zone 1'],
    answer: [0, 1],
    explanation: "With **NewestVM**, scale-in first removes VMs from over-populated zones to keep balance, then deletes the newest VM. A scale set built on a Marketplace image holds up to **1,000** VMs. The orchestration mode is fixed at creation. Flexible scale sets have **no default outbound access**; add a NAT gateway, load balancer outbound rule or public IPs. Update domains are deprecated for Flexible orchestration (maintenance goes fault domain by fault domain). The 99.99% SLA needs instances spread **across** zones, which this set already does." },
  // 3.3 Containers
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L332,
    stem: 'Refer to the exhibit. You deploy the file with az container create -g rg-aci-prod -f ci-orders.yaml. How many CPU cores does Azure Container Instances allocate to the container group? Enter a number.',
    exhibit: `apiVersion: '2021-10-01'
location: eastus
name: ci-orders
properties:
  osType: Linux
  restartPolicy: Always
  containers:
  - name: orders-api
    properties:
      image: crcontosoprod.azurecr.io/orders/api:2.4
      ports:
      - port: 80
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 2.0
  - name: log-shipper
    properties:
      image: crcontosoprod.azurecr.io/tools/log-shipper:1.1
      resources:
        requests:
          cpu: 0.5
          memoryInGB: 0.5
        limits:
          cpu: 1.0
          memoryInGB: 1.0
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 80
type: Microsoft.ContainerInstance/containerGroups`,
    answer: ['1.5', '1.5 cores', '1.5 cpu', '1.5 vcpu'],
    explanation: "ACI allocates a multi-container group the **sum of the resource requests** of its containers: 1.0 + 0.5 = **1.5 CPU** (and 2.5 GB of memory). The `limits` on log-shipper don't add capacity: they only let that container use up to 1.0 CPU of what the group already has when orders-api isn't using it. The group also meets the 1 CPU / 1 GB minimum for a group." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L332,
    stem: 'Refer to the exhibit. The script in the container finishes its work after about four minutes and exits with exit code 0. What happens next?',
    exhibit: `az container create -g rg-aci-prod -n ci-report-nightly \\
  --image crcontosoprod.azurecr.io/jobs/report:1.0 \\
  --os-type Linux --cpu 1 --memory 1.5 \\
  --restart-policy OnFailure \\
  --acr-identity <identity-resource-id> --assign-identity <identity-resource-id>`,
    options: [
      'The container stops, its state becomes Terminated, and compute charges for the group stop',
      'ACI restarts the container immediately because the container group still exists',
      'ACI restarts the container once more and then stops it permanently',
      'ACI deletes the container group automatically after the container exits',
    ],
    answer: [0],
    explanation: "With **OnFailure**, ACI restarts containers only when the process exits with a **non-zero** code. A clean exit (code 0) leaves the container **Terminated**, and because ACI bills per second while the group runs, charges for the compute stop. The output is still available with `az container logs`. Restarting regardless of exit code is the **Always** policy (the default). There's no \"one more restart\" behaviour, and ACI never deletes a group on its own; you delete it (or redeploy it) yourself." },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L334,
    stem: 'You plan changes to a running Azure Container Instances container group named ci-web-01. Which two changes require you to delete the container group and create it again? (Choose two.)',
    options: [
      'Increase the memory of a container from 1.5 GB to 3 GB',
      'Change the restart policy from Always to OnFailure',
      'Change the image tag from 1.0 to 1.1',
      'Change the value of an environment variable',
      'Change the DNS name label',
    ],
    answer: [0, 1],
    explanation: "Learn lists the properties that can't be updated in place: **OS type, CPU, memory or GPU resources, restart policy**, network profile (retired from API 2021-07-01) and **availability zone**. Changing them means deleting the group and creating it again (which pulls the image fresh and can change the IP). The **image tag**, **environment variables** and the **DNS name label** can be updated by redeploying the group with the same name (`az container create` again); the containers restart in place. ACI has no in-place vertical or horizontal scaling." },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: L332,
    stem: 'Refer to the exhibit. You must deploy the container group without storing any registry password. What should you do?',
    exhibit: `Registry: crcontosoprod (Standard), role assignment permissions mode: RBAC Registry Permissions,
admin user: disabled, public network access: enabled

az container create -g rg-aci-prod -n ci-api-01 \\
  --image crcontosoprod.azurecr.io/api/orders:2.1 \\
  --os-type Linux --cpu 1 --memory 2 --ports 80 \\
  --assign-identity [system] --acr-identity [system]

Result: the deployment fails because the image can't be pulled.`,
    options: [
      'Create a user-assigned managed identity, grant it AcrPull on crcontosoprod, and pass its resource ID to --assign-identity and --acr-identity',
      'Grant the container group\'s system-assigned identity the AcrPush role on crcontosoprod and run the same command again',
      'Enable the admin user on crcontosoprod and keep the --acr-identity [system] parameter',
      'Upgrade crcontosoprod to the Premium SKU so that managed identity pulls are supported',
    ],
    answer: [0],
    explanation: "Learn states that ACI **doesn't support system-assigned managed identities for image pulls from ACR**; you must use a **user-assigned** identity with **AcrPull** (pull permission) on the registry, specified as the group's identity and as the registry identity. AcrPush adds push rights (more than needed) and still doesn't fix the system-assigned limitation. The admin user is a stored password, which the requirement forbids. Managed identity pulls don't need Premium; Premium matters for private endpoints. (AcrPull applies because the registry uses the RBAC Registry Permissions mode; an ABAC-enabled registry would need Container Registry Repository Reader instead.)" },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L331,
    stem: 'The registry crcontosoprod uses the RBAC Registry Permissions role assignment mode (the Azure CLI default). Match each requirement to the authentication method that meets it with the least privilege and no shared credentials.',
    pairs: [
      ['A container app must pull images without any stored password', 'Managed identity assigned the AcrPull role'],
      ['A build server in an on-premises lab, outside Azure, must push images unattended', 'Microsoft Entra service principal assigned the AcrPush role'],
      ['Field gateways that have no Microsoft Entra identity must pull only the sensors/agent repository', 'Token associated with a scope map'],
      ['A developer pushes test images interactively from a workstation', 'az acr login with the developer\'s own Entra account holding AcrPush'],
    ],
    explanation: "Azure services that support managed identities (Container Apps, ACI, App Service, AKS) should pull with a **managed identity** holding **AcrPull**. Unattended systems outside Azure use a **service principal** with the role they need (AcrPush to push). Devices without Entra identities that need access to one repository use a **token** bound to a **scope map** (`content/read` on `sensors/agent`), available in every SKU. People use their **own identities** with `az acr login`. The admin user fits none of these: it's one shared account with full push and pull rights. In a registry switched to the ABAC-enabled mode, AcrPull and AcrPush aren't honored and the Container Registry Repository roles take their place, which is why the stem states the mode." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L331,
    stem: 'Refer to the exhibit. Which Azure Container Registry configuration meets the requirements?',
    exhibit: `Requirements for the Contoso image registry
- Developers in East US and in West Europe pull from a registry endpoint in their own region.
- Pulls from virtual machines in vnet-hub must use a private IP address.
- Images must be pushed once, to one registry name.
- Minimize cost.`,
    options: [
      'One Premium registry with a geo-replica in West Europe and a private endpoint in vnet-hub',
      'One Standard registry with a private endpoint in vnet-hub and a geo-replica in West Europe',
      'Two Basic registries, one per region, kept in sync with az acr import',
      'One Standard registry with anonymous pull access enabled',
    ],
    answer: [0],
    explanation: "**Geo-replication** (one registry name served from several regions) and **private endpoints** are both **Premium-only** features, so Premium is the cheapest SKU that meets the requirements. Standard supports neither. Two Basic registries break the \"push once, one registry name\" requirement and can't have private endpoints. Anonymous pull opens the registry to unauthenticated pulls and gives neither regional endpoints nor private IPs." },
  { topic: '3.3', type: 'single', difficulty: 1, lesson: L331,
    stem: 'You work in Azure Cloud Shell. You need to copy the public image docker.io/library/nginx:latest into the registry crcontosoprod with the least administrative effort. What should you do?',
    options: [
      'Run az acr import -n crcontosoprod --source docker.io/library/nginx:latest -t base/nginx:latest',
      'Run docker pull, docker tag and docker push in Cloud Shell after az acr login',
      'Create an ACR task with a base image update trigger for nginx',
      'Enable anonymous pull access on crcontosoprod',
    ],
    answer: [0],
    explanation: "**az acr import** copies an image registry-to-registry inside Azure: no Docker engine and no local pull or push. Cloud Shell has the Docker CLI but **no Docker daemon**, so `docker pull` and `docker push` (and a plain `az acr login`) fail there. A base-image-update task rebuilds your own images when a base changes; it doesn't copy an image by itself. Anonymous pull lets others pull from your registry; it doesn't bring images in." },
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L333,
    stem: 'The container app ca-orders runs revision ca-orders--v1 in single revision mode. You need a blue-green release of version 2 in which v1 keeps serving users until v2 has been tested, and then traffic moves gradually. Place the actions in order.',
    items: [
      'Run az containerapp revision set-mode --mode multiple',
      'Run az containerapp ingress traffic set --revision-weight ca-orders--v1=100',
      'Run az containerapp update with the v2 image and --revision-suffix v2',
      'Test ca-orders--v2 through its revision URL or a label while it receives 0% of production traffic',
      'Run az containerapp ingress traffic set --revision-weight ca-orders--v1=80 ca-orders--v2=20',
      'Set the weights to send 100% of traffic to ca-orders--v2',
      'Deactivate ca-orders--v1 with az containerapp revision deactivate',
    ],
    explanation: "Switch to **multiple revision mode first**: in single mode, deploying v2 would deactivate v1 as soon as v2 is ready, which isn't blue-green. Next **pin 100% of traffic to v1 by name**: by default an app with ingress sends all traffic to the *latest* deployed revision, and changing the revision mode doesn't rewrite the traffic rules, so without this rule v2 would take all traffic as soon as it's ready (Learn's blue-green article pins the blue revision to 100% in the same way before deploying green). Then create the v2 revision (an image change is revision-scope, so a new revision appears), test it through its own URL while it gets 0% of production traffic, shift a share with weights that total 100, move all traffic, and only then deactivate v1. Keeping v1 active until the end is what makes an instant rollback possible." },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L334,
    stem: 'Refer to the exhibit. During a sale, ca-web receives a sustained load of about 400 concurrent HTTP requests. How many replicas of the revision will run? Enter a number.',
    exhibit: `$ az containerapp show -g rg-aca-prod -n ca-web --query properties.template.scale
{
  "maxReplicas": 5,
  "minReplicas": 0,
  "rules": [
    {
      "name": "http-rule",
      "http": {
        "metadata": {
          "concurrentRequests": "50"
        }
      }
    }
  ]
}`,
    answer: ['5'],
    explanation: "The HTTP rule targets **50 concurrent requests per replica**, so 400 requests would need ceil(400 / 50) = 8 replicas, but Container Apps never exceeds **maxReplicas**, which is **5**. To handle the load, raise `--max-replicas` (up to 1,000) or give each replica more capacity. `minReplicas: 0` only matters when traffic stops: the revision can then scale to zero." },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L333,
    stem: 'Refer to the exhibit. Which two statements about ca-billing are true? (Choose two.)',
    exhibit: `az containerapp create -g rg-aca-prod -n ca-billing \\
  --environment cae-contoso-prod \\
  --image crcontosoprod.azurecr.io/billing/api:3.2 \\
  --registry-server crcontosoprod.azurecr.io --registry-identity system \\
  --ingress internal --target-port 8080 \\
  --min-replicas 0 --max-replicas 10 \\
  --revisions-mode multiple \\
  --secrets db-pass=<password> \\
  --env-vars DB_PASSWORD=secretref:db-pass`,
    options: [
      'The app\'s FQDN is directly reachable only from within the Container Apps environment',
      'The app can scale to zero replicas when it receives no requests',
      'Changing the value of the db-pass secret creates a new revision',
      'Each update to the image deactivates the previous revision automatically',
      'The container receives the literal text secretref:db-pass in DB_PASSWORD',
    ],
    answer: [0, 1],
    explanation: "With **internal** ingress the app's FQDN (which contains `.internal.`) is directly reachable only from other apps in the same Container Apps environment; requests from outside get a 404 from the environment proxy (Learn notes one exception: an environment-level HTTP route that targets the app). With `--min-replicas 0` and ingress enabled, the default HTTP scaling lets the revision **scale to zero** when idle. Secrets are **application-scope**: changing a secret doesn't create a revision (restart the revisions to pick up the new value). In **multiple** revision mode, old revisions stay active until you deactivate them; automatic deactivation is single mode. `secretref:` tells Container Apps to inject the secret's value, not the literal text." },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L334,
    stem: 'Match each Contoso workload to the Azure service that meets its requirements with the least administrative effort. Use each service once.',
    pairs: [
      ['A 10-minute file-conversion container that runs once a night and exits; no orchestration needed', 'Azure Container Instances'],
      ['An HTTP API that must scale to zero overnight and split traffic 90/10 between two versions', 'Azure Container Apps'],
      ['A platform team needs the Kubernetes API, custom operators and control of node pools', 'Azure Kubernetes Service'],
      ['A web app deployed as code that needs a staging slot and a swap into production', 'Azure App Service'],
    ],
    explanation: "**ACI** runs a single container group with a restart policy such as OnFailure and bills per second, ideal for a short run-to-completion task. **Container Apps** provides KEDA-based scaling to zero and revision traffic splitting without managing Kubernetes. **AKS** is the only option exposing the Kubernetes API and node pools, at the cost of operating the cluster. **App Service** has **deployment slots** and swaps; Container Apps uses revisions instead of slots." },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: L333,
    stem: 'Refer to the exhibit. You run: az containerapp update -g rg-aca-prod -n ca-orders --image crcontosoprod.azurecr.io/orders/api:3.0 --revision-suffix v3. Which statement describes the result?',
    exhibit: `$ az containerapp show -g rg-aca-prod -n ca-orders --query "properties.configuration.{mode:activeRevisionsMode, traffic:ingress.traffic}"
{
  "mode": "Multiple",
  "traffic": [
    { "revisionName": "ca-orders--v1", "weight": 80 },
    { "revisionName": "ca-orders--v2", "weight": 20 }
  ]
}`,
    options: [
      'Revision ca-orders--v3 is created and active but receives no traffic until you change the traffic weights',
      'Revision ca-orders--v3 receives 100% of the traffic and ca-orders--v1 and ca-orders--v2 are deactivated',
      'Revision ca-orders--v3 replaces ca-orders--v2 and receives its 20% share',
      'The command fails because multiple revision mode requires az containerapp revision copy',
    ],
    answer: [0],
    explanation: "An image change is a **revision-scope** change, so **ca-orders--v3** is created. In **multiple** revision mode, existing revisions stay active and traffic follows the configured **traffic rules**. These rules name v1 and v2 explicitly (there's no `latestRevision` rule), so v3 gets **0%** until you run `az containerapp ingress traffic set` (Learn's \"update existing revision\" scenario relies on this: the known good revision keeps its weight while the new one is tested on its own endpoint). Automatic cut-over and deactivation happen only in single mode. `az containerapp update` works in both modes; `revision copy` is just another way to create a revision." },
  // 3.4 App Service
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L341,
    stem: 'Refer to the exhibit. app-shop needs a staging slot that can be swapped into production, and must scale out automatically when CPU percentage is high. app-blog can move with app-shop. You need to meet the requirement at the lowest cost. What should you do?',
    exhibit: `App Service plans in rg-web-prod (East US)
Plan         OS       Tier / size   Instances   Apps
asp-web-01   Linux    Basic B1      2           app-shop, app-blog
asp-web-02   Windows  Standard S1   1           app-api`,
    options: [
      'Scale asp-web-01 up to Standard S1 and configure rule-based autoscale',
      'Scale asp-web-01 out to 3 instances',
      'Scale asp-web-01 up to Basic B3 and configure rule-based autoscale',
      'Move app-shop to asp-web-02',
    ],
    answer: [0],
    explanation: "**Deployment slots** and **rule-based autoscale** (on metrics such as CPU percentage) both start at the **Standard** tier, so scaling the plan **up** to S1 is the lowest tier that meets the requirement; app-blog moves with it because it shares the plan. Scaling **out** a Basic plan adds instances but no slots or autoscale. B3 is a bigger Basic size, and no Basic size offers autoscale or slots. app-shop can't move to asp-web-02: an app can move only to a plan in the same resource group, region **and OS** (and the same internal deployment unit, or webspace), and asp-web-02 is Windows." },
  { topic: '3.4', type: 'fill', difficulty: 1, lesson: L341,
    stem: 'Refer to the exhibit. On how many VM instances does app-api run? Enter a number.',
    exhibit: `$ az appservice plan show -g rg-web-prod -n asp-web-prod --query "{sku:sku.name, workers:sku.capacity, perSiteScaling:perSiteScaling, linux:reserved}"
{
  "sku": "S1",
  "workers": 3,
  "perSiteScaling": false,
  "linux": true
}

$ az webapp list -g rg-web-prod --query "[?ends_with(serverFarmId, '/asp-web-prod')].name" -o tsv
app-web
app-api
app-admin`,
    answer: ['3'],
    explanation: "Without **per-app scaling**, every app in an App Service plan runs on **all** of the plan's instances, so app-api runs on all **3** S1 instances (as do app-web and app-admin). The apps share the CPU and memory of those instances. Per-app scaling (`perSiteScaling: true`) would let you limit an app to a subset of the plan's instances; the plan would still be billed for 3." },
  { topic: '3.4', type: 'match', difficulty: 2, lesson: L341,
    stem: 'Match each App Service requirement to the scaling approach that meets it.',
    pairs: [
      ['Add instances when average CPU exceeds 70%, and run two extra instances every weekday from 08:00', 'Rule-based autoscale on a Standard or higher plan'],
      ['Scale on incoming HTTP load with prewarmed instances and a per-app maximum, without writing rules', 'Automatic scaling on a Premium v2, v3 or v4 plan'],
      ['Each instance needs twice the memory it has today', 'Scale up to a larger instance size'],
      ['A Basic plan must always run exactly three instances', 'Manual scale out'],
    ],
    explanation: "**Rule-based autoscale** (Azure Monitor autoscale, Standard and up) supports metric rules and schedules. **Automatic scaling** (Premium v2–v4) is HTTP-driven with Maximum burst, Always ready and prewarmed instances, and per-app maximums, but no rules or schedules. More memory **per instance** is vertical: **scale up** to a bigger size or tier. A fixed instance count on Basic is **manual scale out** (Basic allows up to 3 instances and no autoscale)." },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L344,
    stem: 'Refer to the exhibit. You add www.contoso.com to app-contoso-web in the Add custom domain dialog. Validation fails for the TXT record. What should you do?',
    exhibit: `Public DNS zone contoso.com
Name    Type    Value
@       A       198.51.100.20     (existing web server)
www     CNAME   app-contoso-web.azurewebsites.net
asuid   TXT     <custom-domain-verification-id>`,
    options: [
      'Create a TXT record named asuid.www with the custom domain verification ID',
      'Replace the www CNAME record with an A record that points to the app\'s inbound IP address',
      'Change the @ A record to the app\'s inbound IP address',
      'Scale the App Service plan up to Standard and validate again',
    ],
    answer: [0],
    explanation: "For a subdomain, App Service looks for the verification TXT record at **asuid.<subdomain>**, so `www.contoso.com` needs **asuid.www**. The existing `asuid` record verifies only the apex `contoso.com`. The CNAME to `<app>.azurewebsites.net` is the recommended mapping for a subdomain; switching to an A record doesn't fix the TXT check. The apex A record belongs to another server and is unrelated. Custom domains don't need Standard (any paid tier works; Basic for TLS)." },
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L344,
    stem: 'Refer to the exhibit. You are mapping the root domain contoso.com to app-contoso-web. What host name must the TXT record use?',
    exhibit: `Add custom domain: contoso.com (root domain)
Domain validation: create these records with your DNS provider

Record type   Host    Value
A             @       203.0.113.40
TXT           ???     <custom-domain-verification-id>`,
    answer: ['asuid'],
    explanation: "For the **apex** (root) domain, the verification record is a TXT record named **asuid** (that is, `asuid.contoso.com`) whose value is the app's **custom domain verification ID**. For a subdomain it would be `asuid.<subdomain>`, such as `asuid.www`. The A record maps the apex to the app's inbound IP; a CNAME can't be used at the zone apex." },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L343,
    stem: 'app-contoso-saas runs in a Standard S1 plan and serves customer sites such as fabrikam.contoso.com and tailwind.contoso.com. You need one certificate that covers every current and future subdomain of contoso.com. What should you do?',
    options: [
      'Buy a wildcard App Service certificate for *.contoso.com, import it into the app and create SNI bindings',
      'Create an App Service managed certificate for *.contoso.com',
      'Upload a public certificate (.cer) for *.contoso.com',
      'Enable client certificates in Required mode',
    ],
    answer: [0],
    explanation: "One certificate for all subdomains means a **wildcard** certificate. An **App Service certificate** can be bought as a wildcard, is stored in Key Vault, renews and can be imported into the app (a wildcard from another CA via Key Vault or PFX upload works too). The **free managed certificate doesn't support wildcards**. Public (.cer) certificates are only for app code calling other resources; they can't secure a custom domain. Client certificates authenticate clients and do nothing for the server certificate." },
  { topic: '3.4', type: 'multi', difficulty: 2, lesson: L343,
    stem: 'You need to make sure that HTTP requests to app-contoso-web are redirected to HTTPS and that clients able to use only TLS 1.1 are refused. Which two commands should you run? (Choose two.)',
    options: [
      'az webapp update -g rg-web-prod -n app-contoso-web --https-only true',
      'az webapp config set -g rg-web-prod -n app-contoso-web --min-tls-version 1.2',
      'az webapp config ssl bind -g rg-web-prod -n app-contoso-web --certificate-thumbprint <thumbprint> --ssl-type IP',
      'az webapp update -g rg-web-prod -n app-contoso-web --set clientCertEnabled=true',
      'az webapp config set -g rg-web-prod -n app-contoso-web --ftps-state FtpsOnly',
    ],
    answer: [0, 1],
    explanation: "**HTTPS Only** (`--https-only true`) redirects HTTP requests to HTTPS. The **minimum inbound TLS version** (`--min-tls-version 1.2`) refuses TLS 1.0 and 1.1 handshakes; 1.2 is the default for new apps, but an older app may have been set lower, and Learn announces the retirement of inbound TLS 1.0/1.1 on May 31, 2027. An IP-based binding changes how the certificate is bound, not the protocol versions. Client certificates add mutual TLS authentication. The FTPS state affects FTP deployment, not web traffic." },
  { topic: '3.4', type: 'single', difficulty: 3, lesson: L343,
    stem: 'Refer to the exhibit. Legacy payment terminals that don\'t support Server Name Indication (SNI) must connect to api.contoso.com over HTTPS. What should you do?',
    exhibit: `App: app-contoso-api   Plan: asp-api-prod (Basic B2, Linux)
Custom domain: api.contoso.com   DNS: A record -> 203.0.113.55 (shared inbound IP)
Certificate: www-api-contoso (PFX uploaded, valid)
Current binding: SNI SSL`,
    options: [
      'Scale asp-api-prod up to Standard, change the binding to IP based SSL, and update the A record to the new dedicated IP address',
      'Keep the Basic plan and change the binding to IP based SSL',
      'Replace the uploaded certificate with an App Service managed certificate',
      'Add a second SNI SSL binding that uses the same certificate',
    ],
    answer: [0],
    explanation: "Clients without SNI need an **IP-based SSL** binding, which gives the app a dedicated inbound IP address, and IP-based SSL requires **Standard or higher**. After the binding is created, the app's inbound IP for that host name changes, so the **A record must be remapped** to the new address. Basic supports SNI bindings only. A managed certificate is still bound with SNI or IP SSL; changing the certificate doesn't help clients that can't send SNI. More SNI bindings don't help either." },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L345,
    stem: 'Refer to the exhibit. The custom backup of app-contoso-shop fails. You need a successful scheduled backup of the app content with the least administrative effort, while keeping the database protected. What should you do?',
    exhibit: `App: app-contoso-shop   Plan: Standard S2 (Windows)
Content under %HOME%: 7.2 GB
Connection strings: ShopDb (SQLAzure) -> database sqldb-shop, 5.1 GB
Custom backup: storage account stcontosobackup01, container webbackups
               Include database: ShopDb (configured in 2025)   Schedule: every 24 hours
Last backup status: Failed`,
    options: [
      'Remove ShopDb from the custom backup configuration and rely on Azure SQL Database\'s native backups for sqldb-shop',
      'Scale the plan up to Premium v3 to raise the custom backup size limit',
      'Disable the custom backup and rely on automatic backups, which include linked databases',
      'Add the database name to a _backup.filter file in site\\wwwroot',
    ],
    answer: [0],
    explanation: "A custom backup can hold **10 GB** in total, of which at most **4 GB** can be the linked database; the 5.1 GB database (and the 12.3 GB total) makes the backup fail. Removing the database leaves 7.2 GB of content, within the limit, and Azure SQL Database already has native automated backups. Learn also announces that linked-database backups are being deprecated: the option to include Azure SQL databases in new configurations was removed in April 2026 (this one predates that), and no linked databases are backed up after March 31, 2028. The limits don't grow with the tier. **Automatic backups never include databases**. `_backup.filter` excludes files and folders under `%HOME%`, not databases." },
  { topic: '3.4', type: 'match', difficulty: 3, lesson: L346,
    stem: 'Refer to the exhibit. Match each request to the result.',
    exhibit: `app-contoso-web > Networking
Public network access: Enabled from select virtual networks and IP addresses

Main site rules
Priority  Name        Action  Source
100       office      Allow   203.0.113.0/24
200       blockrange  Deny    203.0.113.64/26
300       partners    Allow   198.51.100.0/28
Unmatched rule action: (not configured)

Advanced tool site (scm)
Use main site rules: Off
Rules: (none)
Unmatched rule action: (not configured)

Private endpoint pe-app-web: subnet snet-pe (10.1.2.0/24), IP 10.1.2.4`,
    pairs: [
      ['203.0.113.70 requests the main site', 'Allowed by the office rule'],
      ['198.51.100.25 requests the main site', 'Denied by the unmatched rule'],
      ['A VM at 10.1.3.15 in a peered virtual network requests the app through pe-app-web', 'Allowed because access restrictions don\'t evaluate private endpoint traffic'],
      ['198.51.100.25 requests the advanced tool (scm) site', 'Allowed because the scm site has no rules and no unmatched action set'],
    ],
    explanation: "Rules are evaluated by **priority, lowest first**, and the first match wins: 203.0.113.70 matches **office** (priority 100) before the deny for 203.0.113.64/26 (priority 200) is reached. 198.51.100.25 is outside 198.51.100.0/28 (.0–.15), so no rule matches; because rules exist and the unmatched action isn't configured, the **implicit deny** applies. Traffic arriving through a **private endpoint** bypasses access restrictions (control it with NSGs). The **scm site** has its own rule set: with no rules and no unmatched action configured, it **allows** all traffic." },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L346,
    stem: 'Refer to the exhibit. app-contoso-api must open connections to sql-vm01 with the least administrative effort and without installing agents. What should you configure?',
    exhibit: `app-contoso-api: Premium v3 P1v3, Linux, East US
Target: sql-vm01, 10.20.1.4:1433, subnet snet-sql in vnet-hub (East US)
vnet-hub: 10.20.0.0/16; unused range 10.20.8.0/22; no virtual network gateway`,
    options: [
      'Regional virtual network integration with a new subnet in vnet-hub delegated to Microsoft.Web/serverFarms',
      'A private endpoint for app-contoso-api in snet-sql',
      'A Hybrid Connection to 10.20.1.4:1433',
      'An access restriction rule that allows 10.20.1.0/24',
    ],
    answer: [0],
    explanation: "Calls **from** the app into a same-region VNet are **outbound**, which is what **regional VNet integration** provides: a dedicated subnet (for example a /26 from 10.20.8.0/22) delegated to **Microsoft.Web/serverFarms**, available from Basic upward. A **private endpoint** is inbound only (clients reaching the app). A **Hybrid Connection** could reach the port but needs the Hybrid Connection Manager agent installed on a Windows or Linux host that can reach the target. **Access restrictions** filter inbound requests to the app." },
  { topic: '3.4', type: 'multi', difficulty: 2, lesson: L346,
    stem: 'Which two statements about App Service regional virtual network integration are true? (Choose two.)',
    options: [
      'It needs a dedicated subnet delegated to Microsoft.Web/serverFarms',
      'When outbound internet traffic routing (route all) is enabled, NSGs and route tables on the integration subnet apply to the app\'s internet-bound traffic',
      'It lets clients in the virtual network reach the app on a private IP address',
      'The virtual network can be in any Azure region',
      'Inbound NSG rules on the integration subnet filter requests sent to the app',
      'It is available in the Free and Shared tiers',
    ],
    answer: [0, 1],
    explanation: "Regional VNet integration uses a **dedicated, delegated subnet** (/28 or larger; /26 recommended) and, with outbound internet traffic routing (**route all**) enabled, sends all outbound app traffic into the VNet, where NSGs, UDRs and a NAT gateway apply; Learn states that only traffic routed through the integration is subject to the subnet's NSGs and UDRs. It's **outbound only**: private inbound access needs a private endpoint, and inbound NSG rules on the integration subnet don't apply to requests to the app. The VNet must be in the **same region** as the app (peering then reaches other regions). It requires Basic or higher." },
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L347,
    stem: 'Refer to the exhibit. You swap the staging slot into production. After the swap completes, what is the value of FEATURE_X in the production slot?',
    exhibit: `App: app-contoso-web (Standard S1)   Environment variables > App settings

Slot         Name         Value                          Deployment slot setting
production   API_URL      https://api.contoso.com         Yes
production   FEATURE_X    off                             No
staging      API_URL      https://api-test.contoso.com    Yes
staging      FEATURE_X    on                              No`,
    answer: ['on'],
    explanation: "App settings **swap** unless they're marked as **deployment slot settings**. FEATURE_X isn't sticky, so it travels with the staging content and production ends up with **on** (and staging gets off). API_URL is a slot setting, so production keeps `https://api.contoso.com` and staging keeps the test URL; during the swap, App Service applies production's sticky values to the staging instances before warming them up." },
  { topic: '3.4', type: 'order', difficulty: 2, lesson: L347,
    stem: 'You need to release a new build of app-contoso-web through a multi-phase swap so that you can check the new build with production settings before it receives production traffic. The app has no slots yet. Place the actions in order.',
    items: [
      'Run az webapp deployment slot create --slot staging',
      'Deploy the new build to the staging slot',
      'Run az webapp deployment slot swap --slot staging --target-slot production --action preview',
      'Test the staging slot, which now runs with production\'s slot-specific settings',
      'Run az webapp deployment slot swap --slot staging --target-slot production --action swap',
    ],
    explanation: "Create the slot, deploy to it, then start a **swap with preview** (`--action preview`): App Service applies the **target (production) slot settings** to the staging instances and pauses. You validate the staging slot in that state, then complete the swap with `--action swap` (or cancel with `--action reset`). Production stays online throughout because all preparation happens on the source slot." },
  { topic: '3.4', type: 'multi', difficulty: 2, lesson: L347,
    stem: 'Refer to the exhibit. You swap the staging slot into production. Which two items in the production slot keep their pre-swap values? (Choose two.)',
    exhibit: `Production slot of app-contoso-web before the swap
- Custom domain: www.contoso.com (SNI SSL binding)
- Scale out: 3 instances (rule-based autoscale, min 2, max 6)
- Handler mappings: *.php -> custom FastCGI handler
- App setting CACHE_TTL = 300 (not a deployment slot setting)
- Connection string ReportsDb (not a deployment slot setting)
- WebJobs content: nightly-cleanup`,
    options: [
      'The custom domain www.contoso.com and its binding',
      'The scale-out settings',
      'The handler mappings',
      'The CACHE_TTL app setting',
      'The ReportsDb connection string',
      'The WebJobs content',
    ],
    answer: [0, 1],
    explanation: "**Custom domain names**, TLS bindings and **scale settings** are slot-specific, so they stay with production. **Handler mappings**, **app settings** and **connection strings** that aren't marked as slot settings, and **WebJobs content** all swap: after the swap, production has whatever values the staging slot had." },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L347,
    stem: 'Refer to the exhibit. The team needs eight staging slots for app-portal. You need to meet the requirement at the lowest cost. What should you do?',
    exhibit: `Plan: asp-portal (Standard S1, Linux, 2 instances)
App: app-portal   Deployment slots: production + 5 staging slots`,
    options: [
      'Scale asp-portal up to Premium v3 P0v3',
      'Scale asp-portal up to Standard S3',
      'Scale asp-portal out to 4 instances',
      'Move app-portal to an Isolated v2 I1v2 plan',
    ],
    answer: [0],
    explanation: "**Standard** allows **5** staging slots per app regardless of size (S1, S2 or S3) or instance count, so neither S3 nor scaling out helps. **Premium** (v2, v3, v4) and **Isolated v2** allow **20**. A Premium v3 plan is far cheaper than Isolated v2, which also needs an App Service Environment, so scale up to P0v3." },
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L342,
    stem: 'Refer to the exhibit. An administrator runs the PowerShell command to add a LOG_LEVEL setting to app-contoso-win. How many app settings does app-contoso-win have after the command completes? Enter a number.',
    exhibit: `$ az webapp config appsettings list -g rg-web-prod -n app-contoso-win --query "[].name" -o tsv
APP_MODE
FEATURE_X
API_URL

PS> Set-AzWebApp -ResourceGroupName rg-web-prod -Name app-contoso-win -AppSettings @{ LOG_LEVEL = 'debug' }`,
    answer: ['1', 'one'],
    explanation: "The `-AppSettings` parameter of **Set-AzWebApp** takes a hashtable that **replaces** the whole app settings collection; the Az PowerShell reference says existing settings are removed if they aren't provided. After the command only **LOG_LEVEL** remains (1 setting), and APP_MODE, FEATURE_X and API_URL are gone. To add one setting in PowerShell, read the current settings from `(Get-AzWebApp ...).SiteConfig.AppSettings`, copy them into a hashtable, add the new name and pass the full table. The CLI command `az webapp config appsettings set --settings LOG_LEVEL=debug` adds or updates only the names you pass, which would have left 4 settings." },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));

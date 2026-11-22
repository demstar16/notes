# CloudFormation

### What Is It?

- A declarative way of defining infrastructure that is created for you in the correct order.
- Benefits:
	- **Productivity**:
		- Declarative programming.
		- Automated generation of diagrams for templates.
		- Destroy & recreate infrastructure on the fly.
	- Infrastructure as Code:
		- No manually created resources.
		- Version control.
		- Code review.
	- Separation of Concerns:
		- VPC stacks.
		- Network stacks.
		- App stacks.
	- Cost:
		- Estimate costs with the template.
		- Implement saving strategies in code.
		- Resources are tagged.
	- Don't reinvent the wheel:
		- Existing templates.
		- Documentation.
- How Does it Work?
	- Templates are uploaded into S3 and then loaded in CloudFormation.
	- To update a template we need to re-upload the new version to AWS.
	- Stacks are **identified** by name.

### YAML

- Arrays:

```yaml
products:
    - sku: 1
      quantity: 2
    - sku: 2
      quantity: 3
```

- Objects:

```yaml
product:
    id: 13232
    description: The best product
    quantity: 2
```

### Update Behaviour

- Updates resources based on differences between what you submit & the stacks current template.
- Which method is used depends on which property you update for a resource.
	- Update with no interruptions (without disrupting resources' operation & without changing physical ID): _E.g. updating the IAM instance profile (IamInstanceProfile) of an EC2 instance._
	- Update with some interruptions: _E.g. Updating an EC2 instance type from t2.micro to t2.large._
	- Replacement (creates the new resource, changes references from old to new, then delete the old): _E.g. Updating an RDS DB Instance AZ._

### Common Template Options

- **Tags**: Passed onto every resource created with CF.
- **Permissions**: Specify an IAM Role.
- **Notification Options**: To receive event alerts.
- **Timeout**: How long you're willing to wait for stack to generate.
- **Rollback On Failure**: Not being able to delete your resources if not created correctly.
- **Rollback Configuration**: Allows you to set up a time or specific CloudWatch alarm to trigger a rollback.
- **Stack Policy**
- **Termination Protection**: Disable accidental deletion.
- **Quick-start Link**

### Template Components

- **AWSTemplateFormatVersion**: Identifies capabilities of the template ("2010-09-09")
- **Description**: Comments about the template.
- **Transform**: Specifies one or more macros that are used to process the template.
- **Metadata**
- **Resources**: AWS Resources declared in the template (**mandatory**)
- **Parameters**: Dynamic inputs for your template.
- **Mappings**: Static variables for your template.
- **Outputs**: References to what has been created.
- **Conditionals**: List of conditions to perform resource creation.
- **Rules**: Validate a parameter(s) during stack creation/update.

### AWS System Manager (SSM) Parameter Type

- Reference parameters in Systems Manager Parameter store.
- Specify SSM Parameter key as the value.
- CloudFormation always fetches the latest value.
- CloudFormation doesn't store secure string variables.
- Validation is done on the keys not the values.
- Supported SSM Parameter Types, `AWS::SSM::Parameter::`
	- `Name`
	- `Value<String>`
	- `Value<List<String>>`
	- `Value<CommaDelimitedList>`
	- `Value<AWS-Specific Parameter>`
	- `Value<List<AWS-Specific Parameter>>`
- _Example Use Case: Fetching latest AMI IDs._
- When creating parameter, use what you specify as default for the name.

### Parameters

- A way to provide inputs to templates (some inputs can't be determined ahead of time).
- They're able to be cross-validated using rules.
- We use parameters when the resource config is likely to change in the future and/or we don't want to re-upload the template when this changes.
- Parameter Options:
	- **Type**: `String`, `Number`, `CommaDelimitedList`, `List<Number>`, `AWS Specific Parameter`,` List<AWS Specific Parameter>`, SSM Parameter
	- **Description**
	- **ConstraintDescription**
	- **Min/MaxLength**
	- **Min/MaxValue**
	- **Default**
	- **AllowedValues** (array)
	- **AllowedPattern** (regex)
	- **NoEcho** (boolean): Hides what's being typed.
- Usage:

```yaml showLineNumbers
Parameters:
    MyVPC:
        Description: VPC to operate in
        Type: AWS::EC2::VPC::Id
Resources:
    Subnet:
        Properties:
            VpcId: !Ref MyVPC
```

- Reference parameters with `Ref!`.
- Parameters can be referenced anywhere except in AWSTemplateFormatVersion, Description, Transform, or Mappings.

#### Storing Parameters

- Can store parameters in a separate file and then include it in your command to make repeated parameters and finding them easy and repeatable.
- A list of objects for each parameter.

```json
[
    {
        "ParameterKey": "InstanceType", // InstanceType refers to the parameter name that you are using in your template
        "ParameterValue": "t2.micro"
    }
]
```

#### Pseudo Parameters

- AWS::AccountId
- AWS::Region
- AWS::StackId
- AWS::StackName
- AWS::NotificationARNs
- AWS::NoValue
- AWS::Partition
- AWS::URLSuffix

### Mappings

- Fixed variables within the template.
- Handy for differentiating between environments, regions, AMI, and types.
- Values are hard coded in the template.
- Allow for safer control of the template.
- Access a map value with `Fn::FindInMap`.

```txt
!FindInMap[MapName, TopLevelKey, SecondLevelKey]
```

### Resources

- Mandatory in a template.
- Represent different AWS components that will be created and configured.
- No need to worry about order, AWS deals with this for us.
- Optional Attributes:
	- **DependsOn**: Useful for drawing dependency between 2 resources.
	- **DeletionPolicy**: Protects resources from being deleted even if the stack is deleted.
	- **UpdateReplacePolicy**: Protects resources from being replaced during update.
	- **CreationPolicy**
	- **UpdatePolicy**
	- **Metadata**
- You can get the attributes that are attached to a resource with the `!GetAtt`.
- To see a list of what attributes exist on what resources click [here](https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/).

### Outputs

- Declare optional output variables that we can import to other stacks.
- View outputs in the AWS console or AWS CLI.
- Is the best way to perform some collaboration cross stack.
- **Great for separating concerns**.
- Take the value through the use `!ImportValue`.

### Conditions

- Used to control the creation of resources or outposts based on a condition.

```yaml
Conditions:
    CreateProdResources: !Equals [!Ref EnvType, prod]
```

- Once defined you can apply it to resources.

```yaml
Resources:
    MountPoint:
        Type: AWS::EC2::VolumeAttachment
        Condition: CreateProdResources
```

### Rules

- Used to perform parameter validations based on values of other parameters.
- _E.g. ensuring all subnets selected are within the same VPC_.
- Each rule consists of:
	- Rule condition.
	- Assertions.
- If you don't define a rule condition, the rule's asserts will take effect every create/update operation.
- Supported functions:
	- Fn::And
	- Fn::Contains
	- Fn::EachMemberEquals
	- Fn::EachMemberIn
	- Fn::Equals
	- Fn::If
	- Fn::Not
	- Fn::Or
	- Fn::RefAll
	- Fn::ValueOf
	- Fn::ValueOfAll

### Metadata

- Used to add extra functionality to resources in our template.
- _E.g. AWS::CloudFormation::Interface - used for grouping/ordering of parameters_.
- Set Parameter groups to group together our parameters:

```yaml
  AWS::CloudFormation::Interface:
    ParameterGroups:
        - Label:
            default: Network config
        Parameters:
            - SubnetID
            - SecurityGroupID
```

- `AWS::CloudFormation::Authentication`: used to specify authentication credentials for files or sources that you specify in AWS::CloudFormation::Init.
	- Two types: Basic & S3 bucket.
	- Use roles instead of access keys for instances.

```yaml
AWS::CloudFormation::Authentication:
    S3AccessCreds: # Reference this now whenever you want something to be authenticated
        type: S3
        buckets:
            - !Sub ${MyS3BucketName}
        roleName: !Ref InstanceRole
```

- `AWS::CloudFormation::Init`: Define config tasks for cfn-init (most powerful.)
	- Can have multiple `config sets` in a template, the different things you can have under config include:
		- packages: used to download pre-packaged apps and components (you can install from rpm, yum/apt, rubygems & python). An empty array means you want the latest version.
		- `groups`: defines user groups.
		- `users`: define users and which group they belong to.
		- `sources`: downloaded files and archives, and place them on the EC2 instance (handy if you have a set of standardised scripts).
		- `files`: creates files on the EC2 instance using inline or can be pulled from a URL.
		- `commands`: run a series of command.
		- `services`: launch a list of services using sysvinit.

Users and Groups example:

```yaml
groups:
    groupOne:
    groupTwo:
        gid: 45
users:
    myUser:
        groups:
            - groupOne
            - groupTwo
        uuid: 50
        homeDir: /temp
```

- Run a cfn-signal after cfn-init, to signal to CloudFormation that the EC2 instance was configured correctly.
- Cfn-hup is used to tell an EC2 instance to look for metadata changes every 15min.

### Drift

- A report to show us what configurations we have changed over time.

### Using Codepipeline

- Use codepipeline to build continuous delivery workflow.
- Rapidly & reliably make changes to AWS infrastructure.
- Automatically build + test changes to your CloudFormation templates before promoting them to production stacks.

### Custom Resources

- Enables you to write custom provisional logic in templates that CloudFormation can run anytime you create, update, or delete stacks.
- `AWS::CloudFormation::CustomResource` or `Custom::MyCustomResourceTypeName`.
- 2 Types:
	- Amazon SNS backed Custom Resources.
	- AWS Lambda backed Custom Resources.
- Use Cases:
	- AWS resource not covered yet.
	- On-premise resource.
	- Running a lambda resource to empty an S3 bucket before being deleted.
- How to define one:

```yaml
Resources:
    LogicalResourceName:
        Type: Custom::MyCustomResourceTypeName
        Properties:
            ServiceToken: # Specifies where cloudformation sends requests to (lambda arn or sns arn). NOTE: must be in same region
            key1: # optional input data parameters
```

### Best Practices

- Layered architecture (horizontal layers) vs. service-orientated architecture (vertical layers).
- Use cross-stack references (example, to reference a VPC or Subnet).
- Make sure the template is environment agnostic so you can do dev/test/prod and cross regions/accounts.
- Use nested stacks to reuse common template patterns.
- Do not embed credentials into CloudFormation templates (use Parameters with NoEcho or Dynamic references).
- Use cfn-init.
- Validate templates.
- Use specific parameter types and constraints.
- Don't do anything manual on the elements of the stack - that can cause a state mismatch.
- Verify changes with ChangeSets (and avoid disasters).
- Use Stack Policies to prevent critical components from being deleted after create (e.g. your most valuable RDS database).
- Use code reviews and revision controls to manage your templates.

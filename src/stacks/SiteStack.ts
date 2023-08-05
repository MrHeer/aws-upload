import {
  Api,
  Table,
  StackContext,
  Bucket,
  NextjsSite,
  Job,
  // Cognito,
} from 'sst/constructs'
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'

export function SiteStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, 'Files', {
    fields: {
      id: 'string',
      input_text: 'string',
      input_file_path: 'string',
      output_file_path: 'string',
    },
    primaryIndex: { partitionKey: 'id' },
    stream: true,
  })

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      // authorizer: "iam",
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      'POST /files': 'src/functions/files.createFile',
      'PUT /files/{id}': 'src/functions/files.updateFile',
    },
  })

  // // Create auth provider
  // const auth = new Cognito(stack, "Auth", {
  //   login: ["email"],
  // });

  // // Allow authenticated users invoke API
  // auth.attachPermissionsForAuthUsers(stack, [api]);

  // Create the Bucket
  const bucket = new Bucket(stack, 'Uploads')

  const vpc = new Vpc(stack, 'VPC')

  const job = new Job(stack, 'FileAppendJob', {
    handler: 'src/jobs/fileAppend.main',
    bind: [table, bucket],
    cdk: {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    },
  })

  table.addConsumers(stack, {
    onFileCreate: {
      function: {
        handler: 'src/consumers/fileCreate.main',
        bind: [job],
      },
      // https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-syntax
      filters: [
        {
          eventName: ['INSERT'],
        },
      ],
    },
  })

  // Deploy our Next.js app
  const site = new NextjsSite(stack, 'Site', {
    bind: [bucket, api],
  })

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
    // UserPoolId: auth.userPoolId,
    // UserPoolClientId: auth.userPoolClientId,
    // IdentityPoolId: auth.cognitoIdentityPoolId,
  })
}

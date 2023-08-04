import { Api, Table, StackContext, Bucket, NextjsSite } from "sst/constructs";

export function SiteStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Files", {
    fields: {
      id: "string",
      input_text: "string",
      input_file_path: "string",
      output_file_path: "string"
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "POST /files": "src/functions/files.createFile",
      "PUT /files/{id}": "src/functions/files.updateFile",
    },
  });

  // Create the Bucket
  const bucket = new Bucket(stack, "Uploads");

  // Deploy our Next.js app
  const site = new NextjsSite(stack, "Site", {
    bind: [bucket, api]
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}

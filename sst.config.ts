import { SSTConfig } from 'sst'
import { SiteStack } from '@/stacks/SiteStack'

export default {
  config(_input) {
    return {
      name: 'aws-upload',
      region: 'us-east-1',
    }
  },
  stacks(app) {
    app.stack(SiteStack)
  },
} satisfies SSTConfig

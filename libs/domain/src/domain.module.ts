import { Global, Module } from '@nestjs/common';

import { DomainService } from './domain.service';

@Module({
  providers: [DomainService],
  exports: [DomainService],
})
@Global()
export class DomainModule {}

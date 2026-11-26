import { Module } from '@nestjs/common';
import { SystemModule } from './modules/system/system.module';

/**
 * Root module. Each group registers its own feature module here:
 *   A → SystemModule (+ common/ infrastructure)
 *   B → IdentityModule   C → SocialModule   D → ContentModule
 */
@Module({
  imports: [SystemModule],
})
export class AppModule {}

import { MiddlewareConsumer, Module,  } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from '../schema/file.schema';
import { AwsConfigService } from '../common/aws.config';
import { EncryptionHelper } from '../common/encrypt.helper';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'file', schema: FileSchema }])],
  providers: [FileService, AwsConfigService, EncryptionHelper],
  controllers: [FileController]
})
export class FileModule {
  
  
}

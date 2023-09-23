// aws.config.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsConfigService {
  private readonly awsS3Config: AWS.S3.Types.ClientConfiguration;

  public 
  s3 = new AWS.S3();
  constructor() {
    this.awsS3Config = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    };

    AWS.config.update(this.awsS3Config);
  }

  async uploadFile(fileName, body) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: body,
    };

    const result = await this.s3.upload(params).promise();

    return result.Location;
  }

  async getFile(key) {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    
    const result = await this.s3.getObject(params).promise();

    return result.Body;
  }

  async getSignedUrl(key) {
    // AWS.config.update(this.awsS3Config);
    
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File } from './file.interface';
import { AwsConfigService } from '../common/aws.config';
import { EncryptionHelper } from '../common/encrypt.helper';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('file') private readonly fileModel: Model<File>,
    private readonly awsConfigService: AwsConfigService,
    private readonly encryptionHelper: EncryptionHelper
  ) {}

  async uploadFile(file: any, userData): Promise<any> {

    const { originalname, mimetype, buffer, size } = file;

    const { encrypted: encryptedBuffer, iv } = this.encryptionHelper.encryptBuffer(buffer);

    const fileUrl = await this.awsConfigService.uploadFile(`${originalname}-${new Date().getTime()}`, encryptedBuffer);

    const { encrypted: encUrl } = this.encryptionHelper.encryptBuffer(fileUrl, iv);

    const fileObjToSave: File = {
      fileName: originalname,
      mime: mimetype,
      size,
      encKey: iv.toString('hex'),
      url: encUrl,
      userId: userData._id
    };

    const objToSave = new this.fileModel(fileObjToSave);
    await objToSave.save();

    return {
      message: "File Uploaded Successfully."
    }
  }

  async viewFile(fileId: String): Promise<any> {

    const fileData = await this.fileModel.findOne({ _id : fileId });

    console.log(fileData)
    if (!fileData) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    // decrypt file url
    const originalFileUrl = this.encryptionHelper.decryptBuffer(fileData.url, Buffer.from(fileData.encKey, 'hex'));

    const fileKeys = originalFileUrl.split('/');
    const actualKey = fileKeys[fileKeys.length - 1];
    // // get file from s3
    const encryptedBuffer = await this.awsConfigService.getFile(actualKey);

    // // decrypt the buffer
    const decryptedBuffer = this.encryptionHelper.decryptBuffer(encryptedBuffer, Buffer.from(fileData.encKey, 'hex'));

    // console.log(decryptedBuffer)
    // // // upload file with decrypted buffer
    // const fileUrl = await this.awsConfigService.uploadFile(`${fileData.fileName}-dec-${new Date().getTime()}`, decryptedBuffer);

    // console.log(fileUrl);
    // const preSignedUrl = await this.awsConfigService.getSignedUrl(fileUrl);

    // console.log(preSignedUrl)
    // const { encrypted: encryptedBuffer, iv } = this.encryptionHelper.encryptBuffer(buffer);
    // const dec = this.encryptionHelper.decryptBuffer(encryptedBuffer, iv);

    // const fileUrl = await this.awsConfigService.uploadFile(`${originalname}-${new Date().getTime()}`, encryptedBuffer);

    // const { encrypted: encUrl } = this.encryptionHelper.encryptBuffer(fileUrl);

    // console.log(encUrl);

    // const fileObjToSave: File = {
    //   fileName: originalname,
    //   mime: mimetype,
    //   size,
    //   encKey: iv.toString('hex'),
    //   url: encUrl,
    //   userId: userData._id
    // };

    // const objToSave = new this.fileModel(fileObjToSave);
    // await objToSave.save();

    return {
      message: "File Uploaded Successfully."
    }
  }

}

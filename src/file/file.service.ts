import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File } from './file.interface';
import { AwsConfigService } from '../common/aws.config';
import { EncryptionHelper } from '../common/encrypt.helper';
import { UpdateFileNameDto } from './file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectModel('file') private readonly fileModel: Model<File>,
    private readonly awsConfigService: AwsConfigService,
    private readonly encryptionHelper: EncryptionHelper
  ) {}

  async uploadFile(file: any, userData): Promise<any> {

    const { originalname, mimetype, buffer, size } = file;

    // conver buffer to hex string
    const hexBufferString = buffer.toString('hex');
    const { encrypted: encryptedBuffer, iv } = this.encryptionHelper.encryptBuffer(hexBufferString);

    // Get encrypted buffer from enc hex
    const encBuffer = Buffer.from(encryptedBuffer, 'hex');
    const fileUrl = await this.awsConfigService.uploadFile(`${new Date().getTime()}-${originalname}`, encBuffer);

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
      message: "File Uploaded Successfully.",
      status: true
    }
  }

  async viewFile(fileId: String): Promise<any> {

    const fileData = await this.fileModel.findOne({ _id : fileId });

    if (!fileData) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    console.log("123 => ", fileData);
    // decrypt file url
    const originalFileUrl = this.encryptionHelper.decryptBuffer(fileData.url, Buffer.from(fileData.encKey, 'hex'));

    const splittedKeys = originalFileUrl.split('/');
    const actualKey = splittedKeys[splittedKeys.length - 1];

    // get file from s3
    const encryptedBuffer: any = await this.awsConfigService.getFile(actualKey);
    // decrypt the buffer
    const encBufferHexString : any = Buffer.from(encryptedBuffer, 'hex');
    const decryptedHexBuffer = this.encryptionHelper.decryptBuffer(encBufferHexString, Buffer.from(fileData.encKey, 'hex'));

    //  upload file with decrypted buffer
    const newFileKey = `${new Date().getTime()}-dec-${fileData.fileName}`;
    const originalBuffer = Buffer.from(decryptedHexBuffer, 'hex');
    const fileUrl = await this.awsConfigService.uploadFile(newFileKey, originalBuffer);

    const preSignedUrl = await this.awsConfigService.getSignedUrl(newFileKey);

    return {
      message: "File downloaded Successfully.",
      url: preSignedUrl
    }
  }

  async updateFile(updateFileObj: UpdateFileNameDto) {

    const fileData = await this.fileModel.findOne({ _id : updateFileObj.fileId });

    if (!fileData) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    await this.fileModel.updateOne({ _id: updateFileObj.fileId }, { $set: { fileName: updateFileObj.fileName }});

    return {
      message: "File Updated Successfully"
    }
  }

  async getFileList(userData) {
    const fileData = await this.fileModel.find({ userId: userData._id }, { _id: 1, fileName: 1, size: 1, mime: 1});
    return fileData;
  }
}

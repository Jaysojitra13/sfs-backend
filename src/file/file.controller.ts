import { Controller, Post, Get, UseInterceptors, UploadedFile, HttpException, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from './file.interface';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadFile(@Req() req: Request, @UploadedFile() file: any): Promise<any> {
    if (!file) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    return this.fileService.uploadFile(file, req['userData']);
  }

  // @Get('view')
  // async viewFile(@Req() req: Request, @UploadedFile() file: any): Promise<any> {
  //   return this.fileService.viewFile("650f25e1eb90dca471ca1234");
  // }
}

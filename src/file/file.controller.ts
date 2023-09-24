import { Controller, Post, Get, UseInterceptors, UploadedFile, HttpException, HttpStatus, Req, Param, Body, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from './file.interface';
import { FileService } from './file.service';
import { UpdateFileNameDto } from './file.dto';

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

  @Get('view/:id')
  async viewFile(@Param('id') id: string): Promise<any> {
    return this.fileService.viewFile(id);
  }

  @Put('update')
  async updateFile(@Body() udpateFileDto: UpdateFileNameDto): Promise<any> {
    return this.fileService.updateFile(udpateFileDto);
  }

  @Get('list')
  async getFileList(@Req() req: Request): Promise<any> {
    return this.fileService.getFileList(req['userData']);
  }
}

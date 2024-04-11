import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('images/:fileName')
  async serveFile(@Param('fileName') fileName: string, @Res() res: Response): Promise<void> {
    const uploadDir = path.join('..', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    console.log(filePath)
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return;
    }

    // Stream the file back as response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}

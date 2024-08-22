import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Get('/')
  getHome(
    @Res() res: Response, 
  ) {
    return res.redirect('/dashboard');
  }
  @Get('/:page')
  getPage(
    @Res() res: Response, 
    @Param('page') page:string
  ) {
    const filePath = join(__dirname, '..', `public/${page}.html`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.redirect('/404');
    }
  }
}

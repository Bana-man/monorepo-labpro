import { Controller, Get, Req, Res, Headers, Param } from '@nestjs/common';
import { PagesService } from './pages.service';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class PagesController {
    @Get('/:page')
    getPage(
        @Res() res: Response, 
        @Param('page') page:string
    ) {
        const filePath = join(__dirname, '../..', `public/${page}.html`);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.redirect('/404');
        }
    }

    // @Get('/browse')
    // async getBrowsePage(
    //     @Headers('Authorization') token: string, 
    //     @Res() res: Response
    // ) {
    //     const isAuthenticated = !!token;

    //     // Simulate fetching films (in a real scenario, you'd query the database)
    //     const films = [
    //         { id: '1', title: 'Film 1', director: 'Director 1', cover_image_url: '' },
    //         { id: '2', title: 'Film 2', director: 'Director 2', cover_image_url: '' },
    //         // Add more mock films as needed
    //     ];
    //     const currentPage = 1; // Hardcoded for example purposes
    //     const totalPages = 1;  // Hardcoded for example purposes

    //     const html = this.pagesService.createBrowsePage(isAuthenticated, films, currentPage, totalPages);

    //     res.send(html);
    // }

}
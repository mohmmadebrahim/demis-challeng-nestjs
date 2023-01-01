import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { Note } from './note.entity';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) { }

  @Get()
  findAll() {
    return this.notesService.getNotes();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }

  @Post()
  // https://docs.nestjs.com/techniques/validation#transform-payload-objects 
  // @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() note: Note) {
    return this.notesService.createNote(note);
  }

  @Patch(':id')
  async editNote(@Body() note: Note, @Param('id') id: number): Promise<Note> {
    const noteEdited = await this.notesService.editNote(id, note);
    return noteEdited;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id) {
    this.notesService.remove(id);
  }


  // https://docs.nestjs.com/techniques/validation#parsing-and-validating-arrays
  // @Post()
  // createBulk(
  //   @Body(new ParseArrayPipe({ items: CreateUserDto }))
  //   createUserDtos: CreateUserDto[],
  // ) {
  //   return 'This action adds new users';
  // }
}



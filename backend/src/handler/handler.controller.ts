import { Controller } from '@nestjs/common';
import { HandlerService } from './handler.service';

@Controller('handler')
export class HandlerController {
  constructor(private readonly handlerService: HandlerService) {}
}

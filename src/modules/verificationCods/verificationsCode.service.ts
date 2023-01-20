import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationsCodeEntity } from './verificationsCode.entity';

@Injectable()
export class VerificationsCodeEntityService {
    constructor(
        @InjectRepository(VerificationsCodeEntity) private VerificationsCodeEntityRepository: Repository<VerificationsCodeEntity>,
    ) { }
}

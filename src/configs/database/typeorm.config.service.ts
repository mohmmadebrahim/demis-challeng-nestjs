import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class mysqplDBConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            username: this.configService.get<string>('MYSQLDB_USER'),
            password: this.configService.get<string>('MYSQLDB_PASSWORD'),
            port: +this.configService.get<string>('MYSQLDB_PORT'),
            database: this.configService.get<string>('MYSQLDB_DATABASE'),
            host: this.configService.get<string>('MYSQLDB_HOST'),
            entities: [
                __dirname + '/../../**/*.entity{.ts,.js}',
            ],
            synchronize: true
        };
    }
}
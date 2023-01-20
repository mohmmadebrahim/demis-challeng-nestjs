import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "mail.chaleemed.com",
        service: "smtp",
        port: 465,
        secure: true,
        auth: {
          user: 'saeed@chaleemed.com',
          pass: 'ebi1376!#',
        },
      },
      defaults: {
        from: '"No Reply" <saeed@chaleemed.com>',
      },
      template: {
        dir: join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class LocalMailerModule { }

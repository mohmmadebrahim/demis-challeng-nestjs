import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("NestJS-Authentication-Challenge-Task")
    .setContact(
      "Mohammad Ebrahim Ghobadi",
      "https://ghobadi.id.ir",
      "m.e.ghobadi.76@gmail.com"
    )
    .setDescription('challenge task')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/doc", app, document);
}
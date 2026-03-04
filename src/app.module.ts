import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PermissionsModule } from './modules/permissions/permissions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === "production"
              ? process.env.RDS_HOSTNAME
              : process.env.NODE_ENV === "staging"
              ? process.env.STAGING_DB_HOST
              : process.env.DB_HOST,
      port:  parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      entities: ['**/*.entity.ts'],
      // migrations: ['src/database/migrations/*-migration.ts'],
      migrationsRun: false,
      logging: true,
      ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? {
          rejectUnauthorized: false
        } : false,
    }),
    UsersModule,
    TenantsModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { registerAs } from '@nestjs/config';

//this config should not be injected into app.module.ts as it is used only in one service
//we need to import it into users module

export default registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY,
}));

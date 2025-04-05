import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';
import seedSuperAdmin from './DB';

export async function databaseConnecting() {
  try {
    if (config.mongo_prod as object | undefined) {
      await mongoose.connect(`${config.mongo_uri_prod}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 1000,
      } as ConnectOptions);
      seedSuperAdmin();
      console.log('Database      :🚀 Connected to database (Production)');
    } else {
      await mongoose.connect(config.mongo_uri_dev as string);
      seedSuperAdmin();
      console.log('Database      :🚀 Connected to database (Development)');
    }
  } catch (error) {
    console.error('Database      :🙄 Error connecting to the database');
  }
}

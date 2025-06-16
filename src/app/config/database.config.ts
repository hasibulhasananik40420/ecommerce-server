// import mongoose, { ConnectOptions } from 'mongoose';
// import config from '.';
// import seedSuperAdmin from './DB';

// export async function databaseConnecting() {
//   try {
//     if (config.mongo_prod as object | undefined) {
//       await mongoose.connect(`${config.mongo_uri_prod}`, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 1000,
//       } as ConnectOptions);
//       seedSuperAdmin();
//       console.log('Database      :🚀 Connected to database (Production)');
//     } else {
//       await mongoose.connect(config.mongo_uri_dev as string);
//       seedSuperAdmin();
//       console.log('Database      :🚀 Connected to database (Development)');
//     }
//   } catch (error) {
//     console.error('Database      :🙄 Error connecting to the database');
//   }
// }

import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';
import seedSuperAdmin from './DB';

export async function databaseConnecting() {
  try {
    const uri = config.mongo_prod ? config.mongo_uri_prod : config.mongo_uri_dev;

    await mongoose.connect(uri as string, {
      serverSelectionTimeoutMS: 1000,
    } as ConnectOptions);

    seedSuperAdmin();

    console.log(
      `Database      :🚀 Connected to database (${config.mongo_prod ? 'Production' : 'Development'})`
    );
  } catch (error) {
    console.error('Database      :🙄 Error connecting to the database');
    console.error('Error details :❌', (error as Error).message);
  }
}

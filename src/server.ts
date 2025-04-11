/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import http from 'http';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound';
import compression from 'compression';
import { databaseConnecting } from './app/config/database.config';
 
import axios from 'axios';
import config from './app/config';

const app: Application = express();
const server = http.createServer(app);

app.use(express.json());

// const checkOrigin = async (origin: any) => {
//   if (config.node_env === 'development') {
//     if (!origin) return true;
//   }
//   return await permittedOrigins().then((origins) => {
//     return origins.includes(origin);
//   });
// };

const corsOptions = {
  origin: async (origin: any, callback: any) => {
    try {
      callback(null, true);
      // const allowed = await checkOrigin(origin);
      // if (allowed) {
      //   callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'));
      // }
    } catch (error) {
      callback(error);
    }
  },
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'superAuth',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(
  session({
    secret: config.jwt_access_secret as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

app.use(cors(corsOptions));

app.set('trust proxy', true);

app.use(cookieParser());

databaseConnecting();

const startServer = (req: Request, res: Response) => {
  try {
    res.send(`${config.wel_come_message}`);
  } catch (error) {
    console.log('server not start');
  }
};
app.get('/', startServer);



app.get('/api/v1/posts', async (req, res) => {

  let url
  try {
     url = `https://graph.facebook.com/v22.0/${config.pbPageId}/ratings?fields=reviewer,rating,review_text,created_time&access_token=${config.pbAccessToken}`;
     console.log(url)
  
    const response = await axios.get(url);

    if (response.data && response.data.data) {
      res.status(200).json({
        success: true,
        reviews: response.data.data,
      });

    } else {
      res.status(404).json({
        success: false,
        message: 'No reviews found for this page.',
      });
    }

  } catch (error : any) {
    console.error('Error fetching reviews:', error?.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching reviews.',
    });
  }

  return url
});

 
app.use(compression()); 
app.use('/api/v1', router);
app.use(notFound);
app.use(globalErrorHandler);

server.listen(config.port, () => {
  console.log(`Local         :👉 http://localhost:${config.port}/`);
});

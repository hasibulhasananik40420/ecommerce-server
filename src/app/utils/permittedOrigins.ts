
import { unauthorized } from './errorfunc';

const permittedOrigins = async () => {
  try {
    const origins = [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:4173',
      'http://localhost:5000',
      'http://localhost:4174',
      'https://sandbox.sslcommerz.com',
      'https://securepay.sslcommerz.com',
      'https://www.sslcommerz.com',
      'http://res.cloudinary.com',
      'https://res.cloudinary.com',
      'https://api.cloudinary.com',
    ];
    return origins;
  } catch (error) {
    throw unauthorized('You are not authorized user');
  }
};

export default permittedOrigins;

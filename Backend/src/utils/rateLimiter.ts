import rateLimit from "express-rate-limit";


const keyGenerator = (req: any) => {
  return req.clientIp || req.ip;
};

// General rate limiter for public APIs
const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, 
  message: 'Too many requests from this IP, please try again later',
  headers: true,
  keyGenerator,
});

// Rate limiter for authenticated user endpoints
const authenticatedRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, 
  message: 'Too many requests from this IP, please try again later',
  headers: true,
  keyGenerator,
});

// Rate limiter for sensitive operations (e.g., login)
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, 
  message: 'Too many login attempts from this IP, please try again later',
  headers: true,
  keyGenerator,
});

export { generalRateLimiter, authenticatedRateLimiter, loginRateLimiter };
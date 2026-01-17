import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];

  // 1. Check auth header exists
  if (!header) {
    return res.status(401).json({
      success: false,
      error: "Authorization header missing",
    });
  }

  // 2. Format: Bearer <token>
  const [bearer, token] = header.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      error: "Token missing after Bearer",
    });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to req
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    // 5. Continue to route
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Token invalid",
    });
  }
};

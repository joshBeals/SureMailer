
export default (req, res, next) => {
    req.user
        ? next()
        : res
              .status(401)
              .json({ success: false, error: "Authentication Failed!" });
}
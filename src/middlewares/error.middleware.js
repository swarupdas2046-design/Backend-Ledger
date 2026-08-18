const errorMiddleware = (err,req, res, next) => {
    const StatusCode = err.StatusCode || 500
    const message = err.message || "Internal Server Error"

    return res.status(StatusCode).json({message})
}

export default errorMiddleware
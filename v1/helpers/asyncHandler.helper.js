module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((error) => {
            return next(error);
        });
    }
    // return (req, res, next) => {
    //     func(req, res, next).catch(next);
    // }
}
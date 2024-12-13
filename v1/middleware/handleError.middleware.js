module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((error) => {
            // console.log(`[4]::Throw BadRequestError ${next}`);
            console.log(`[4]::Throw BadRequestError`);
            return next(error);
        });
    }
    // return (req, res, next) => {
    //     func(req, res, next).catch(next);
    // }
}
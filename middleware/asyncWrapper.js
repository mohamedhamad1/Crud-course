module.exports = (asuncFn)=>{
    return (req, res, next)=>{
        asuncFn(req, res, next).catch((err)=>{
            next(err);
        });
    }
}
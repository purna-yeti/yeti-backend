
/**
 * Verifying authenticated user by decoding from jwt token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = function(req, res, next) {
    res.status(200).send({ message: "sample api done"});
};

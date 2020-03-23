'use strict';

const hasFields = (...parameters) => {
  return function(req, res, next) {
    if (parameters.every(param => param in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('Bad Request');
  };
};

module.exports = hasFields;

// src/routes/api/get.js

const { createSuccessResponse } = require('../../../src/response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let fragments = [];
  // If there is a query in the get request, making sure to pass expand parameter as true
  // This way it will return metadata for each fragment
  if (req.query.expand) {
    fragments = await Fragment.byUser(req.user, true);
    logger.info(`User ${req.user} requested detailed fragments list`);
    logger.debug({ fragments });
  } else {
    // Otherwise returning a list of fragments ids
    fragments = await Fragment.byUser(req.user);
    logger.info(`User ${req.user} requested list of fragments ids`);
    logger.debug({ fragments });
  }
  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};

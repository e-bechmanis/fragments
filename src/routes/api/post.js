// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../../src/response');
const logger = require('../../logger');
const contentType = require('content-type');

/**
 * Creates a new fragment for the current user.
 * The client posts a file (raw binary data) in the body of the request
 * and sets the Content-Type header to the desired type of the fragment if the type is supported.
 */
module.exports = async (req, res) => {
  logger.info('Trying to add a new fragment // POST v1/fragments');
  const { type } = contentType.parse(req);
  const fragmentData = req.body;

  // Check if fragment data is a Buffer type. If it isn't, throw an error
  if (!Buffer.isBuffer(fragmentData)) {
    logger.warn(`Cannot parse fragment data for user ${req.user}`);
    return res.status(415).json(createErrorResponse(415, 'Cannot parse fragment data'));
  }
  // If the type of a fragment to be created is not currently supported, throw an error
  if (!Fragment.isSupportedType(type)) {
    logger.warn(`Unsupported type ${type} passed in POST v1/fragments`);
    return res.status(415).json(createErrorResponse(415, `Unsupported type ${type} `));
  }

  try {
    // create a new fragment
    const fragment = new Fragment({ ownerId: req.user, type: type });
    logger.info(`Created a new fragment`);
    logger.info(fragment);
    // save created fragment
    await fragment.save();
    // write fragment data
    await fragment.setData(fragmentData);

    // If we have API_URL in environment variables, set that (+ fragment id) as a location
    // Otherwise, use localhost (+ fragment id)
    const location = process.env.API_URL
      ? new URL(`${process.env.API_URL}/v1/fragments/${fragment.id}`)
      : new URL(`http://localhost:8080/v1/fragments/${fragment.id}`);

    logger.debug('Location: ' + location);

    res
      .location(location) // Set fragment location in response header
      .status(201)
      .json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error(err);
    res.status(415).json(createErrorResponse(415, err));
  }
};

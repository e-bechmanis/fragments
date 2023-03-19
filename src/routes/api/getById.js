// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const mime = require('mime');
/**
 * Gets an authenticated user's fragment data (i.e., raw binary data) with the given id
 */
module.exports = async (req, res) => {
  try {
    logger.info('Trying to get user fragment by id // GET /v1/fragments/:id');
    //Logic to account for GET /fragments/:id.ext
    //Parse id param to see if there is any extension to convert fragment to
    const parsedId = req.params.id.split('.');
    const id = parsedId[0]; // id will always be an element 0

    // Getting fragment metadata
    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `Read fragment metadata for user ${req.user}`);
    // Getting fragment data
    let fragmentData = await fragment.getData();
    let fragmentType = fragment.type;
    let fragmentDataSize = fragment.size;

    logger.info('Fragment data is successfully read');
    logger.debug(`Fragment type ` + fragmentType);
    logger.debug(`Fragment size ` + fragmentDataSize);

    // When id string actually gets parsed into 2 elements, we should see if the fragment data can be converted
    // into the required datatype
    if (parsedId.length > 1) {
      const ext = parsedId[1];
      logger.info(
        `User ${req.user} requested conversion of fragment from ${fragmentType} to ${ext}`
      );
      // If conversion is allowed
      if (fragment.isValidConversion(ext)) {
        logger.debug('Conversion is allowed. Initiating conversion process');
        fragmentData = fragment.convertFragmentData(ext);
        fragmentType = mime.getType(ext);
        logger.debug(`Converted to ${ext}, returning fragment type ${fragmentType}`);
      }
    }

    // set Content-type and Content-Length in response header
    return res
      .set('content-type', fragmentType)
      .set('content-length', fragmentDataSize)
      .status(200)
      .send(fragmentData);
  } catch (err) {
    logger.error(err);
    return res.status(404).json(createErrorResponse(404, err));
  }
};

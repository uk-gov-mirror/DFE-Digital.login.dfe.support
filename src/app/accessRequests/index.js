'use strict';

const express = require('express');
const { isLoggedIn, setCurrentArea, isRequestApprover } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const {get: getSearch,post: postSearch} = require('./search');
const {get: getRequest, post: postRequest} = require('./accessRequest');

const { get: getOrganisationRequests, post: postOrganisationRequests } = require('./organisationRequests');
const { get: getReviewOrganisationRequest, post: postReviewOrganisationRequest } = require('./reviewOrganisationRequest');
const { get: getRejectOrganisationRequest, post: postRejectOrganisationRequest } = require('./rejectOrganisationRequest');
const { get: getSelectPermissionLevel, post: postSelectPermissionLevel } = require('./selectPermissionLevel');

const router = express.Router({ mergeParams: true });

const users = (csrf) => {
  logger.info('Mounting accessRequests routes');

  router.use(isLoggedIn);
  router.use(isRequestApprover);
  router.use(setCurrentArea('users'));

  router.get('/', csrf, asyncWrapper(getOrganisationRequests));
  router.post('/', csrf, asyncWrapper(postOrganisationRequests));

  router.get('/:rid/review', csrf, asyncWrapper(getReviewOrganisationRequest));
  router.post('/:rid/review', csrf, asyncWrapper(postReviewOrganisationRequest));
  router.get('/:rid/reject', csrf, asyncWrapper(getRejectOrganisationRequest));
  router.post('/:rid/reject', csrf, asyncWrapper(postRejectOrganisationRequest));
  router.get('/:rid/approve', csrf, asyncWrapper(getSelectPermissionLevel));
  router.post('/:rid/approve', csrf, asyncWrapper(postSelectPermissionLevel));

  return router;
};

module.exports = users;

'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.query.query-util');

var DEFAULT_PAGE_SIZE = 25;

module.exports.buildResult = function(req, totalCount){

	var request = req || {},
		page = request.page || 1,
		pageSize = request.pageSize || DEFAULT_PAGE_SIZE;

	if (page<=0) {
		logger.debug('Negative page requested, reverting to default.');
		page = 1;
	}

	if (pageSize === 'ALL') {
		pageSize = totalCount;
		page = 1;
		if(pageSize == 0)
			pageSize = DEFAULT_PAGE_SIZE;

	} else if (pageSize<=0) {
		logger.debug('Negative page size requested, reverting to default.');
		pageSize = DEFAULT_PAGE_SIZE;
	}
	
	var qResult = {
		filter: request.filter || '',
		pageSize: pageSize,
		page: page,
		pageCount: Math.ceil(totalCount / pageSize),
		totalCount: totalCount
	};
	
	if(page > qResult.pageCount) {
		logger.debug('Page requested greater than total pages, reverting to last available page.');
		qResult.page = qResult.pageCount;
	}	

	return qResult;
};
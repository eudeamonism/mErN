const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers in the world!',
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: '20 W 34th St, New York, NY 10001',
		creator: 'u1',
	},
];
//This has to be first. Examine the second link.
//if we had a route instead like /user, such would need to be before this or it would never be reached.
router.get('/:pid', (req, res, next) => {
	const placeId = req.params.pid; // { pid: 'p1' }

	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});

	if (!place) {
		throw new HttpError('Could not find a place for provided id.', 404);
	}

	res.json({ place }); // => { place } => { place: place }
});

router.get('/user/:uid', (req, res, next) => {
	const userId = req.params.uid;

	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});

	if (!place) {
		const error = new HttpError(
			'Could not find a place for provided user id.',
			404
		);
		return next(error);
	}

	res.json({ place });
});

module.exports = router;
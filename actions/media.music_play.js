const _config = config.ai.spotify;
const TAG = path.basename(__filename, '.js');

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi(_config.options);

module.exports = function(e) {
	return new Promise(function(resolve, reject) {
		let {parameters} = e;

		let query = [];
		let random_output = true;

		if (parameters.artist) {
			random_output &= true;
			query.push('artist:' + parameters.artist);
		}

		if (parameters.title) {
			random_output &= false;
			query.push('track:' + parameters.title);
		}

		console.debug(TAG, 'search', query);

		spotifyApi.searchTracks(query.join(' ')).then(function(data) {

			try {

				let {items} = data.body.tracks;
				if (items.length === 0) throw 'Zero length results';

				items = _.map(items, (item) => {
					return _.pick(item, 'uri', 'external_urls');
				});
				console.debug(TAG, 'list result', items);

				let song = items[ random_output ? _.random(0, items.length-1) : 0 ];
				console.debug(TAG, 'result', song);

				resolve({
					spotify: {
						song: song
					}
				});

			} catch (err) {
				reject({ 
					err: err,
					text: 'Non riesco a riprodurre quello che mi chiedi'
				});
			}

		}, (err) => {
			reject({ 
				err: err,
				text: 'Non riesco a riprodurre quello che mi chiedi'
			});
		});
	});
};
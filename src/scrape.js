var Nightmare = require('nightmare');

/*

*/
var steamGames = []

function getGamesFromPage(pageNumber){
	return new Nightmare({ show: true })
		.goto('http://store.steampowered.com/search/#sort_by=Reviews_DESC&page='+pageNumber)
		.wait(650) // Wait for Steam's javascript to fetch and render results
		.evaluate(
			function () {
				// Now that we're on the page with the right results, build an array
				var pageGameElements = [].slice.call(document.querySelectorAll('#search_result_container .search_result_row'))
				var pageGames = pageGameElements.map(function(row){
					var rawPrice = row.querySelector('.search_price_discount_combined .search_price').textContent;
					var cleanPrice = rawPrice.replace(/\t/g, "").replace(/\n/g, "")
					var hasDollar = cleanPrice.lastIndexOf('$')
					if (hasDollar) {
						cleanPrice = cleanPrice.substring(hasDollar)
					}
					var rawRating = row.querySelector('.search_review_summary').attributes["data-store-tooltip"].value;
					return {
						title: row.querySelector('.title').textContent,
						reviewPositivePercent: rawRating.substring(rawRating.indexOf('>')+1,rawRating.indexOf('%')),
						reviewTotal: rawRating.substring(rawRating.indexOf('the ')+4,rawRating.indexOf(' user')),
						reviewConsensus: rawRating.substring(0,rawRating.indexOf('<')),
						url: row.href,
						price: cleanPrice
					}
				})
				return pageGames
			}
		)
		.end()
		.then(function (results) {
			steamGames = steamGames.concat(results)
			// console.log(steamGames)

			// if the last game in the list is not OP, stop the loop
			var allGamesAreOP = (steamGames[steamGames.length-1].reviewConsensus == 'Overwhelmingly Positive')
			// allGamesAreOP = false;
			if (allGamesAreOP) {
				return getGamesFromPage(pageNumber+1)
			} else {
				return results
			}
		})
		.catch(function (error) {
			console.error('Search failed:', error);
		});
}

function removeVeryPositive(games){
	var hasVeryPositive = true;
	var lastGame = games.length-1
	while (hasVeryPositive) {
		if (games[lastGame].reviewConsensus != 'Overwhelmingly Positive') {
			lastGame--
		} else {
			hasVeryPositive = false
		}
	}
	return games.slice(0,lastGame+1);
}

getGamesFromPage(1).then(function(){
	console.log(steamGames)
	console.log(steamGames.length + " games were found")

	var OPGames = removeVeryPositive(steamGames)
	console.log(OPGames);
	console.log(OPGames.length + " are OP")
	//Once array is built, write that to file
})


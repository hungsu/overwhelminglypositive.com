var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false })

nightmare
	.goto('http://store.steampowered.com/search/#sort_by=Reviews_DESC&page=1')
	// .click('form[action*="/search"] [type=submit]')
	.wait(375) // Wait for Steam's javascript to fetch and render results
	.evaluate(function () {
		// Now that we're on the page with the right results, build an array
		var gameElements = [].slice.call(document.querySelectorAll('#search_result_container .search_result_row'))
		var games = gameElements.map(function(row){
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
		return games
	})
	.end()
	.then(function (result) {
		//Once array is built, write that to file
		console.log(result)
	})
	.catch(function (error) {
		console.error('Search failed:', error);
	});

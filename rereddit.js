(function() {
	var siteTable = $('#siteTable'),
		uniques = {},
	    filtered = 0;
	
	function nearScrollBottom(e, threshold) {
		return $('body').height() - $(e.target).scrollTop() - $(window).height() < threshold;
	};
	
	function fetchMoreContent(count) {
		$.ajax({
			url: 'http://www.reddit.com/?count='+count+'&after='+lastEntryId(),
			success: function(data) {
				injectContent(filterDuplicates(extractEntries(data)));
			}
		});
	};
	
	function lastEntryId() {
		return $('#siteTable div.thing:last').data('fullname');
	};
	
	function extractEntries(data) {
		return $(data).find('#siteTable').find('div.thing');
	};
	
	function filterDuplicates(fetched) {
		var fresh = [];
		for (var i=0; i<fetched.size(); i++) {
			if (!checkDuplicate(fetched[i])) {
				fresh.push(fetched[i]);
			}
		}
		
		return fresh;
	};
	
	function checkDuplicate(entry) {
		var title = $(entry).find('a.title').text();
		
		if (uniques[title]) {
			console.log("Re-Reddit: Filtered duplicate entry -- \""+title+"\" ("+(++filtered)+")");
			return true;
		}
			
		uniques[title] = true;
		return false;
	};
	
	function injectContent(entries) {
		$('#siteTable div.thing:last').after(entries);
	};
	
	$(window).scroll(function(e) {
		if (nearScrollBottom(e, 600)) {
			fetchMoreContent(20);
		}
	});
	
})();
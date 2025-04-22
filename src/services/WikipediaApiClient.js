/**
 * Class representing a Wikipedia API client
 */
export class WikipediaApiClient {
	/**
	 * Create a Wikipedia API client
	 * @param {Object} options - Configuration options
	 * @param {Object} options.httpClient - HTTP client for making requests
	 * @param {string} options.baseUrl - Base URL for Wikipedia API
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * Gets Wikipedia information for a specific year
	 * @param {number} year - The year to search for
	 * @returns {Promise<Object>} - Wikipedia content information
	 */
	async getYearInfo(year) {
		try {
			const pageInfo = await this.searchForPage(year.toString());

			if (!pageInfo) {
				return {
					title: `Year ${year}`,
					snippet: `No significant historical events found for year ${year}.`,
					fullUrl: null
				};
			}

			const pageContent = await this.getPageContent(pageInfo.pageId);

			return {
				title: pageInfo.title,
				snippet: pageInfo.snippet,
				extract: pageContent.extract,
				fullUrl: pageContent.fullUrl
			};
		} catch (error) {
			console.error("Wikipedia API error:", error);
			return {
				title: `Year ${year}`, snippet: "Error retrieving historical information.", fullUrl: null
			};
		}
	}

	/**
	 * Search for a Wikipedia page
	 * @param {string} searchTerm - Term to search for
	 * @returns {Promise<Object|null>} - Page information or null if not found
	 * @private
	 */
	async searchForPage(searchTerm) {
		const searchParams = {
			action: "query", format: "json", list: "search", srsearch: searchTerm, srlimit: 1, origin: "*"
		};

		const searchResponse = await this.options.httpClient.get(this.options.baseUrl, {params: searchParams});

		if (!searchResponse.data.query.search.length) {
			return null;
		}

		const result = searchResponse.data.query.search[0];
		return {
			pageId: result.pageid, title: result.title, snippet: WikipediaApiClient.format(result.snippet)
		};
	}

	/**
	 * Get content from a Wikipedia page
	 * @param {number} pageId - ID of the page to retrieve
	 * @returns {Promise<Object>} - Page content
	 * @private
	 */
	async getPageContent(pageId) {
		const contentParams = {
			action: "query",
			format: "json",
			prop: "extracts|info",
			exintro: true,
			explaintext: true,
			inprop: "url",
			pageids: pageId,
			exsentences: 3,
			origin: "*"
		};

		const contentResponse = await this.options.httpClient.get(this.options.baseUrl, {params: contentParams});
		const page = contentResponse.data.query.pages[pageId];

		return {
			extract: page.extract, fullUrl: page.fullurl
		};
	}

	/**
	 * Cleans HTML tags from Wikipedia snippets
	 * @param {string} snippet - The raw snippet from Wikipedia
	 * @returns {string} - Clean text
	 */
	static format(snippet) {
		return snippet
			.replace(/<\/?span[^>]*>/g, "")
			.replace(/<\/?div[^>]*>/g, "")
			.replace(/<\/?p[^>]*>/g, "")
			.replace(/<\/?b[^>]*>/g, "")
			.replace(/<\/?i[^>]*>/g, "")
			.replace(/&quot;/g, "\"")
			.replace(/&amp;/g, "&");
	}
}

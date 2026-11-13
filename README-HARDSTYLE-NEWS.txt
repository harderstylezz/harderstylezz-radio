HARDSTYLE NEWS — MULTI-SOURCE UPDATE

Sources: Hardstyle.com, Hard News, Hardstyle Mag via Google News RSS domain filters.
The news section now shows up to 9 articles, publication/source/date, and optional images.

HOW TO ACTIVATE:
1. Upload ALL files and folders from this ZIP to the root of your GitHub Pages repository.
2. Make sure the .github/workflows/update-hardstyle-news.yml file is included.
3. In GitHub, open Actions > Update Hardstyle News > Run workflow.
4. Ensure GitHub Actions has permission to write repository contents (Settings > Actions > General > Workflow permissions).
5. The workflow is scheduled daily at 06:17 UTC, subject to GitHub schedule delays.

IMPORTANT:
- The current news.json remains as fallback until the first successful workflow run.
- Google News RSS results may be unavailable, sparse, or delayed; the script does not invent articles.
- Images are displayed only when a source provides a valid image URL.
- The original article link may go via Google News before reaching the publisher.
- A static GitHub Pages website cannot refresh its news without a scheduled updater or external service.

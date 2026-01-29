document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('news-container');
    const apiStatus = document.getElementById('api-status');

    // RSS Feed to JSON Converter (Free public API)
    // We use TechCrunch Robotics Feed as the source
    const RSS_URL = 'https://techcrunch.com/category/robotics/feed/';
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    function displayNews(items) {
        newsContainer.innerHTML = '';

        items.forEach(item => {
            // rss2json tries to find an image in the enclosure or content
            let imageUrl = item.enclosure?.link || item.thumbnail;

            // If no image found, try to extract from description content
            if (!imageUrl) {
                const imgMatch = item.content.match(/src="([^"]+)"/);
                if (imgMatch) imageUrl = imgMatch[1];
            }

            // Fallback image if still nothing
            if (!imageUrl) {
                imageUrl = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop';
            }

            const newsItem = document.createElement('div');
            newsItem.classList.add('example-item', 'news-card');

            // Format Date
            const pubDate = new Date(item.pubDate).toLocaleDateString();

            newsItem.innerHTML = `
                <div class="news-image">
                    <img src="${imageUrl}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2610&auto=format&fit=crop'">
                </div>
                <div class="news-content">
                    <span class="news-source">TechCrunch Robotics</span>
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${truncateText(cleanText(item.description), 120)}...</p>
                    <span class="news-date">${pubDate}</span>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    // Helper: Remove HTML tags from description
    function cleanText(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // Helper: Truncate long descriptions
    function truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substr(0, length);
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === 'ok') {
            displayNews(data.items);
            apiStatus.style.display = 'block';
            apiStatus.innerHTML = '✅ Auto-updated from <a href="https://techcrunch.com/category/robotics/" target="_blank" style="color:var(--primary-color)">TechCrunch RSS</a>';
        } else {
            throw new Error('Failed to load RSS feed');
        }

    } catch (error) {
        console.error('RSS Fetch Error:', error);
        newsContainer.innerHTML = `
            <div class="example-item">
                <h3>Current News Unavailable</h3>
                <p>Could not load the latest RSS feed. Please check your internet connection.</p>
            </div>
        `;
        // Optional: Load mock data here if preferred
    }
});

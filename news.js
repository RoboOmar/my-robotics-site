document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('news-container');
    const apiStatus = document.getElementById('api-status');

    // Replace this with your own API key from https://newsapi.org/
    const API_KEY = 'YOUR_API_KEY_HERE';
    const TOPIC = 'robotics';
    const API_URL = `https://newsapi.org/v2/everything?q=${TOPIC}&sortBy=publishedAt&apiKey=${API_KEY}`;

    // Fallback Mock Data (in case API fails or no key is provided)
    const mockNews = [
        {
            title: "New AI Humanoid Robot 'Ameca' Stuns Crowd with Expressions",
            description: "Engineered Arts reveals their latest humanoid robot, displaying frighteningly realistic facial expressions and movements.",
            url: "#",
            src: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2610&auto=format&fit=crop",
            source: { name: "TechCrunch" },
            publishedAt: "2026-01-28T10:00:00Z"
        },
        {
            title: "Boston Dynamics' Atlas Robot Performs Perfect Backflip",
            description: "The latest video from Boston Dynamics shows Atlas navigating complex parkour courses with ease.",
            url: "#",
            src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
            source: { name: "The Verge" },
            publishedAt: "2026-01-27T14:30:00Z"
        },
        {
            title: "Tesla Optimus Gen 2 Released: Better Hands, Faster Walking",
            description: "Tesla's humanoid robot gets a major upgrade with improved tactile sensing and faster walking speeds.",
            url: "#",
            src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
            source: { name: "Reuters" },
            publishedAt: "2026-01-25T09:15:00Z"
        },
        {
            title: "Robots in Agriculture: The Future of Farming",
            description: "Autonomous tractors and fruit-picking robots are revolutionizing the agricultural industry.",
            url: "#",
            src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2065&auto=format&fit=crop",
            source: { name: "Wired" },
            publishedAt: "2026-01-22T11:45:00Z"
        },
        {
            title: "NASA's Valkyrie Robot Prepared for Mars Mission",
            description: "NASA begins testing its Valkyrie humanoid robot for potential future tasks on the Red Planet.",
            url: "#",
            src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
            source: { name: "NASA JPL" },
            publishedAt: "2026-01-20T16:20:00Z"
        },
        {
            title: "Industrial Robots Market to Hit $50 Billion by 2030",
            description: "The demand for automation in manufacturing continues to soar as AI integration becomes standard.",
            url: "#",
            src: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1974&auto=format&fit=crop",
            source: { name: "Bloomberg" },
            publishedAt: "2026-01-18T08:00:00Z"
        }
    ];

    function displayNews(articles) {
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            // Use API image if available, else a random robot placeholder, or one of our mock images
            const image = article.urlToImage || article.src || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop';

            const newsItem = document.createElement('div');
            newsItem.classList.add('example-item', 'news-card');

            newsItem.innerHTML = `
                <div class="news-image">
                    <img src="${image}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <span class="news-source">${article.source.name}</span>
                    <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p>${article.description || 'No description available.'}</p>
                    <span class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    try {
        // Since we don't have a valid API Key in this public code, we simulate a failed fetch 
        // or check if the user inserted one.
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('No API Key provided. Using mock data.');
        }

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === 'ok') {
            displayNews(data.articles.slice(0, 9)); // Show top 9 articles
            apiStatus.innerText = 'Powering latest news via NewsAPI.org';
        } else {
            throw new Error(data.message || 'Error fetching news');
        }

    } catch (error) {
        console.warn('News Fetch Error:', error.message);
        displayNews(mockNews);
        apiStatus.style.display = 'block';
        apiStatus.innerText = 'Note: Displaying demo news. To see live updates, please add a valid API key to news.js.';
    }
});

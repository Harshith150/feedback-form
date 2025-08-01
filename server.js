// Enhanced feedback script with multiple data collection options
const responses = {
    okay: {
        title: "Thanks for the feedback!",
        message: "We appreciate your honest opinion and will work to improve! 😊"
    },
    good: {
        title: "Awesome! We're glad you liked it!",
        message: "Your positive feedback motivates us to keep doing great work! 🌟"
    },
    amazing: {
        title: "WOW! You made our day!",
        message: "We're thrilled that you had an amazing experience! You're absolutely wonderful! 🎉✨"
    }
};

// Funny jokes array with memes
const jokes = [
    "Why don't programmers like nature? It has too many bugs! 🐛 (And no WiFi)",
    "There are only 10 types of people: those who understand binary and those who don't 🤓",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
    "Why do Java developers wear glasses? Because they can't C# 👓 (I'll see myself out)",
    "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
    "Why did the developer go broke? Because he used up all his cache! 💸",
    "My code doesn't always work, but when it does... I have no idea why 🤷‍♂️",
    "99 little bugs in the code, 99 little bugs... take one down, patch it around... 117 little bugs in the code! 📈",
    "I would tell you a UDP joke, but you might not get it 📡",
    "There's no place like 127.0.0.1 🏠 (Home sweet home)",
    "Why do programmers prefer dark mode? Because light attracts bugs! 🌙🐛",
    "I'm not a great programmer; I'm just a good programmer with great habits... JK, I copy from Stack Overflow 📋"
];

// Funny meme messages for bad feedback
const funnyMessages = [
    "This is fine. 🔥 Everything is fine. 🔥 (Narrator: It was not fine) 🐕",
    "Task failed successfully! 📈 Congratulations, you've discovered a new way to break things! 🏆",
    "Me: \"I'll fix this in 5 minutes\" ⏰ Also me: *3 hours later* \"Why is my code speaking Latin?\" 🤔",
    "99 little bugs in the code 🐛 99 little bugs 🐛 Take one down, patch it around 🔧 127 little bugs in the code 📈",
    "Brain: \"Just one small bug fix\" 🧠 Computer: \"And I took that personally\" 💻😤",
    "ERROR 404: My motivation not found 🔍 Please try again after coffee ☕ (Results may vary)",
    "Roses are red 🌹 Violets are blue 💙 Unexpected token at line 42 💥 console.log(\"help me\") 😭",
    "*Chuckles* I'm in danger! 😅 But hey, at least we're breaking things with STYLE! ✨💥",
    "Plot twist: The real bug was the friends we made along the way 👫 (Spoiler: We made no friends) 😢",
    "When you copy code from Stack Overflow but it doesn't work: \"Well yes, but actually no\" 🤷‍♂️"
];

// Configuration for data collection methods
const DATA_COLLECTION_CONFIG = {
    // Method 1: EmailJS (Free email service)
    emailjs: {
        enabled: true,
        serviceId: 'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID', // Replace with your EmailJS template ID
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
    },
   
    // Method 2: Google Sheets (via Google Apps Script)
    googleSheets: {
        enabled: false, // Set to true to enable
        scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL' // Replace with your Google Apps Script URL
    },
   
    // Method 3: Webhook URL (any service that accepts POST requests)
    webhook: {
        enabled: false, // Set to true to enable
        url: 'YOUR_WEBHOOK_URL' // Replace with your webhook URL
    },
   
    // Method 4: Local storage backup (always enabled as fallback)
    localStorage: {
        enabled: true
    }
};

// Data Collection Manager
class FeedbackDataManager {
    constructor() {
        this.initializeEmailJS();
    }

    // Initialize EmailJS if enabled
    initializeEmailJS() {
        if (DATA_COLLECTION_CONFIG.emailjs.enabled) {
            // Load EmailJS library
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(DATA_COLLECTION_CONFIG.emailjs.publicKey);
                console.log('EmailJS initialized');
            };
            document.head.appendChild(script);
        }
    }

    // Send feedback data to all enabled services
    async sendFeedback(feedbackData) {
        const results = [];
       
        // Always save to localStorage as backup
        this.saveToLocalStorage(feedbackData);
        results.push({ method: 'localStorage', success: true });

        // Try EmailJS
        if (DATA_COLLECTION_CONFIG.emailjs.enabled) {
            try {
                await this.sendToEmailJS(feedbackData);
                results.push({ method: 'emailjs', success: true });
            } catch (error) {
                console.error('EmailJS failed:', error);
                results.push({ method: 'emailjs', success: false, error });
            }
        }

        // Try Google Sheets
        if (DATA_COLLECTION_CONFIG.googleSheets.enabled) {
            try {
                await this.sendToGoogleSheets(feedbackData);
                results.push({ method: 'googleSheets', success: true });
            } catch (error) {
                console.error('Google Sheets failed:', error);
                results.push({ method: 'googleSheets', success: false, error });
            }
        }

        // Try Webhook
        if (DATA_COLLECTION_CONFIG.webhook.enabled) {
            try {
                await this.sendToWebhook(feedbackData);
                results.push({ method: 'webhook', success: true });
            } catch (error) {
                console.error('Webhook failed:', error);
                results.push({ method: 'webhook', success: false, error });
            }
        }

        return results;
    }

    // Send via EmailJS
    async sendToEmailJS(feedbackData) {
        const templateParams = {
            rating: feedbackData.rating,
            timestamp: feedbackData.timestamp,
            user_agent: feedbackData.userAgent,
            page_url: feedbackData.pageUrl,
            message: `New feedback received: ${feedbackData.rating} rating`
        };

        return emailjs.send(
            DATA_COLLECTION_CONFIG.emailjs.serviceId,
            DATA_COLLECTION_CONFIG.emailjs.templateId,
            templateParams
        );
    }

    // Send to Google Sheets
    async sendToGoogleSheets(feedbackData) {
        const response = await fetch(DATA_COLLECTION_CONFIG.googleSheets.scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Google Sheets API error: ${response.status}`);
        }

        return response.json();
    }

    // Send to Webhook
    async sendToWebhook(feedbackData) {
        const response = await fetch(DATA_COLLECTION_CONFIG.webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Webhook error: ${response.status}`);
        }

        return response.json();
    }

    // Save to localStorage (fallback method)
    saveToLocalStorage(feedbackData) {
        try {
            let existingData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
            existingData.push(feedbackData);
            localStorage.setItem('feedbackData', JSON.stringify(existingData));
            return true;
        } catch (error) {
            console.error('LocalStorage save failed:', error);
            return false;
        }
    }
}

// Initialize data manager
const dataManager = new FeedbackDataManager();

// Enhanced feedback storage with server integration
const FeedbackStorage = {
    save: async function(rating) {
        const feedbackData = {
            rating: rating,
            timestamp: new Date().toISOString(),
            dateString: new Date().toLocaleString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href,
            sessionId: this.getSessionId()
        };

        try {
            // Try to send to server first
            const serverResponse = await this.sendToServer(feedbackData);
            if (serverResponse.success) {
                console.log('✅ Feedback sent to server successfully');
            }
        } catch (error) {
            console.warn('⚠️ Server unavailable, saving locally:', error.message);
        }

        // Always save to localStorage as backup
        this.saveToLocalStorage(feedbackData);
       
        // Also send using existing data manager for external services
        try {
            await dataManager.sendFeedback(feedbackData);
        } catch (error) {
            console.warn('External services unavailable:', error);
        }

        return { success: true, data: feedbackData };
    },

    sendToServer: async function(feedbackData) {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return response.json();
    },

    saveToLocalStorage: function(feedbackData) {
        try {
            let existingData = JSON.parse(localStorage.getItem('feedbackResponses') || '[]');
            existingData.push(feedbackData);
            localStorage.setItem('feedbackResponses', JSON.stringify(existingData));
            return true;
        } catch (error) {
            console.error('LocalStorage save failed:', error);
            return false;
        }
    },

    getSessionId: function() {
        let sessionId = sessionStorage.getItem('feedbackSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('feedbackSessionId', sessionId);
        }
        return sessionId;
    },

    getAllFromServer: async function() {
        try {
            const response = await fetch('/api/feedback');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not fetch from server, using local data');
        }
        return this.getAllFromLocal();
    },

    getAllFromLocal: function() {
        return JSON.parse(localStorage.getItem('feedbackResponses') || '[]');
    },

    getStatsFromServer: async function() {
        try {
            const response = await fetch('/api/feedback/stats');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not fetch stats from server, calculating from local data');
        }
        return this.calculateLocalStats();
    },

    calculateLocalStats: function() {
        const data = this.getAllFromLocal();
        const stats = {
            total: data.length,
            bad: data.filter(f => f.rating === 'bad').length,
            okay: data.filter(f => f.rating === 'okay').length,
            good: data.filter(f => f.rating === 'good').length,
            amazing: data.filter(f => f.rating === 'amazing').length
        };
       
        stats.satisfaction = data.length > 0 ?
            Math.round(((stats.good + stats.amazing) / data.length) * 100) : 0;
           
        return stats;
    },

    clearAllData: async function() {
        try {
            const response = await fetch('/api/feedback/clear', { method: 'DELETE' });
            if (response.ok) {
                console.log('✅ Server data cleared');
            }
        } catch (error) {
            console.warn('Could not clear server data:', error);
        }
       
        // Also clear local storage
        localStorage.removeItem('feedbackResponses');
        localStorage.removeItem('feedbackData');
        console.log('✅ Local data cleared');
    },

    exportToCSV: async function() {
        const data = await this.getAllFromServer();
        if (data.length === 0) {
            alert('No feedback data to export!');
            return;
        }

        const csvContent = [
            ['Rating', 'Date & Time', 'Session ID', 'User Agent', 'Page URL', 'Server ID'],
            ...data.map(item => [
                item.rating,
                item.dateString || item.timestamp,
                item.sessionId,
                item.userAgent || '',
                item.pageUrl || '',
                item.serverId || ''
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// GIF loading functions
function gifLoaded() {
    document.getElementById('gifLoading').style.display = 'none';
    document.getElementById('mainGif').style.display = 'block';
}

function loadFallbackGif() {
    const fallbackGifs = [
        'https://media.giphy.com/media/l0HlN5Y28D9MzzcRy/giphy.gif',  // Frustrated developer
        'https://media.giphy.com/media/3o6fJgDDx7Pub3WnF6/giphy.gif', // Computer crying meme
        'https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif',  // Dramatic head in hands
        'https://media.giphy.com/media/VBHenVuodkfLy/giphy.gif',     // This is fine dog (classic)
        'https://media.giphy.com/media/AQOpT2cYxqsjS/giphy.gif',     // Stress eating/crying
        'https://media.giphy.com/media/3o7aCRloybJlXpNjSU/giphy.gif', // Office breakdown
        'https://media.giphy.com/media/5wFS6a1PE620aoBkhD/giphy.gif'  // Developer meltdown
    ];
   
    const randomGif = fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
    const mainGif = document.getElementById('mainGif');
   
    mainGif.src = randomGif;
    mainGif.onload = gifLoaded;
    mainGif.onerror = function() {
        document.getElementById('gifLoading').innerHTML = '<div class="gif-fallback">😭 Our tears are loading... 😭</div>';
    };
}

// Event listeners for feedback buttons
document.addEventListener('DOMContentLoaded', function() {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
   
    feedbackButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const rating = this.getAttribute('data-rating');
           
            // Add loading state
            this.innerHTML = '<span class="loading-spinner">🔄</span><span class="text">Sending...</span>';
            this.disabled = true;
           
            try {
                // Save feedback data
                await FeedbackStorage.save(rating);
               
                // Hide feedback card
                document.getElementById('feedbackCard').classList.add('hidden');
               
                if (rating === 'bad') {
                    handleBadFeedback();
                } else {
                    handlePositiveFeedback(rating);
                }
            } catch (error) {
                console.error('Error saving feedback:', error);
                // Still show response even if data sending failed
                document.getElementById('feedbackCard').classList.add('hidden');
               
                if (rating === 'bad') {
                    handleBadFeedback();
                } else {
                    handlePositiveFeedback(rating);
                }
            }
        });
    });
});

function handleBadFeedback() {
    // Keep the original HTML message instead of replacing it
    // Comment out the line below to use your HTML message:
    // const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    // document.querySelector('#badResponse .shake-text h2').innerHTML = randomMessage;
   
    // Just show the response card with your original HTML message
    document.getElementById('badResponse').classList.remove('hidden');
}

function handlePositiveFeedback(rating) {
    const response = responses[rating];
    document.getElementById('thankYouMessage').textContent = response.title;
    document.getElementById('responseMessage').textContent = response.message;
    document.getElementById('positiveResponse').classList.remove('hidden');
}

function showJoke() {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    document.getElementById('jokeText').textContent = randomJoke;
    document.getElementById('jokeModal').classList.remove('hidden');
}

function closeJoke() {
    document.getElementById('jokeModal').classList.add('hidden');
}

function goHome() {
    // Reset all cards
    document.querySelectorAll('.response-card').forEach(card => {
        card.classList.add('hidden');
    });
    document.getElementById('feedbackCard').classList.remove('hidden');
   
    // Reset buttons
    document.querySelectorAll('.feedback-btn').forEach(button => {
        button.disabled = false;
        const rating = button.getAttribute('data-rating');
        const emoji = button.querySelector('.emoji').textContent;
        const text = rating.charAt(0).toUpperCase() + rating.slice(1);
        button.innerHTML = `<span class="emoji">${emoji}</span><span class="text">${text}</span>`;
    });
}

// Add export functionality to admin
window.exportFeedbackData = function() {
    FeedbackStorage.exportToCSV();
};

// Console commands for debugging
console.log(`
🎯 Feedback Form Enhanced Data Collection
========================================

Available console commands:
- FeedbackStorage.getAll() : Get all feedback data
- FeedbackStorage.exportToCSV() : Export data as CSV
- exportFeedbackData() : Export data as CSV

Configuration methods available:
1. EmailJS (email notifications)
2. Google Sheets (spreadsheet storage)  
3. Webhook (custom endpoint)
4. LocalStorage (always enabled as backup)

To configure data collection, edit the DATA_COLLECTION_CONFIG object in this file.
`);

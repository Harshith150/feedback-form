// Enhanced feedback script with positive vibes and funny responses - CROSS-PLATFORM OPTIMIZED
const responses = {
    good: {
        title: "That's what we like to hear! 🎉",
        message: "You're making our day brighter! Keep being awesome! ✨",
        gifs: [
            "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
        ]
    },
    nice: {
        title: "Nice! That's the spirit! 🌟",
        message: "Your positivity is contagious! We're smiling from ear to ear! 😄",
        gifs: [
            "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
            "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
            "https://media.giphy.com/media/l0MYGb8Q5QBhBSaEE/giphy.gif"
        ]
    },
    cool: {
        title: "Cool beans! You're absolutely right! 🚀",
        message: "We're feeling pretty cool ourselves now! Thanks for the good vibes! 🎸",
        gifs: [
            "https://media.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif",
            "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif"
        ]
    },
    awesome: {
        title: "AWESOME! You're absolutely incredible! 🎊",
        message: "We're doing happy dances over here! You've made our entire team's day! 💃🕺",
        gifs: [
            "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
            "https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif",
            "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
        ]
    }
};

// Funny celebration messages for awesome ratings
const celebrationMessages = [
    "🎉 You've unlocked our secret celebration mode! 🎉",
    "� Houston, we have AWESOMENESS! 🚀",
    "🎊 Breaking news: You're officially amazing! �",
    "✨ Our happiness meter just broke from overload! ✨",
    "🌟 You deserve a standing ovation! *clap clap clap* 🌟",
    "🎈 We're throwing a virtual party in your honor! 🎈",
    "🏆 Champion of Awesomeness award goes to... YOU! 🏆",
    "💫 You've made our developer team do happy coding dances! �"
];

// Celebration GIFs for the awesome response
const celebrationGifs = [
    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    "https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif",
    "https://media.giphy.com/media/3o7abB06u9bNzA8lu8/giphy.gif",
    "https://media.giphy.com/media/26tknCqiJrBQG6bxC/giphy.gif",
    "https://media.giphy.com/media/3o7abrH8o4HMgEAV9e/giphy.gif"
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
function gifLoaded(gifId) {
    const gif = document.getElementById(gifId);
    if (gif) {
        gif.style.display = 'block';
    }
}

function loadFallbackGif(gifId, rating) {
    const fallbackGifs = responses[rating]?.gifs || [
        'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
        'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif'
    ];
   
    const randomGif = fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
    const gif = document.getElementById(gifId);
   
    if (gif) {
        gif.src = randomGif;
        gif.onload = () => gifLoaded(gifId);
        gif.onerror = function() {
            // If all else fails, hide the gif
            gif.style.display = 'none';
        };
    }
}

// Event listeners for feedback buttons - INSTANT RESPONSE (NO LOADING STATE)
document.addEventListener('DOMContentLoaded', function() {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
   
    feedbackButtons.forEach(button => {
        // Use both click and touchend events for better mobile/Mac support
        const handleFeedbackClick = async function(event) {
            event.preventDefault(); // Prevent default behavior
            event.stopPropagation(); // Stop event bubbling
           
            const rating = this.getAttribute('data-rating');
           
            // Prevent double-clicks
            if (this.disabled) {
                return;
            }
           
            // Disable button immediately to prevent double-clicks
            this.disabled = true;
           
            try {
                // Save feedback data in background (async, doesn't block UI)
                FeedbackStorage.save(rating).catch(error => {
                    console.warn('Background save failed:', error);
                });
               
                // Hide feedback card immediately
                document.getElementById('feedbackCard').classList.add('hidden');
               
                // Show appropriate response immediately
                handleFeedbackResponse(rating);
               
            } catch (error) {
                console.error('Error processing feedback:', error);
                // Still show response even if error occurs
                document.getElementById('feedbackCard').classList.add('hidden');
                handleFeedbackResponse(rating);
            }
        };
       
        // Add both click and touch event listeners for better cross-platform support
        button.addEventListener('click', handleFeedbackClick);
        button.addEventListener('touchend', function(event) {
            // Prevent both touchend and click from firing
            event.preventDefault();
            handleFeedbackClick.call(this, event);
        });
    });
});

function handleFeedbackResponse(rating) {
    const response = responses[rating];
    const responseCard = document.getElementById(rating + 'Response');
   
    if (responseCard && response) {
        // Update message
        const messageElement = responseCard.querySelector('h2');
        if (messageElement) {
            messageElement.textContent = response.title;
        }
       
        // ADD GIF TO RESPONSE CARD - IMPROVED FOR MAC COMPATIBILITY
        addGifToResponseCard(responseCard, rating);
       
        // Show the response card
        responseCard.classList.remove('hidden');
       
        // Add some extra fun for awesome ratings
        if (rating === 'awesome') {
            setTimeout(() => {
                // Add some confetti effect or extra animation
                responseCard.classList.add('extra-celebration');
            }, 500);
        }
    }
}

// NEW FUNCTION TO ADD GIFS WITH BETTER MAC COMPATIBILITY
function addGifToResponseCard(responseCard, rating) {
    // Check if GIF already exists
    let gifContainer = responseCard.querySelector('.gif-container');
    if (!gifContainer) {
        // Create GIF container
        gifContainer = document.createElement('div');
        gifContainer.className = 'gif-container';
        gifContainer.style.cssText = `
            margin: 20px 0;
            text-align: center;
        `;
       
        // Create GIF element
        const gif = document.createElement('img');
        gif.className = 'response-gif';
        gif.style.cssText = `
            max-width: 300px;
            width: 100%;
            height: auto;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            border: 3px solid #667eea;
            margin: 10px 0;
            opacity: 0.5;
        `;
       
        // Get GIFs for this rating with Mac-friendly URLs
        const macFriendlyGifs = {
            good: [
                "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
                "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif"
            ],
            nice: [
                "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
                "https://media.giphy.com/media/3o7abspvhYHpMnHSuc/giphy.gif"
            ],
            cool: [
                "https://media.giphy.com/media/ZdlpVuyoZJfvW/giphy.gif",
                "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
            ],
            awesome: [
                "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
                "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
            ]
        };
       
        const gifs = macFriendlyGifs[rating] || macFriendlyGifs.awesome;
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        gif.src = randomGif;
       
        console.log(`Loading GIF for ${rating}: ${randomGif}`);
       
        // Enhanced error handling for Mac
        gif.onload = function() {
            console.log(`✅ GIF loaded successfully for ${rating}`);
            this.style.opacity = '1';
        };
       
        gif.onerror = function() {
            console.log(`❌ Primary GIF failed for ${rating}, trying fallback...`);
            // Try universal fallback GIFs that work on all platforms
            const universalFallbacks = [
                "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
                "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
                "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
            ];
            const fallback = universalFallbacks[Math.floor(Math.random() * universalFallbacks.length)];
            this.src = fallback;
           
            // If even fallbacks fail, show emoji
            this.onerror = function() {
                console.log(`❌ All GIFs failed for ${rating}, showing emoji fallback`);
                this.style.display = 'none';
                const emojiDiv = document.createElement('div');
                emojiDiv.style.cssText = `
                    font-size: 60px;
                    margin: 20px 0;
                    animation: bounce 1s infinite;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;
                const emojiMap = {
                    good: '👍',
                    nice: '🙂',
                    cool: '😎',
                    awesome: '🔥'
                };
                emojiDiv.textContent = emojiMap[rating] || '🎉';
                this.parentNode.appendChild(emojiDiv);
            };
        };
       
        gifContainer.appendChild(gif);
       
        // Insert after success-animation div
        const successDiv = responseCard.querySelector('.success-animation');
        if (successDiv) {
            successDiv.appendChild(gifContainer);
        }
    }
}

function showCelebration() {
    const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    const randomGif = celebrationGifs[Math.floor(Math.random() * celebrationGifs.length)];
   
    document.getElementById('celebrationText').textContent = randomMessage;
    document.getElementById('celebrationGif').src = randomGif;
    document.getElementById('celebrationModal').classList.remove('hidden');
}

function closeCelebration() {
    document.getElementById('celebrationModal').classList.add('hidden');
}

// ADD MISSING CONFETTI FUNCTION
function createConfettiEffect() {
    console.log('🎊 Creating confetti effect...');
   
    // Add animation styles for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                top: ${window.innerHeight + 20}px;
                transform: rotate(720deg) scale(0.5);
                opacity: 0;
            }
        }
        @keyframes confettiSpin {
            to {
                transform: rotate(360deg) translateY(${window.innerHeight + 20}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
   
    // Create MEGA confetti explosion - 100 pieces!
    const confettiShapes = ['●', '■', '▲', '★', '♦', '♥', '♠', '♣'];
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'];
   
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const size = Math.random() * 15 + 8; // 8-23px
            const startX = Math.random() * window.innerWidth;
            const drift = (Math.random() - 0.5) * 200; // Left/right drift
           
            confetti.textContent = shape;
            confetti.style.cssText = `
                position: fixed;
                top: -30px;
                left: ${startX}px;
                font-size: ${size}px;
                color: ${color};
                pointer-events: none;
                z-index: 10000;
                user-select: none;
                text-shadow: 0 0 6px rgba(0,0,0,0.3);
                animation: ${Math.random() > 0.5 ? 'confettiFall' : 'confettiSpin'} ${3 + Math.random() * 2}s linear forwards;
                transform: translateX(${drift}px);
            `;
           
            document.body.appendChild(confetti);
           
            // Remove confetti after animation
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 5000);
        }, i * 50); // Stagger the confetti creation
    }
   
    // Add screen shake effect for extra fun
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
   
    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(shakeStyle);
}

function goHome() {
    // Reset all cards
    document.querySelectorAll('.response-card').forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('extra-celebration');
    });
    document.getElementById('feedbackCard').classList.remove('hidden');
   
    // Reset buttons - SIMPLE RESET (no loading states to worry about)
    document.querySelectorAll('.feedback-btn').forEach(button => {
        button.disabled = false;
       
        const rating = button.getAttribute('data-rating');
        const emoji = button.querySelector('.emoji')?.textContent || getEmojiForRating(rating);
        const text = rating.charAt(0).toUpperCase() + rating.slice(1);
        button.innerHTML = `<span class="emoji">${emoji}</span><span class="text">${text}</span>`;
    });
}

// Helper function to get emoji for rating
function getEmojiForRating(rating) {
    const emojiMap = {
        good: '👍',
        nice: '🙂',
        cool: '😎',
        awesome: '🔥'
    };
    return emojiMap[rating] || '👍';
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
- testConfetti() : Test confetti effect
- testGifs() : Test GIF loading

Configuration methods available:
1. EmailJS (email notifications)
2. Google Sheets (spreadsheet storage)  
3. Webhook (custom endpoint)
4. LocalStorage (always enabled as backup)

To configure data collection, edit the DATA_COLLECTION_CONFIG object in this file.
`);

// DEBUG FUNCTIONS FOR TESTING
window.testConfetti = function() {
    console.log('🧪 Testing confetti...');
    try {
        createConfettiEffect();
        console.log('✅ Confetti test completed');
    } catch (error) {
        console.error('❌ Confetti test failed:', error);
    }
};

window.testGifs = function() {
    console.log('🧪 Testing GIF loading...');
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
    `;
   
    const testGifs = [
        "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
        "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
        "https://media.giphy.com/media/ZdlpVuyoZJfvW/giphy.gif",
        "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif"
    ];
   
    testContainer.innerHTML = `
        <h3>GIF Test</h3>
        <p>Testing GIF loading on your Mac...</p>
        <button onclick="this.parentElement.remove()">Close</button>
        <br><br>
    `;
   
    testGifs.forEach((gifUrl, index) => {
        const img = document.createElement('img');
        img.src = gifUrl;
        img.style.cssText = `
            width: 100px;
            height: 80px;
            margin: 5px;
            border: 2px solid #ddd;
            border-radius: 5px;
        `;
        img.onload = () => {
            console.log(`✅ GIF ${index + 1} loaded successfully`);
            img.style.borderColor = '#4CAF50';
        };
        img.onerror = () => {
            console.log(`❌ GIF ${index + 1} failed to load`);
            img.style.borderColor = '#f44336';
            img.alt = 'Failed';
        };
        testContainer.appendChild(img);
    });
   
    document.body.appendChild(testContainer);
};



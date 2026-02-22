// =============================================
// LANGUAGE SWITCHER
// =============================================
function changeLanguage() {
    const language = document.getElementById('languageSelector').value;
    const shayariTexts = document.querySelectorAll('.shayari-text');
    shayariTexts.forEach(text => {
        const content = text.getAttribute('data-' + language);
        if (content) text.innerHTML = content;
    });
}

// =============================================
// SPEAK / TEXT-TO-SPEECH
// =============================================
function speakShayari(button) {
    const card = button.closest('.shayari-card') || button.closest('.featured-shayari');
    const shayariText = card.querySelector('.shayari-text').innerText;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(shayariText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);

    button.innerHTML = '⏸️ Speaking...';
    button.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

    utterance.onend = function () {
        button.innerHTML = '🔊 Speak';
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };
}

// =============================================
// COPY SHAYARI
// =============================================
function copyShayari(button) {
    const card = button.closest('.shayari-card') || button.closest('.featured-shayari');
    const shayariText = card.querySelector('.shayari-text').innerText;
    const translation = card.querySelector('.shayari-translation').innerText;
    const fullText = shayariText + '\n\n' + translation + '\n\n✨ From: Bhakti Das - Best Shayari Collection';

    navigator.clipboard.writeText(fullText).then(() => {
        showNotification('✓ Shayari copied to clipboard!');
    });
}

// =============================================
// SHARE SHAYARI
// =============================================
function shareShayari(button) {
    const card = button.closest('.shayari-card') || button.closest('.featured-shayari');
    const shayariText = card.querySelector('.shayari-text').innerText;
    const translation = card.querySelector('.shayari-translation').innerText;
    const fullText = shayariText + '\n\n' + translation + '\n\n✨ Bhakti Das - Best Shayari Collection';

    if (navigator.share) {
        navigator.share({ title: 'Beautiful Shayari', text: fullText }).catch(() => copyShayari(button));
    } else {
        copyShayari(button);
    }
}

// =============================================
// SHOW NOTIFICATION
// =============================================
function showNotification(msg) {
    const notification = document.getElementById('copyNotification');
    notification.textContent = msg || '✓ Shayari copied to clipboard!';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2500);
}

// =============================================
// SCREENSHOT
// =============================================
async function takeScreenshot() {
    try {
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => { script.onload = resolve; });
        }

        const canvas = await html2canvas(document.body, {
            allowTaint: true,
            useCORS: true,
            scrollY: -window.scrollY,
            scrollX: -window.scrollX,
        });

        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bhakti-das-shayari-' + Date.now() + '.png';
            a.click();
            URL.revokeObjectURL(url);
            showNotification('📸 Screenshot saved!');
        });
    } catch (error) {
        alert('Screenshot feature requires internet connection. Please try again.');
    }
}

// =============================================
// CHATBOT
// =============================================
function toggleChatbot() {
    const chatbot = document.getElementById('chatbotContainer');
    chatbot.classList.toggle('active');
    if (chatbot.classList.contains('active')) {
        document.getElementById('chatbotInput').focus();
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, 'user');
    input.value = '';

    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 500);
}

function addChatMessage(text, type) {
    const container = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = 'chat-message ' + type;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function generateBotResponse(message) {
    const m = message.toLowerCase();

    if (m.includes('love') || m.includes('mohabbat') || m.includes('प्यार') || m.includes('प्रेम'))
        return "I found beautiful Love Shayari for you! Scroll to the ❤️ Love Shayari section to explore romantic verses.";

    if (m.includes('sad') || m.includes('dard') || m.includes('दर्द') || m.includes('दुख') || m.includes('alone'))
        return "Check out our 💔 Sad Shayari section for verses that beautifully express pain, loneliness, and heartbreak.";

    if (m.includes('motivat') || m.includes('inspire') || m.includes('success') || m.includes('हिम्मत') || m.includes('प्रेरणा'))
        return "Our 💪 Motivational Shayari section has powerful quotes from APJ Abdul Kalam, Elon Musk, Bruce Lee, and more!";

    if (m.includes('hindi') || m.includes('odia') || m.includes('english') || m.includes('language'))
        return "Change the language using the dropdown in the navigation bar! We support Hindi, Odia, and English.";

    if (m.includes('copy') || m.includes('share') || m.includes('whatsapp') || m.includes('instagram'))
        return "Each card has Copy 📋, Speak 🔊, and Share 📱 buttons. Copy saves to clipboard, Speak reads aloud, Share sends via your apps!";

    if (m.includes('screenshot') || m.includes('save') || m.includes('download'))
        return "Click the 📸 button at the bottom-left corner to screenshot and save the page!";

    if (m.includes('contact') || m.includes('email') || m.includes('reach'))
        return "Reach us at bhaktiranjandas09@gmail.com for queries, suggestions, or collaborations!";

    return "I can help you find shayari by category (Love, Sad, Motivational), change languages, or explain features. What would you like?";
}

// =============================================
// INIT: Add Speak Buttons & Scroll Animations
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    // Add speak buttons
    document.querySelectorAll('.shayari-actions').forEach(actions => {
        if (!actions.querySelector('.btn-speak')) {
            const speakBtn = document.createElement('button');
            speakBtn.className = 'btn btn-speak';
            speakBtn.onclick = function () { speakShayari(this); };
            speakBtn.innerHTML = '🔊 Speak';
            const copyBtn = actions.querySelector('.btn:not(.btn-primary)');
            copyBtn.parentNode.insertBefore(speakBtn, copyBtn.nextSibling);
        }
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.shayari-card').forEach(card => observer.observe(card));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

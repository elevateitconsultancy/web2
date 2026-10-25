document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Cache
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const tabContents = document.querySelectorAll('.tab-content');
    const navButtons = document.querySelectorAll('.nav-btn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

const consultForm = document.getElementById('consultationForm');
const formSuccessMsg = document.getElementById('formSuccessMessage');
const formErrorMsg = document.getElementById('formErrorMessage');
const submitBtn = document.getElementById('consultSubmitBtn');

if (consultForm) {
    consultForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent standard page redirect/new window

        // Show loading state on button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin"></i> Submitting Mandate...`;
        }
        if (formErrorMsg) formErrorMsg.classList.add('hidden');
        if (formSuccessMsg) formSuccessMsg.classList.add('hidden');

        const formData = new FormData(consultForm);

        try {
            const response = await fetch("https://formspree.io/f/xdeazbqv", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show the success message box above the form without hiding the form
                if (formSuccessMsg) {
                    formSuccessMsg.classList.remove('hidden');
                    // Smoothly scroll up within the panel so the success message is fully visible
                    formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Clear out the form inputs so it's fresh if they want to submit again
                consultForm.reset();

                // Restore submit button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Submit Consultation Mandate</span>`;
                }
            } else {
                const data = await response.json();
                if (formErrorMsg) {
                    formErrorMsg.textContent = data?.errors?.[0]?.message || "There was a problem submitting your form. Please try again.";
                    formErrorMsg.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Submit Consultation Mandate</span>`;
                }
            }
        } catch (error) {
            if (formErrorMsg) {
                formErrorMsg.textContent = "Network error. Please check your connection and try again.";
                formErrorMsg.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Submit Consultation Mandate</span>`;
            }
        }
    });
}


    // --- Tab Switching Logic ---
    function switchTab(tabId) {
        tabContents.forEach(content => content.classList.add('hidden'));
        navButtons.forEach(btn => btn.classList.remove('active-tab'));

        const targetTab = document.getElementById(`tab-${tabId}`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }

        const activeNav = document.getElementById(`nav-${tabId}`);
        if (activeNav) {
            activeNav.classList.add('active-tab');
        }

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Mobile Menu Toggle ---
    function toggleMobileMenu() {
        if (!mobileMenu || !menuIcon) return;
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    }

    // --- Service Specific Pre-fill ---
    function requestSpecificService(serviceName) {
        switchTab('consultation');
        const serviceSelect = document.getElementById('consultService');
        if (serviceSelect) {
            serviceSelect.value = serviceName;
        }
    }

    // --- Chatbot Window Toggle & Messaging ---
    function toggleChatbot() {
        if (!chatbotWindow) return;
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden') && chatInput) {
            chatInput.focus();
        }
    }

    function sendChatMessage() {
        if (!chatInput || !chatMessages) return;
        const msg = chatInput.value.trim();
        if (!msg) return;

        // User Bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'bg-brand-gold/10 border border-brand-gold/30 text-white p-3 rounded-xl ml-auto max-w-[85%]';
        userBubble.innerText = msg;
        chatMessages.appendChild(userBubble);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Bot Response Simulation
        setTimeout(() => {
            const botBubble = document.createElement('div');
            botBubble.className = 'bg-brand-800/60 p-3 rounded-xl border border-slate-700/60 max-w-[85%]';
            botBubble.innerHTML = `Thank you for your inquiry. Your query has been logged and our partner team will review it shortly. For immediate escalation, please email <a href="mailto:elevateitconsultancy@gmail.com" class="text-brand-gold underline font-mono">elevateitconsultancy@gmail.com</a> or use our WhatsApp direct link below.`;
            chatMessages.appendChild(botBubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);	
    }

    // --- Global Event Delegation (Replaces inline onclick attributes) ---
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action], [data-service], [data-tab]');
        if (!target) return;

        // Tab Switching
        if (target.dataset.tab) {
            switchTab(target.dataset.tab);
        }

        // Actions (e.g. toggle mobile menu, toggle chatbot)
        if (target.dataset.action === 'toggle-mobile-menu') {
            toggleMobileMenu();
        }
        if (target.dataset.action === 'toggle-chatbot') {
            toggleChatbot();
        }
        if (target.dataset.action === 'send-chat-message') {
            sendChatMessage();
        }

        // Service Pre-fills
        if (target.dataset.service) {
            requestSpecificService(target.dataset.service);
        }
    });

    // Chat Enter Key Listener
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Initialize default tab
    switchTab('home');
});
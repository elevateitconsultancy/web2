// Tailwind Configuration
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    darkBg: '#090D16',
                    cardBg: '#0F1524',
                    cardBorder: '#1E293B',
                    amberAccent: '#F59E0B',
                    btnBg: '#1C2638',
                    btnHover: '#2A3852',
                    slateTheme: {
                        50: '#f7f9f9',
                        100: '#eef2f2',
                        200: '#d9e2e2',
                        500: '#526662',
                        700: '#40514e',
                        800: '#344341',
                        900: '#263331'
                    }
                },
                fontFamily: {
                    sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    serif: ['Lora', 'Georgia', 'serif'],
                    cinzel: ['Cinzel', 'serif']
                }
            }
        }
    };
}

// Smooth scroll to section helper
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// View Switchers
function showMainPage() {
    ['itServicesView', 'taxServicesView', 'marketingServicesView', 'eventTrainingServicesView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const main = document.getElementById('mainView');
    if (main) main.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchServiceView(targetId) {
    ['mainView', 'itServicesView', 'taxServicesView', 'marketingServicesView', 'eventTrainingServicesView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(targetId);
    if (target) target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showItServicesPage() { switchServiceView('itServicesView'); }
function showTaxServicesPage() { switchServiceView('taxServicesView'); }
function showMarketingServicesPage() { switchServiceView('marketingServicesView'); }
function showEventTrainingServicesPage() { switchServiceView('eventTrainingServicesView'); }

// Mandate / Package Inquiry Helpers
function requestInquiry(prefix, itemName) {
    showMainPage();
    scrollToSection('contact');
    const msgInput = document.getElementById('contactMessage');
    if (msgInput) {
        msgInput.value = `${prefix}: ${itemName}.`;
    }
}

function requestMandate(serviceName) {
    requestInquiry('I would like to request a consultation regarding the IT mandate', serviceName);
}

function requestTaxBundle(packageName) {
    requestInquiry('I would like to inquire about the Accounting & Bookkeeping tax package', packageName);
}

function requestMarketingBundle(packageName) {
    requestInquiry('I would like to inquire about the Digital Marketing package', packageName);
}

function requestEventTrainingBundle(packageName) {
    requestInquiry('I would like to inquire about the Event Management & Training package', packageName);
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.add('hidden');
}

// Chatbot Toggle & Interactions (XSS-safe using textContent)
function toggleChatbot() {
    const win = document.getElementById('chatbotWindow');
    if (!win) return;
    win.classList.toggle('hidden');
    if (!win.classList.contains('hidden')) {
        document.getElementById('chatInput').focus();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatMessages = document.getElementById('chatMessages');

    const userBubble = document.createElement('div');
    userBubble.className = 'bg-slateTheme-700 text-white p-2.5 rounded-none ml-auto max-w-[85%] shadow-xs';
    userBubble.textContent = msg;
    chatMessages.appendChild(userBubble);

    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'bg-white p-2.5 border border-gray-200 text-gray-700 max-w-[85%] shadow-xs';
        
        const text1 = document.createTextNode('Thank you for your message regarding "');
        const em = document.createElement('em');
        em.textContent = msg;
        const text2 = document.createTextNode('". Our team in Ajman, UAE will gladly assist. You may also contact us directly at ');
        const link = document.createElement('a');
        link.href = 'mailto:elevateglobalconsultservices@gmail.com';
        link.className = 'text-slateTheme-700 underline font-mono';
        link.textContent = 'elevateglobalconsultservices@gmail.com';

        botBubble.append(text1, em, text2, link, document.createTextNode('.'));
        chatMessages.appendChild(botBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

// Formspree Initialization
window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
formspree('initForm', { formElement: '#contactForm', formId: 'xoedqapz' });

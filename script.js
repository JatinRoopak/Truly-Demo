let userCredits = 0;
let userEmail = "Not Connected";

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active-tab');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
        el.style.backgroundColor = '#fff';
        el.style.color = '#111';
        el.style.borderColor = '#000';
    });
    
    document.getElementById(`tab-${tabId}`).classList.add('active-tab');
    const activeBtn = document.getElementById(`btn-${tabId}`);
    activeBtn.classList.add('active');
    
    // Highlight active tab specially if it's enterprise
    if(tabId === 'enterprise') {
        activeBtn.style.backgroundColor = 'var(--neon-green)';
        activeBtn.style.color = '#111';
        
        // Update Logo
        document.getElementById('logo-text').innerText = 'TRULY BUSINESS.';
        document.getElementById('main-logo').style.transform = 'rotate(0deg)';
        document.getElementById('main-logo').style.boxShadow = '6px 6px 0 var(--bright-blue)';
    } else {
        activeBtn.style.backgroundColor = 'var(--bright-blue)';
        activeBtn.style.color = '#fff';
        
        // Reset Logo
        document.getElementById('logo-text').innerText = 'TRULY.';
        document.getElementById('main-logo').style.transform = 'rotate(-3deg)';
        document.getElementById('main-logo').style.boxShadow = '6px 6px 0 var(--hot-pink)';
        
        // Reset enterprise sub-views if we switch out
        closeEmpMailbox();
    }

    if(tabId === 'compose') {
        showComposeInbox();
    }
}

// Enterprise Tab specific functions
function openEmpMailbox(empName, dept) {
    document.getElementById('ent-dashboard').classList.add('hidden');
    document.getElementById('ent-dashboard').classList.remove('flex');
    document.getElementById('ent-mailbox').classList.remove('hidden');
    document.getElementById('ent-mailbox').classList.add('flex');
    document.getElementById('emp-mail-name').innerText = `${empName} (${dept})`;
}

function closeEmpMailbox() {
    document.getElementById('ent-dashboard').classList.remove('hidden');
    document.getElementById('ent-dashboard').classList.add('flex');
    document.getElementById('ent-mailbox').classList.add('hidden');
    document.getElementById('ent-mailbox').classList.remove('flex');
}

// Compose Tab specific functions
function showComposeInbox() {
    document.getElementById('compose-inbox-view').classList.remove('hidden');
    document.getElementById('compose-inbox-view').classList.add('flex');
    document.getElementById('compose-reply-view').classList.add('hidden');
    document.getElementById('compose-reply-view').classList.remove('flex');
    document.getElementById('compose-new-view').classList.add('hidden');
    document.getElementById('compose-new-view').classList.remove('flex');
}

function showComposeReply() {
    document.getElementById('compose-inbox-view').classList.add('hidden');
    document.getElementById('compose-inbox-view').classList.remove('flex');
    document.getElementById('compose-reply-view').classList.remove('hidden');
    document.getElementById('compose-reply-view').classList.add('flex');
    document.getElementById('compose-new-view').classList.add('hidden');
    document.getElementById('compose-new-view').classList.remove('flex');
}

function showComposeNew() {
    document.getElementById('compose-inbox-view').classList.add('hidden');
    document.getElementById('compose-inbox-view').classList.remove('flex');
    document.getElementById('compose-reply-view').classList.add('hidden');
    document.getElementById('compose-reply-view').classList.remove('flex');
    document.getElementById('compose-new-view').classList.remove('hidden');
    document.getElementById('compose-new-view').classList.add('flex');
}

// Recipient Tab Logic
function triggerRecipientUnlock() {
    document.getElementById('recipientBiometricModal').classList.remove('hidden');
    document.getElementById('recipientBiometricModal').classList.add('flex');
    
    document.getElementById('recip-bio-selection').classList.remove('hidden');
    document.getElementById('recip-bio-selection').classList.add('flex');
    document.getElementById('recip-bio-scanning').classList.add('hidden');
    document.getElementById('recip-bio-scanning').classList.remove('flex');
}

function closeRecipientBiometricModal() {
    document.getElementById('recipientBiometricModal').classList.add('hidden');
    document.getElementById('recipientBiometricModal').classList.remove('flex');
}

function simulateRecipientScan(type) {
    document.getElementById('recip-bio-selection').classList.add('hidden');
    document.getElementById('recip-bio-selection').classList.remove('flex');
    document.getElementById('recip-bio-scanning').classList.remove('hidden');
    document.getElementById('recip-bio-scanning').classList.add('flex');
    
    const iconEl = document.getElementById('recip-scan-icon');
    if(type === 'face') iconEl.innerHTML = '🙂';
    else if(type === 'pin') iconEl.innerHTML = '🔢';
    else iconEl.innerHTML = '👆';

    setTimeout(() => {
        closeRecipientBiometricModal();
        showRecipientEmail();
    }, 1500);
}

function showRecipientEmail() {
    document.getElementById('recipient-inbox-list').classList.add('hidden');
    document.getElementById('recipient-inbox-list').classList.remove('flex');
    document.getElementById('recipient-email-view').classList.remove('hidden');
    document.getElementById('recipient-email-view').classList.add('flex');
}

function backToRecipientInbox() {
    document.getElementById('recipient-email-view').classList.add('hidden');
    document.getElementById('recipient-email-view').classList.remove('flex');
    document.getElementById('recipient-inbox-list').classList.remove('hidden');
    document.getElementById('recipient-inbox-list').classList.add('flex');
}

// Hold to Send Logic (Bound to all .hold-btn elements)
let holdTimer;
let progress = 0;
const HOLD_DURATION = 1500; 
const UPDATE_INTERVAL = 20; 
let isHolding = false;
let currentBtn = null;

function startHold(e) {
    if(e && e.type === 'touchstart') e.preventDefault();
    
    // Always allow in Enterprise tab for demo, otherwise check quotas
    const inEnterprise = document.getElementById('tab-enterprise').classList.contains('active-tab');
    if (!inEnterprise && userCredits <= 0) {
        document.getElementById('quotaModal').classList.remove('hidden');
        document.getElementById('quotaModal').classList.add('flex');
        return;
    }

    isHolding = true;
    currentBtn = e.currentTarget;
    currentBtn.classList.add('active-press');
    
    const progressEl = currentBtn.querySelector('.hold-progress');
    const textEl = currentBtn.querySelector('.hold-text');
    
    holdTimer = setInterval(() => {
        progress += (UPDATE_INTERVAL / HOLD_DURATION) * 100;
        if(progressEl) progressEl.style.width = `${Math.min(progress, 100)}%`;
        
        if(progress > 50 && textEl) {
            textEl.style.textShadow = `0 0 ${progress/5}px white`;
        }

        if (progress >= 100) {
            clearInterval(holdTimer);
            isHolding = false;
            currentBtn.classList.remove('active-press');
            openBiometricModal();
            resetHold();
        }
    }, UPDATE_INTERVAL);
}

function cancelHold() {
    if (isHolding) {
        clearInterval(holdTimer);
        isHolding = false;
        if(currentBtn) currentBtn.classList.remove('active-press');
        resetHold();
    }
}

function resetHold() {
    progress = 0;
    if(currentBtn) {
        const progressEl = currentBtn.querySelector('.hold-progress');
        const textEl = currentBtn.querySelector('.hold-text');
        if(progressEl) progressEl.style.width = '0%';
        if(textEl) textEl.style.textShadow = '2px 2px 0px #000';
    }
    currentBtn = null;
}

// Bind all hold buttons globally
function bindHoldButtons() {
    document.querySelectorAll('.hold-btn').forEach(btn => {
        btn.removeEventListener('mousedown', startHold);
        btn.removeEventListener('mouseup', cancelHold);
        btn.removeEventListener('mouseleave', cancelHold);
        btn.removeEventListener('touchstart', startHold);
        btn.removeEventListener('touchend', cancelHold);
        btn.removeEventListener('touchcancel', cancelHold);
        
        btn.addEventListener('mousedown', startHold);
        btn.addEventListener('mouseup', cancelHold);
        btn.addEventListener('mouseleave', cancelHold);
        btn.addEventListener('touchstart', startHold, {passive: false});
        btn.addEventListener('touchend', cancelHold);
        btn.addEventListener('touchcancel', cancelHold);
    });
}

// Initial bind
bindHoldButtons();

// Biometrics and Overlays
function openBiometricModal() {
    document.getElementById('bio-selection').classList.remove('hidden');
    document.getElementById('bio-scanning').classList.add('hidden');
    
    const biometricModal = document.getElementById('biometricModal');
    biometricModal.classList.remove('hidden');
    biometricModal.classList.add('flex');
}

function startBiometricScan(type) {
    document.getElementById('bio-selection').classList.add('hidden');
    document.getElementById('bio-scanning').classList.remove('hidden');
    
    const iconEl = document.getElementById('scan-icon');
    if(type === 'face') {
        iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
        iconEl.classList.remove('text-gray-400');
        iconEl.classList.add('text-[var(--hot-pink)]');
    } else {
        iconEl.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>';
        iconEl.classList.remove('text-[var(--hot-pink)]');
        iconEl.classList.add('text-gray-400');
    }

    setTimeout(() => {
        simulateSuccess();
    }, 1800);
}

function openAILimitsModal(e) {
    e.preventDefault();
    const aiModal = document.getElementById('aiLimitsModal');
    aiModal.classList.remove('hidden');
    aiModal.classList.add('flex');
}

function closeModals() {
    const biometricModal = document.getElementById('biometricModal');
    biometricModal.classList.add('hidden');
    biometricModal.classList.remove('flex');
    
    const verificationModal = document.getElementById('verificationModal');
    verificationModal.classList.add('hidden');
    verificationModal.classList.remove('flex');
    
    const aiModal = document.getElementById('aiLimitsModal');
    if(aiModal) {
        aiModal.classList.add('hidden');
        aiModal.classList.remove('flex');
    }
}

function simulateSuccess() {
    const inEnterprise = document.getElementById('tab-enterprise').classList.contains('active-tab');
    if (!inEnterprise && userCredits > 0) {
        userCredits--;
        updateIdTabUI();
    }

    closeModals();
    const successOverlay = document.getElementById('successOverlay');

    successOverlay.classList.remove('hidden');
    successOverlay.classList.add('flex');
    
    setTimeout(() => {
        successOverlay.classList.add('hidden');
        successOverlay.classList.remove('flex');
        
        // If in enterprise mode, simulate returning to dashboard rather than switching tab entirely
        if (inEnterprise) {
            closeEmpMailbox();
        } else {
            switchTab('inbox');
        }
    }, 1600); 
}

function openVerificationModal() {
    const verificationModal = document.getElementById('verificationModal');
    verificationModal.classList.remove('hidden');
    verificationModal.classList.add('flex');
}

function showProviders() {
    document.getElementById('setup-step-1').classList.add('hidden');
    document.getElementById('setup-step-1').classList.remove('flex');
    
    document.getElementById('setup-step-2').classList.remove('hidden');
    document.getElementById('setup-step-2').classList.add('flex');
}

function goBackToStep1() {
    document.getElementById('setup-step-2').classList.add('hidden');
    document.getElementById('setup-step-2').classList.remove('flex');
    
    document.getElementById('setup-step-1').classList.remove('hidden');
    document.getElementById('setup-step-1').classList.add('flex');
}

function connectProvider(providerName) {
    document.getElementById('setup-step-2').classList.add('hidden');
    document.getElementById('setup-step-2').classList.remove('flex');
    
    document.getElementById('setup-step-3').classList.remove('hidden');
    document.getElementById('setup-step-3').classList.add('flex');
    
    let domain = "domain.com";
    if(providerName === 'Gmail') domain = "gmail.com";
    if(providerName === 'Outlook') domain = "outlook.com";
    userEmail = `alex.sharma@${domain}`;
    
    document.getElementById('connected-provider-text').innerText = userEmail;
    
    userCredits = 2;
    updateIdTabUI();
}

function updateIdTabUI() {
    document.getElementById('id-connected-email').innerText = userEmail;
    document.getElementById('id-credit-balance').innerText = userCredits;
}

function closeQuotaAndGoToID() {
    document.getElementById('quotaModal').classList.add('hidden');
    document.getElementById('quotaModal').classList.remove('flex');
    switchTab('id');
}

function sendNormally() {
    document.getElementById('quotaModal').classList.add('hidden');
    document.getElementById('quotaModal').classList.remove('flex');
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-[100] text-sm';
    toast.innerText = 'Message sent normally (unverified).';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
    
    showComposeInbox();
}

function buyCredit() {
    userCredits++;
    updateIdTabUI();
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-[var(--neon-green)] px-6 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0_0_#000] z-[100] font-black uppercase text-sm';
    toast.innerText = 'Micro-Pass Purchased: +1 Verification';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function buyBulk() {
    userCredits += 150;
    updateIdTabUI();
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-[var(--bright-blue)] text-white px-6 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0_0_#000] z-[100] font-black uppercase text-sm';
    toast.innerText = 'Power Pass Activated: +150 Verifications!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Initialize App on the Intro Landing Tab
userCredits = 2;
updateIdTabUI();
switchTab('intro');
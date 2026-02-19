/* ================================
   STAYGENIE — Interactive Notes & Feature Validation
   Firebase Real-Time Sync
   ================================ */

// ========================
// Firebase Configuration
// ========================
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfb6yVmmQ5WVHVxd_K4scF2xBw4iWojHM",
    authDomain: "staygenie-notes.firebaseapp.com",
    databaseURL: "https://staygenie-notes-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "staygenie-notes",
    storageBucket: "staygenie-notes.firebasestorage.app",
    messagingSenderId: "596708147424",
    appId: "1:596708147424:web:2a8de20e29dfd9a90ad085"
};

let db = null;
let firebaseReady = false;

function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded — running in offline mode (localStorage)');
            return;
        }
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        firebaseReady = true;
        console.log('✅ Firebase connected — notes sync in real-time');
    } catch (e) {
        console.warn('Firebase init failed — running in offline mode', e);
    }
}

// ========================
// Storage Layer (Firebase + localStorage fallback)
// ========================
const Storage = {
    write(path, data) {
        if (firebaseReady) {
            db.ref(path).set(data);
        }
        localStorage.setItem('sg_' + path.replace(/\//g, '_'), JSON.stringify(data));
    },

    push(path, data) {
        if (firebaseReady) {
            return db.ref(path).push(data).key;
        }
        const items = JSON.parse(localStorage.getItem('sg_' + path.replace(/\//g, '_')) || '{}');
        const key = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        items[key] = data;
        localStorage.setItem('sg_' + path.replace(/\//g, '_'), JSON.stringify(items));
        return key;
    },

    remove(path) {
        if (firebaseReady) {
            db.ref(path).remove();
        }
        // For local, parse parent path
        const parts = path.split('/');
        const key = parts.pop();
        const parentPath = 'sg_' + parts.join('_');
        const items = JSON.parse(localStorage.getItem(parentPath) || '{}');
        delete items[key];
        localStorage.setItem(parentPath, JSON.stringify(items));
    },

    listen(path, callback) {
        if (firebaseReady) {
            db.ref(path).on('value', snap => {
                callback(snap.val() || {});
            });
        } else {
            // Offline fallback — just load once
            const data = JSON.parse(localStorage.getItem('sg_' + path.replace(/\//g, '_')) || '{}');
            callback(data);
        }
    },

    update(path, data) {
        if (firebaseReady) {
            db.ref(path).update(data);
        }
        const localKey = 'sg_' + path.replace(/\//g, '_');
        const existing = JSON.parse(localStorage.getItem(localKey) || '{}');
        Object.assign(existing, data);
        localStorage.setItem(localKey, JSON.stringify(existing));
    }
};

// ========================
// Author Management
// ========================
const AuthorManager = {
    get() {
        return localStorage.getItem('sg_author') || 'Student';
    },
    set(name) {
        localStorage.setItem('sg_author', name);
        document.querySelectorAll('.author-toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.author === name);
        });
    }
};

// ========================
// Notes Manager
// ========================
const NotesManager = {
    statusOrder: ['new', 'in-progress', 'done'],
    statusLabels: { 'new': '🆕 New', 'in-progress': '🔄 In Progress', 'done': '✅ Done' },
    statusColors: { 'new': '#6366f1', 'in-progress': '#f59e0b', 'done': '#10b981' },

    init() {
        const sections = ['problem', 'positioning', 'competitors', 'personas', 'ai-engines', 'impact', 'roadmap'];
        sections.forEach(sectionId => {
            Storage.listen(`notes/${sectionId}`, (notes) => {
                this.render(sectionId, notes);
                this.updateGlobalCount();
            });
        });
    },

    add(sectionId) {
        const input = document.getElementById(`note-input-${sectionId}`);
        const text = input.value.trim();
        if (!text) return;

        const note = {
            author: AuthorManager.get(),
            text: text,
            status: 'new',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };

        Storage.push(`notes/${sectionId}`, note);
        input.value = '';

        // If offline, re-render
        if (!firebaseReady) {
            const data = JSON.parse(localStorage.getItem('sg_notes_' + sectionId) || '{}');
            this.render(sectionId, data);
            this.updateGlobalCount();
        }
    },

    toggleStatus(sectionId, noteId, currentStatus) {
        const idx = this.statusOrder.indexOf(currentStatus);
        const next = this.statusOrder[(idx + 1) % this.statusOrder.length];
        Storage.update(`notes/${sectionId}/${noteId}`, { status: next });

        if (!firebaseReady) {
            const data = JSON.parse(localStorage.getItem('sg_notes_' + sectionId) || '{}');
            if (data[noteId]) data[noteId].status = next;
            localStorage.setItem('sg_notes_' + sectionId, JSON.stringify(data));
            this.render(sectionId, data);
            this.updateGlobalCount();
        }
    },

    delete(sectionId, noteId) {
        Storage.remove(`notes/${sectionId}/${noteId}`);

        if (!firebaseReady) {
            const data = JSON.parse(localStorage.getItem('sg_notes_' + sectionId) || '{}');
            delete data[noteId];
            localStorage.setItem('sg_notes_' + sectionId, JSON.stringify(data));
            this.render(sectionId, data);
            this.updateGlobalCount();
        }
    },

    render(sectionId, notes) {
        const container = document.getElementById(`notes-list-${sectionId}`);
        if (!container) return;

        const noteEntries = Object.entries(notes || {}).sort((a, b) =>
            new Date(b[1].timestamp) - new Date(a[1].timestamp)
        );

        const count = document.getElementById(`notes-count-${sectionId}`);
        if (count) count.textContent = noteEntries.length;

        if (noteEntries.length === 0) {
            container.innerHTML = '<div class="notes-empty">No notes yet — add one above!</div>';
            return;
        }

        container.innerHTML = noteEntries.map(([id, note]) => `
            <div class="note-card" data-status="${note.status}">
                <div class="note-header">
                    <span class="note-author" style="background: ${note.author === 'Student' ? 'rgba(99,102,241,0.2); color:#a5b4fc' : 'rgba(236,72,153,0.2); color:#f9a8d4'}">
                        ${note.author === 'Student' ? '👨‍💻' : '👤'} ${note.author}
                    </span>
                    <span class="note-time">${note.date || ''} ${note.time || ''}</span>
                </div>
                <div class="note-text">${this.escapeHtml(note.text)}</div>
                <div class="note-footer">
                    <button class="note-status-btn" style="background: ${this.statusColors[note.status]}22; color: ${this.statusColors[note.status]}; border-color: ${this.statusColors[note.status]}44"
                        onclick="NotesManager.toggleStatus('${sectionId}', '${id}', '${note.status}')">
                        ${this.statusLabels[note.status]}
                    </button>
                    <button class="note-delete-btn" onclick="NotesManager.delete('${sectionId}', '${id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    updateGlobalCount() {
        const sections = ['problem', 'positioning', 'competitors', 'personas', 'ai-engines', 'impact', 'roadmap'];
        let total = 0, pending = 0, done = 0;

        sections.forEach(sectionId => {
            const data = JSON.parse(localStorage.getItem('sg_notes_' + sectionId) || '{}');
            Object.values(data).forEach(note => {
                total++;
                if (note.status === 'done') done++;
                else pending++;
            });
        });

        const el = document.getElementById('notes-global-count');
        if (el) {
            el.innerHTML = `📝 <strong>${total}</strong> notes · <span style="color:#f59e0b">${pending} pending</span> · <span style="color:#10b981">${done} done</span>`;
        }
    }
};

// ========================
// Feature Validation Board
// ========================
const FeatureBoard = {
    features: [
        // AI Engines
        { id: 'ai-advisor', category: 'AI Engines', name: 'Proactive AI Advisor (Darija/FR/EN)', desc: 'Conversational AI that anticipates needs' },
        { id: 'subsidy-engine', category: 'AI Engines', name: 'Subsidy Eligibility Engine', desc: 'Auto-check Daam Sakane & FOGARIM eligibility' },
        { id: 'investment-ai', category: 'AI Engines', name: 'Investment Analysis AI', desc: 'ROI, yield, cash flow calculations' },
        { id: 'smart-matching', category: 'AI Engines', name: 'Smart Matching Engine', desc: 'Semantic property-user matching' },
        { id: 'trust-scoring', category: 'AI Engines', name: 'Trust & Risk Scoring', desc: 'Fraud prevention, landlord/tenant scoring' },
        { id: 'property-mgmt', category: 'AI Engines', name: 'Property Management AI', desc: 'Auto-comms, rent collection, maintenance' },
        // User Features
        { id: 'renter-search', category: 'User Features', name: 'Renter Search & Match', desc: 'AI-powered apartment search for renters' },
        { id: 'owner-dashboard', category: 'User Features', name: 'Owner Dashboard', desc: 'Revenue, occupancy, tenant management' },
        { id: 'investor-tools', category: 'User Features', name: 'Investor Portfolio Tools', desc: 'Investment analysis, market trends' },
        { id: 'contract-intel', category: 'User Features', name: 'Contract Intelligence', desc: 'AI clause analysis, legal compliance' },
        { id: 'mortgage-compare', category: 'User Features', name: 'Mortgage Comparison', desc: 'Compare rates across Moroccan banks' },
        { id: 'agency-portal', category: 'User Features', name: 'Agency Multi-Client Portal', desc: 'White-label management for agencies' },
        // Platform
        { id: 'whatsapp-bot', category: 'Platform', name: 'WhatsApp Bot Integration', desc: 'AI advisor via WhatsApp' },
        { id: 'voice-darija', category: 'Platform', name: 'Voice AI in Darija', desc: 'Voice-based property search' },
        { id: 'mobile-apps', category: 'Platform', name: 'Mobile Apps (iOS/Android)', desc: 'Native mobile apps' },
        { id: 'multi-city', category: 'Platform', name: 'Multi-City (Rabat, Marrakech)', desc: 'Expansion beyond Casablanca' },
    ],

    priorities: { 'must': '✅ Must Have', 'nice': '💡 Nice to Have', 'not': '❌ Not Needed', 'unset': '⬜ Not Voted' },
    priorityColors: { 'must': '#10b981', 'nice': '#f59e0b', 'not': '#ef4444', 'unset': '#64748b' },

    init() {
        Storage.listen('features', (votes) => {
            this.render(votes);
        });
    },

    vote(featureId, priority) {
        const author = AuthorManager.get();
        Storage.update(`features/${featureId}`, { [author]: priority });

        if (!firebaseReady) {
            const data = JSON.parse(localStorage.getItem('sg_features') || '{}');
            if (!data[featureId]) data[featureId] = {};
            data[featureId][author] = priority;
            localStorage.setItem('sg_features', JSON.stringify(data));
            this.render(data);
        }
    },

    render(votes) {
        const container = document.getElementById('feature-board-list');
        if (!container) return;

        const categories = [...new Set(this.features.map(f => f.category))];
        let html = '';

        categories.forEach(cat => {
            html += `<div class="fb-category"><h4 class="fb-category-title">${cat === 'AI Engines' ? '🤖' : cat === 'User Features' ? '👥' : '📱'} ${cat}</h4>`;

            this.features.filter(f => f.category === cat).forEach(feature => {
                const featureVotes = (votes && votes[feature.id]) || {};
                const hamzaVote = featureVotes['Student'] || 'unset';
                const stakeholderVote = featureVotes['Stakeholder'] || 'unset';

                html += `
                <div class="fb-feature">
                    <div class="fb-feature-info">
                        <div class="fb-feature-name">${feature.name}</div>
                        <div class="fb-feature-desc">${feature.desc}</div>
                    </div>
                    <div class="fb-votes">
                        <div class="fb-vote-col">
                            <span class="fb-vote-label">Student</span>
                            <span class="fb-vote-badge" style="background: ${this.priorityColors[hamzaVote]}22; color: ${this.priorityColors[hamzaVote]}; border-color: ${this.priorityColors[hamzaVote]}44">
                                ${this.priorities[hamzaVote]}
                            </span>
                        </div>
                        <div class="fb-vote-col">
                            <span class="fb-vote-label">Stakeholder</span>
                            <span class="fb-vote-badge" style="background: ${this.priorityColors[stakeholderVote]}22; color: ${this.priorityColors[stakeholderVote]}; border-color: ${this.priorityColors[stakeholderVote]}44">
                                ${this.priorities[stakeholderVote]}
                            </span>
                        </div>
                    </div>
                    <div class="fb-actions">
                        <button class="fb-btn fb-must ${this.getActiveVoteClass(feature.id, 'must', votes)}" onclick="FeatureBoard.vote('${feature.id}', 'must')">✅</button>
                        <button class="fb-btn fb-nice ${this.getActiveVoteClass(feature.id, 'nice', votes)}" onclick="FeatureBoard.vote('${feature.id}', 'nice')">💡</button>
                        <button class="fb-btn fb-not ${this.getActiveVoteClass(feature.id, 'not', votes)}" onclick="FeatureBoard.vote('${feature.id}', 'not')">❌</button>
                    </div>
                </div>`;
            });

            html += '</div>';
        });

        // Summary
        let mustCount = 0, niceCount = 0, notCount = 0, unsetCount = 0;
        this.features.forEach(f => {
            const v = votes && votes[f.id];
            const combined = v ? (v['Stakeholder'] || v['Student'] || 'unset') : 'unset';
            if (combined === 'must') mustCount++;
            else if (combined === 'nice') niceCount++;
            else if (combined === 'not') notCount++;
            else unsetCount++;
        });

        const summary = document.getElementById('feature-summary');
        if (summary) {
            summary.innerHTML = `
                <span class="fs-item" style="color:#10b981">✅ ${mustCount} Must Have</span>
                <span class="fs-item" style="color:#f59e0b">💡 ${niceCount} Nice to Have</span>
                <span class="fs-item" style="color:#ef4444">❌ ${notCount} Not Needed</span>
                <span class="fs-item" style="color:#64748b">⬜ ${unsetCount} Unvoted</span>
            `;
        }

        container.innerHTML = html;
    },

    getActiveVoteClass(featureId, priority, votes) {
        const author = AuthorManager.get();
        const v = votes && votes[featureId];
        return (v && v[author] === priority) ? 'fb-btn-active' : '';
    }
};

// ========================
// Toggle Notes Panel
// ========================
function toggleNotesPanel(sectionId) {
    const panel = document.getElementById(`notes-panel-${sectionId}`);
    const toggle = document.getElementById(`notes-toggle-${sectionId}`);
    if (!panel) return;
    panel.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
}

// ========================
// Initialize Everything
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();

    // Set default author
    const currentAuthor = AuthorManager.get();
    document.querySelectorAll('.author-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.author === currentAuthor);
        btn.addEventListener('click', () => AuthorManager.set(btn.dataset.author));
    });

    // Handle Enter key in note inputs
    document.querySelectorAll('.note-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const sectionId = input.id.replace('note-input-', '');
                NotesManager.add(sectionId);
            }
        });
    });

    // Init managers
    NotesManager.init();
    FeatureBoard.init();
});

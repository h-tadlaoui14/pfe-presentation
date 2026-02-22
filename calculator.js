/* ================================
   STAYGENIE — Subsidy Estimator Logic
   ================================ */

const SubsidyCalculator = {
    init() {
        const inputs = ['property-price', 'monthly-income', 'first-buyer'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.calculate());
                el.addEventListener('change', () => this.calculate());
            }
        });
        this.calculate();
    },

    calculate() {
        const price = parseFloat(document.getElementById('property-price').value) || 0;
        const income = parseFloat(document.getElementById('monthly-income').value) || 0;
        const isFirstBuyer = document.getElementById('first-buyer').value === 'yes';

        const resultAmount = document.getElementById('subsidy-result-amount');
        const resultExpl = document.getElementById('subsidy-result-expl');
        const badge = document.getElementById('subsidy-badge');

        if (!isFirstBuyer) {
            this.setResult(0, "<strong>Daam Sakane</strong> is reserved for first-time homebuyers for their primary residence.", "Not Eligible");
            return;
        }

        let amount = 0;
        let explanation = "";
        let badgeText = "Eligible";

        if (price > 0 && price <= 300000) {
            amount = 100000;
            explanation = "As the property price is <strong>≤ 300,000 MAD</strong>, you are eligible for the maximum direct aid of 100,000 MAD.";
        } else if (price > 300000 && price <= 700000) {
            amount = 700000; // Wait, aid is 70k, not 700k
            amount = 70000;
            explanation = "For properties between <strong>300,000 and 700,000 MAD</strong>, you are eligible for 70,000 MAD in direct government aid.";
        } else if (price > 700000) {
            amount = 0;
            explanation = "Properties above <strong>700,000 MAD</strong> currently do not qualify for the Daam Sakane direct aid program.";
            badgeText = "Exceeds Limit";
        } else {
            explanation = "Enter a property price to see your estimated aid.";
        }

        // FOGARIM check for low income/irregular
        if (price > 0 && price <= 250000 && income <= 6000) {
            explanation += " <br><br>🛡️ Additionally, you may qualify for <strong>FOGARIM</strong> (70% loan guarantee) due to your income level.";
        }

        this.setResult(amount, explanation, badgeText);
    },

    setResult(amount, expl, badgeText) {
        const amountEl = document.getElementById('subsidy-result-amount');
        const explEl = document.getElementById('subsidy-result-expl');
        const badgeEl = document.getElementById('subsidy-badge');

        if (amountEl) {
            amountEl.textContent = amount.toLocaleString() + ' MAD';
            amountEl.style.color = amount > 0 ? 'var(--success)' : 'var(--text-dim)';
        }
        if (explEl) explEl.innerHTML = expl;
        if (badgeEl) {
            badgeEl.textContent = badgeText;
            badgeEl.style.background = amount > 0 ? 'var(--success)' : 'var(--border)';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SubsidyCalculator.init();
});

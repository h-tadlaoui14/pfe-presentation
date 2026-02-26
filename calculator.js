/* ================================
   STAYGENIE — Subsidy Estimator Logic
   ================================ */

const SubsidyCalculator = {
    currency: 'MAD',
    rate: 0.091, // 1 MAD = 0.091 EUR approx

    init() {
        const inputs = ['property-price', 'monthly-income', 'first-buyer'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.calculate());
                el.addEventListener('change', () => this.calculate());
            }
        });

        // Listen for currency changes
        document.addEventListener('currencyChange', (e) => {
            this.currency = e.detail.currency;
            this.calculate();
        });

        this.calculate();
    },

    calculate() {
        const priceInput = parseFloat(document.getElementById('property-price').value) || 0;
        const incomeInput = parseFloat(document.getElementById('monthly-income').value) || 0;
        const isFirstBuyer = document.getElementById('first-buyer').value === 'yes';

        // Always calculate in MAD first
        let price = priceInput;
        let income = incomeInput;

        if (this.currency === 'EUR') {
            price = priceInput / this.rate;
            income = incomeInput / this.rate;
        }

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
            explanation = `As the property price is <strong>≤ ${this.formatValue(300000)}</strong>, you are eligible for the maximum direct aid of ${this.formatValue(100000)}.`;
        } else if (price > 300000 && price <= 700000) {
            amount = 70000;
            explanation = `For properties between <strong>${this.formatValue(300000)} and ${this.formatValue(700000)}</strong>, you are eligible for ${this.formatValue(70000)} in direct government aid.`;
        } else if (price > 700000) {
            amount = 0;
            explanation = `Properties above <strong>${this.formatValue(700000)}</strong> currently do not qualify for the Daam Sakane direct aid program.`;
            badgeText = "Exceeds Limit";
        } else {
            explanation = "Enter a property price to see your estimated aid.";
        }

        // FOGARIM check
        if (price > 0 && price <= 250000 && income <= 6000) {
            explanation += ` <br><br>🛡️ Additionally, you may qualify for <strong>FOGARIM</strong> (70% loan guarantee) due to your income level.`;
        }

        this.setResult(amount, explanation, badgeText);
    },

    formatValue(madAmount) {
        if (this.currency === 'EUR') {
            const eur = madAmount * this.rate;
            return eur.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' €';
        }
        return madAmount.toLocaleString() + ' MAD';
    },

    setResult(amount, expl, badgeText) {
        const amountEl = document.getElementById('subsidy-result-amount');
        const explEl = document.getElementById('subsidy-result-expl');
        const badgeEl = document.getElementById('subsidy-badge');

        if (amountEl) {
            amountEl.textContent = this.formatValue(amount);
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

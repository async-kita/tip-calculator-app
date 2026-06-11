class TipCalculator {
  selectors = {
    root: "[data-js-tip-calculator]",
    form: "[data-js-tip-calculator-form]",
    field: "[data-js-tip-calculator-field]",
    inputAmount: "[data-js-tip-calculate-input-amount]",
    button: "[data-js-tip-calculator-button]",
    inputCustom: "[data-js-tip-calculator-custom]",
    inputPerson: "[data-js-tip-calculate-input-person]",
    amount: "[data-js-tip-calculator-tip-amount]",
    total: "[data-js-tip-calculator-total]",
    resetButton: "[data-js-tip-calculator-reset-button]",
  };

  attributes = {
    button: "data-js-tip-calculator-button",
    disabled: "disabled",
  };

  stateClasses = {
    isActive: "is-active",
    hasError: "has-error",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.formElement = this.rootElement.querySelector(this.selectors.form);
    this.fieldsElement = this.rootElement.querySelectorAll(
      this.selectors.field,
    );
    this.inputAmountElement = this.rootElement.querySelector(
      this.selectors.inputAmount,
    );
    this.buttonElements = this.rootElement.querySelectorAll(
      this.selectors.button,
    );
    this.inputCustomElement = this.rootElement.querySelector(
      this.selectors.inputCustom,
    );
    this.inputPersonElement = this.rootElement.querySelector(
      this.selectors.inputPerson,
    );
    this.amountElement = this.rootElement.querySelector(this.selectors.amount);
    this.totalElement = this.rootElement.querySelector(this.selectors.total);
    this.resetButtonElement = this.rootElement.querySelector(
      this.selectors.resetButton,
    );
    this.state = {
      bill: 0,
      percent: 0,
      person: 0,
      tipAmount: 0,
      total: 0,
    };
    this.bindEvents();
  }

  updateUI() {
    this.amountElement.textContent = this.state.tipAmount.toFixed(2);
    this.totalElement.textContent = this.state.total.toFixed(2);
  }

  calculate() {
    if (this.state.bill > 0 && this.state.person > 0) {
      const percent = (this.state.bill * this.state.percent) / 100;
      const sum = percent + this.state.bill;
      this.state.tipAmount =
        Math.round((percent / this.state.person) * 100) / 100;
      this.state.total = Math.round((sum / this.state.person) * 100) / 100;
      this.resetButtonElement.disabled = false;
      this.updateUI();
    }
  }

  validation(element) {
    if (element.value === "" || +element.value === 0) {
      this.reset();
      this.updateUI();
    }

    if (+element.value > 0 || element.value === "") {
      element
        .closest(this.selectors.field)
        .classList.remove(this.stateClasses.hasError);
      return true;
    } else {
      element
        .closest(this.selectors.field)
        .classList.add(this.stateClasses.hasError);
      return false;
    }
  }

  onInput = event => {
    if (event.target === this.inputAmountElement) {
      this.validation(event.target)
        ? (this.state.bill = +event.target.value)
        : 0;
    }

    if (event.target === this.inputPersonElement) {
      this.validation(event.target)
        ? (this.state.person = +event.target.value)
        : 0;
    }

    if (event.target === this.inputCustomElement) {
      this.buttonElements.forEach(button =>
        button.classList.remove(this.stateClasses.isActive),
      );
      this.state.percent = +event.target.value;
    }

    this.calculate();
  };

  onClickButtonPercent = event => {
    this.buttonElements.forEach(button => {
      if (button === event.target) {
        event.target.classList.toggle(this.stateClasses.isActive);
        this.state.percent === event.target.getAttribute(this.attributes.button)
          ? (this.state.percent = 0)
          : (this.state.percent = +event.target.getAttribute(
              this.attributes.button,
            ));
        this.inputCustomElement.value = "";
      } else {
        button.classList.remove(this.stateClasses.isActive);
      }
    });

    this.calculate();
  };

  reset(full = false) {
    this.state.tipAmount = 0;
    this.state.total = 0;
    this.resetButtonElement.disabled = true;
    if (full) {
      this.state.bill = 0;
      this.state.percent = 0;
      this.state.person = 0;
      this.inputAmountElement.value = "";
      this.inputPersonElement.value = "";
      this.inputCustomElement.value = "";
      this.buttonElements.forEach(button =>
        button.classList.remove(this.stateClasses.isActive),
      );
      this.inputAmountElement.focus();
    }
  }

  onClickResetButton = () => {
    this.reset(true);
    this.updateUI();
  };

  bindEvents() {
    this.inputAmountElement.addEventListener("input", event =>
      this.onInput(event),
    );
    this.inputPersonElement.addEventListener("input", event =>
      this.onInput(event),
    );
    this.buttonElements.forEach(button =>
      button.addEventListener("click", event =>
        this.onClickButtonPercent(event),
      ),
    );
    this.inputCustomElement.addEventListener("input", event =>
      this.onInput(event),
    );
    this.resetButtonElement.addEventListener("click", this.onClickResetButton);
  }
}

new TipCalculator();

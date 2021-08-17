describe("React Sanctum", () => {
  let twoFactorSecret;
  let recoveryCodes;

  it("Can login without two factor authentication", () => {
    cy.visit("http://127.0.0.1:3000")
      .get('[data-testid="login-without-factor"]')
      .click()
      .get('[data-testid="signed-in"]')
      .should("be.visible");
  });

  it("Can sign out", () => {
    cy.visit("http://127.0.0.1:3000")
      .get('[data-testid="login-without-factor"]')
      .click()
      .get('[data-testid="signed-in"]')
      .should("be.visible")
      .get('[data-testid="sign-out"]')
      .click()
      .get('[data-testid="signed-out"]');
  });

  it("Can set up two factor authentication", () => {
    cy.visit("http://127.0.0.1:3000")
      .get('[data-testid="login-without-factor"]')
      .click()
      .get('[data-testid="signed-in"]')
      .should("be.visible")
      .get('[data-testid="enable-two-factor"]')
      .click()
      .get("#twoFactorSecret")
      .should("not.be.empty");

    cy.get("#twoFactorSecret").should(($div) => {
      twoFactorSecret = $div.text();
    });

    cy.get("#recoveryCodes").should(($div) => {
      recoveryCodes = JSON.parse($div.text());
    });
  });

  it("Can login with two factor authentication", () => {
    cy.visit("http://127.0.0.1:3000")
      .get('[data-testid="login-with-factor"]')
      .click()
      .get('[data-testid="two-factor-secret"]')
      .type(twoFactorSecret)
      .get('[data-testid="login-two-factor-sign-in"]')
      .click()
      .get('[data-testid="signed-in"]')
      .should("be.visible");
  });

  it("Can login with a recovery code", () => {
    cy.visit("http://127.0.0.1:3000")
      .get('[data-testid="login-with-recovery"]')
      .click()
      .get('[data-testid="recovery-code"]')
      .type(recoveryCodes[0])
      .get('[data-testid="login-recovery-sign-in"]')
      .click()
      .get('[data-testid="signed-in"]')
      .should("be.visible");
  });
});

Feature: Ecommerce shopping and checkout

  Scenario: Browse product catalog
    Given the user opens the ecommerce homepage
    When the product catalog loads
    Then the user should see a list of available products

  Scenario: Add item to cart and view cart
    Given the user has opened the ecommerce homepage
    When the user adds a product to the cart
    Then the cart count should increase and the cart should list the selected item

  Scenario: Submit checkout with valid customer data
    Given the user has items in the cart
    When the user provides name, email, and address and submits checkout
    Then the order should be accepted and a confirmation message returned

  Scenario: Persist completed orders
    Given the user submits a valid checkout
    When the checkout completes successfully
    Then the server should store the order in order history

  Scenario: Prevent checkout for empty cart
    Given the user opens the checkout endpoint with no items selected
    When the user submits checkout
    Then the API should return a validation error stating the cart cannot be empty

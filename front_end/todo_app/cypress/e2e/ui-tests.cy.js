describe('Todo App UI Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    cy.clearLocalStorage()
  })

  describe('Authentication Tests', () => {
    it('should login with valid credentials and redirect to todos page', () => {
      // Visit the login page
      cy.visit('/login')
      
      // Verify we're on the login page
      cy.contains('Sign In').should('be.visible')
      cy.url().should('include', '/login')
      
      // Fill in valid credentials
      cy.get('input[type="email"]').should('be.visible').type('test@example.com')
      cy.get('input[type="password"]').should('be.visible').type('password123')
      
      // Submit the form
      cy.get('button[type="submit"]').contains('Sign In').click()
      
      // Wait for loading to complete
      cy.waitForPageLoad()
      
      // Verify redirect to todos page
      cy.url().should('include', '/todos')
      
      // Verify todo page elements are present
      cy.contains('TodoApp').should('be.visible')
      cy.contains('Total Tasks').should('be.visible')
      cy.contains('Active Tasks').should('be.visible')
      cy.contains('Completed').should('be.visible')
      cy.get('button').contains('Add New Todo').should('be.visible')
      
      // Verify user is logged in (header shows user info)
      cy.contains('John Doe').should('be.visible')
      cy.get('button').contains('Logout').should('be.visible')
    })

    it('should show error message with invalid credentials', () => {
      // Visit the login page
      cy.visit('/login')
      
      // Fill in invalid credentials
      cy.get('input[type="email"]').type('wrong@example.com')
      cy.get('input[type="password"]').type('wrongpassword')
      
      // Submit the form
      cy.get('button[type="submit"]').contains('Sign In').click()
      
      // Wait for the request to complete
      cy.wait(1500)
      
      // Verify error message is displayed
      cy.contains('Invalid email or password').should('be.visible')
      
      // Verify we're still on the login page
      cy.url().should('include', '/login')
      
      // Verify the form is still visible
      cy.contains('Sign In').should('be.visible')
    })

    it('should navigate between login and signup pages', () => {
      // Start on login page
      cy.visit('/login')
      cy.contains('Sign In').should('be.visible')
      
      // Click signup link
      cy.contains('Sign up').click()
      
      // Verify we're on signup page
      cy.url().should('include', '/signup')
      cy.contains('Create Account').should('be.visible')
      cy.get('input[placeholder*="Enter your full name"]').should('be.visible')
      
      // Click login link
      cy.contains('Sign in').click()
      
      // Verify we're back on login page
      cy.url().should('include', '/login')
      cy.contains('Sign In').should('be.visible')
    })

    it('should successfully signup with valid information', () => {
      // Visit signup page
      cy.visit('/signup')
      
      // Fill in signup form
      cy.get('input[placeholder*="Enter your full name"]').type('Test User')
      cy.get('input[type="email"]').type('newuser@example.com')
      cy.get('input[placeholder*="Create a password"]').type('password123')
      cy.get('input[placeholder*="Confirm your password"]').type('password123')
      
      // Submit the form
      cy.get('button[type="submit"]').contains('Create Account').click()
      
      // Wait for loading to complete
      cy.waitForPageLoad()
      
      // Verify redirect to todos page
      cy.url().should('include', '/todos')
      
      // Verify user is logged in with correct name
      cy.contains('Test User').should('be.visible')
    })
  })

  describe('Todo Management Tests', () => {
    beforeEach(() => {
      // Login before each todo test
      cy.loginWithValidCredentials()
      cy.waitForPageLoad()
    })

    it('should create a new todo item', () => {
      // Get initial todo count
      cy.get('[data-testid="total-tasks"]').invoke('text').then((initialCount) => {
        const initialNumber = parseInt(initialCount)
        
        // Create a new todo
        const todoTitle = 'Test Todo Item'
        const todoDescription = 'This is a test todo description'
        
        cy.createTodo(todoTitle, todoDescription)
        
        // Wait for the todo to be created
        cy.wait(1000)
        
        // Verify the new todo appears in the list
        cy.contains(todoTitle).should('be.visible')
        cy.contains(todoDescription).should('be.visible')
        
        // Verify the total count increased
        cy.get('[data-testid="total-tasks"]').should('contain', (initialNumber + 1).toString())
        
        // Verify the active count increased
        cy.get('[data-testid="active-tasks"]').invoke('text').then((activeCount) => {
          expect(parseInt(activeCount)).to.be.greaterThan(0)
        })
      })
    })

    it('should edit an existing todo item', () => {
      // First create a todo to edit
      const originalTitle = 'Original Todo Title'
      const updatedTitle = 'Updated Todo Title'
      const updatedDescription = 'Updated description'
      
      cy.createTodo(originalTitle, 'Original description')
      cy.wait(1000)
      
      // Find and click the edit button for our todo
      cy.contains(originalTitle).parent().parent().within(() => {
        cy.get('button').contains('svg').first().click() // Edit button (first icon)
      })
      
      // Update the todo
      cy.get('input[value*="Original Todo Title"]').clear().type(updatedTitle)
      cy.get('textarea').clear().type(updatedDescription)
      cy.get('button').contains('Update Todo').click()
      
      // Wait for update to complete
      cy.wait(1000)
      
      // Verify the updated todo appears
      cy.contains(updatedTitle).should('be.visible')
      cy.contains(updatedDescription).should('be.visible')
      
      // Verify the original title is no longer present
      cy.contains(originalTitle).should('not.exist')
    })

    it('should delete a todo item', () => {
      // First create a todo to delete
      const todoToDelete = 'Todo to be deleted'
      
      cy.createTodo(todoToDelete, 'This todo will be deleted')
      cy.wait(1000)
      
      // Get initial count
      cy.get('[data-testid="total-tasks"]').invoke('text').then((initialCount) => {
        const initialNumber = parseInt(initialCount)
        
        // Find and click the delete button for our todo
        cy.contains(todoToDelete).parent().parent().within(() => {
          cy.get('button').last().click() // Delete button (last button)
        })
        
        // Confirm deletion in the alert dialog
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true)
        })
        
        // Click delete button again (since we stubbed the confirm)
        cy.contains(todoToDelete).parent().parent().within(() => {
          cy.get('button').last().click()
        })
        
        // Wait for deletion to complete
        cy.wait(1000)
        
        // Verify the todo is no longer present
        cy.contains(todoToDelete).should('not.exist')
        
        // Verify the total count decreased
        cy.get('[data-testid="total-tasks"]').should('contain', (initialNumber - 1).toString())
      })
    })

    it('should toggle todo completion status', () => {
      // Create a new todo
      const todoTitle = 'Todo to complete'
      cy.createTodo(todoTitle)
      cy.wait(1000)
      
      // Get initial active and completed counts
      cy.get('[data-testid="active-tasks"]').invoke('text').then((initialActive) => {
        cy.get('[data-testid="completed-tasks"]').invoke('text').then((initialCompleted) => {
          const initialActiveNumber = parseInt(initialActive)
          const initialCompletedNumber = parseInt(initialCompleted)
          
          // Find and click the checkbox to complete the todo
          cy.contains(todoTitle).parent().parent().within(() => {
            cy.get('button').first().click() // Checkbox button
          })
          
          // Wait for status update
          cy.wait(1000)
          
          // Verify the counts updated
          cy.get('[data-testid="active-tasks"]').should('contain', (initialActiveNumber - 1).toString())
          cy.get('[data-testid="completed-tasks"]').should('contain', (initialCompletedNumber + 1).toString())
          
          // Verify the todo appears with completed styling
          cy.contains(todoTitle).should('have.class', 'line-through')
        })
      })
    })

    it('should filter todos by status', () => {
      // Create completed and active todos
      cy.createTodo('Active Todo', 'This should remain active')
      cy.wait(500)
      
      cy.createTodo('Todo to Complete', 'This will be completed')
      cy.wait(500)
      
      // Complete the second todo
      cy.contains('Todo to Complete').parent().parent().within(() => {
        cy.get('button').first().click()
      })
      cy.wait(1000)
      
      // Test "Active" filter
      cy.get('button').contains('Active').click()
      cy.contains('Active Todo').should('be.visible')
      cy.contains('Todo to Complete').should('not.exist')
      
      // Test "Completed" filter
      cy.get('button').contains('Completed').click()
      cy.contains('Todo to Complete').should('be.visible')
      cy.contains('Active Todo').should('not.exist')
      
      // Test "All" filter
      cy.get('button').contains('All').click()
      cy.contains('Active Todo').should('be.visible')
      cy.contains('Todo to Complete').should('be.visible')
    })

    it('should display empty states correctly', () => {
      // Test empty state for completed todos
      cy.get('button').contains('Completed').click()
      cy.contains('No completed todos').should('be.visible')
      cy.contains('Complete some tasks to see them here!').should('be.visible')
      
      // If there are no active todos, test that state too
      cy.get('button').contains('Active').click()
      // This will depend on existing todos, so we'll check if the empty state exists
      cy.get('body').then(($body) => {
        if ($body.find(':contains("No active todos")').length > 0) {
          cy.contains('No active todos').should('be.visible')
          cy.contains('All your tasks are completed!').should('be.visible')
        }
      })
    })
  })

  describe('User Interface and Navigation Tests', () => {
    beforeEach(() => {
      cy.loginWithValidCredentials()
      cy.waitForPageLoad()
    })

    it('should display user information in header', () => {
      // Verify header elements
      cy.contains('TodoApp').should('be.visible')
      cy.contains('John Doe').should('be.visible')
      cy.get('button').contains('Logout').should('be.visible')
    })

    it('should logout successfully', () => {
      // Click logout button
      cy.get('button').contains('Logout').click()
      
      // Verify redirect to login page
      cy.url().should('include', '/login')
      cy.contains('Sign In').should('be.visible')
      
      // Verify user is logged out (try to access todos directly)
      cy.visit('/todos')
      cy.url().should('include', '/login')
    })

    it('should display statistics correctly', () => {
      // Verify statistics cards are present
      cy.contains('Total Tasks').should('be.visible')
      cy.contains('Active Tasks').should('be.visible')
      cy.contains('Completed').should('be.visible')
      
      // Verify statistics have numeric values
      cy.get('[data-testid="total-tasks"]').should('match', /\d+/)
      cy.get('[data-testid="active-tasks"]').should('match', /\d+/)
      cy.get('[data-testid="completed-tasks"]').should('match', /\d+/)
    })

    it('should be responsive on mobile viewport', () => {
      // Test mobile viewport
      cy.viewport(375, 667)
      
      // Verify key elements are still visible and accessible
      cy.contains('TodoApp').should('be.visible')
      cy.get('button').contains('Add New Todo').should('be.visible')
      cy.contains('Total Tasks').should('be.visible')
      
      // Test that the layout adapts properly
      cy.get('.grid').should('exist') // Statistics grid should exist
      
      // Reset viewport
      cy.viewport(1280, 720)
    })
  })

  describe('Form Validation Tests', () => {
    it('should validate login form fields', () => {
      cy.visit('/login')
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Check for validation messages (these might appear after interaction)
      cy.get('input[type="email"]').focus().blur()
      cy.get('input[type="password"]').focus().blur()
      
      // Try invalid email format
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').type('123') // Too short
      cy.get('button[type="submit"]').click()
      
      // Should still be on login page due to validation
      cy.url().should('include', '/login')
    })

    it('should validate signup form fields', () => {
      cy.visit('/signup')
      
      // Test password mismatch
      cy.get('input[placeholder*="Enter your full name"]').type('Test User')
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[placeholder*="Create a password"]').type('password123')
      cy.get('input[placeholder*="Confirm your password"]').type('differentpassword')
      
      cy.get('button[type="submit"]').click()
      
      // Should show validation error
      cy.contains('Passwords do not match').should('be.visible')
      
      // Should still be on signup page
      cy.url().should('include', '/signup')
    })

    it('should validate todo creation form', () => {
      cy.loginWithValidCredentials()
      cy.waitForPageLoad()
      
      // Try to create todo with empty title
      cy.get('button').contains('Add New Todo').click()
      cy.get('button').contains('Add Todo').click()
      
      // Should show validation error
      cy.contains('Title is required').should('be.visible')
      
      // Try with too short title
      cy.get('input[placeholder*="What needs to be done"]').type('ab')
      cy.get('button').contains('Add Todo').click()
      
      // Should show validation error
      cy.contains('Title must be at least 3 characters').should('be.visible')
    })
  })
})
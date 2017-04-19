var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
 
var Promise = require('bluebird');
var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();


var promiseWhile = function(condition, action) {
    var resolver = Promise.defer();

    var loop = function() {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };

    process.nextTick(loop);

    return resolver.promise;
};
 
function addItem() {
    var addBtn = driver.findElement(webdriver.By.id('add_item'));
    addBtn.click();
	var nameInput = driver.findElement(webdriver.By.id('name_input'));
	var descInput = driver.findElement(webdriver.By.id('desc_input'));
	var priceInput = driver.findElement(webdriver.By.id('price_input'));
	var submitBtn = driver.findElement(webdriver.By.id('submit_item_btn'));
	

	nameInput.sendKeys('Test Item');
	descInput.sendKeys('Input Description');
	priceInput.sendKeys(4.33);
	submitBtn.click();
}

function findCreatedItemRow(changeRowFunction, done, is_altered) {
	var row = driver.findElement(webdriver.By.css("tbody > tr:last-child"));
	row.getAttribute("innerHTML").then(function(row_text) {
		assert.notEqual(row_text.indexOf('<td class="griddle-cell">Test Item</td>'), -1); //item created successfully!
		if(is_altered) {
			assert.notEqual(row_text.indexOf('<td class="griddle-cell">Input DescriptionAltered</td>'), -1); //item altered successfully!
		}
		if(row_text.indexOf('<td class="griddle-cell">Test Item</td>') !== -1) {
			changeRowFunction(row, done, is_altered);
		}
	});			
}
 
function deleteCreatedItem(row, done, is_altered) {

	//Found our item
    row.click();
	setTimeout(function() {
		var delete_btn = driver.findElement(webdriver.By.id('delete_btn'));
		delete_btn.click();
		setTimeout(function() {
			var submit_delete_btn = driver.findElement(webdriver.By.id('submit_delete_btn'));
			submit_delete_btn.click();
			setTimeout(function() {
				console.log("Done");
				done();
				if(is_altered) {
					driver.quit();
				}
			}, 2000);
		}, 2000);
	}, 1000);
	
} 

function editCreatedItem(row, done, is_altered) {

    row.click();
	setTimeout(function() {
		var descInput = driver.findElement(webdriver.By.id('desc_input'));
		descInput.sendKeys('Altered');
		descInput.getAttribute("value").then(function(value) {
			assert.equal(value,"Input DescriptionAltered");
		});
		setTimeout(function() {
			var submit_btn = driver.findElement(webdriver.By.id('submit_change_btn'));
			submit_btn.click();
			setTimeout(function() {
				findCreatedItem("delete", done, true);//At this point we have altered it
			}, 2000);
		}, 2000);
	}, 1000);
	
} 


function findCreatedItem(type, done, is_altered) {
	var nextFound = true;

	setTimeout(function() {
		promiseWhile(function() {
		    // Condition for stopping
				return nextFound;
		}, function() {
		    // Action to run, should return a promise
		    return new Promise(function(resolve, reject) {
		        // Arbitrary 250ms async method to simulate async process
		        // In real usage it could just be a normal async event that 
		        // returns a Promise.
	     	   	setTimeout(function() {
					driver.findElement(webdriver.By.id('next_btn')).then(function(webElement) {
						webElement.click();
		
					    }, function(err) {
							nextFound = false;
					});
		            resolve();
				},3000);
		    });
		}).then(function() {
		    // Notice we can chain it because it's a Promise, 
		    // this will run after completion of the promiseWhile Promise!
			//Great now we can delete the item
			if(type === "delete") {
				findCreatedItemRow(deleteCreatedItem, done, is_altered);
			}
			if(type === "edit") {
				findCreatedItemRow(editCreatedItem, done, is_altered);
			}
		    
			//driver.quit();
		});
	}, 2000);	
}
 
test.beforeEach(function() {
   // runs before each test in this block
	driver.get('localhost:5000');
	//We want to add an item each time 
	setTimeout(function() {
	 	addItem();
	 },3000);
 }); 
 
test.describe('Add new item', function() {
  test.it('we can create and delete the newly created item', function(done) {
	  findCreatedItem("delete", done, false);
  });
  
  test.it('we can create and edit the newly created item', function(done) {
	  findCreatedItem("edit", done, false);
  });
});
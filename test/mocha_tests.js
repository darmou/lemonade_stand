import assert  from "assert";
import test  from "selenium-webdriver/testing";
import webdriver from "selenium-webdriver";

let driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

 
function addItem() {
    let addBtn = driver.findElement(webdriver.By.id("add_item"));
    addBtn.click();
    let nameInput = driver.findElement(webdriver.By.id("name_input"));
    let descInput = driver.findElement(webdriver.By.id("desc_input"));
    let priceInput = driver.findElement(webdriver.By.id("price_input"));
    let submitBtn = driver.findElement(webdriver.By.id("submit_item_btn"));
	

	nameInput.sendKeys("Test Item");
	descInput.sendKeys("Input Description");
	priceInput.sendKeys(4.33);
	submitBtn.click();
}

function findCreatedItemRow(changeRowFunction, done, is_altered) {
	let row = driver.findElement(webdriver.By.css("tbody > tr:last-child"));
	row.getAttribute("innerHTML").then(function(row_text) {
		assert.notEqual(row_text.indexOf('<td class="griddle-cell">Test Item</td>'), -1); //item created successfully!
		if(is_altered) {
			assert.notEqual(row_text.indexOf('<td class="griddle-cell">Input DescriptionAltered</td>'), -1); //item altered successfully!
		}
		if(row_text.indexOf('<td class="griddle-cell">Test Item</td>') !== -1) {
			changeRowFunction(row, done);
		}
	});			
}
 
function deleteCreatedItem(row, done) {

	//Found our item
    row.click();
	setTimeout(function() {
		let delete_btn = driver.findElement(webdriver.By.id("delete_btn"));
		delete_btn.click();
		setTimeout(function() {
			let submit_delete_btn = driver.findElement(webdriver.By.id("submit_delete_btn"));
			submit_delete_btn.click();
			setTimeout(function() {
				console.log("Done");
				done();
			}, 2000);
		}, 2000);
	}, 1000);
	
} 

function editCreatedItem(row, done) {

    row.click();
	setTimeout(function() {
		let descInput = driver.findElement(webdriver.By.id("desc_input"));
		descInput.sendKeys("Altered");
		descInput.getAttribute("value").then(function(value) {
			assert.equal(value,"Input DescriptionAltered");
		});
		setTimeout(function() {
			let submit_btn = driver.findElement(webdriver.By.id("submit_change_btn"));
			submit_btn.click();
			setTimeout(function() {
				findCreatedItem("delete", done, true);//At this point we have altered it so we want to assert that we can find our altered item
			}, 2000);
		}, 2000);
	}, 1000);
	
} 


function findNextButton(nextFound) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            driver.findElement(webdriver.By.id("next_btn")).then((webElement) => {
                webElement.click();
                resolve(nextFound);
            }, (err) => {
            	//console.log(err);
                nextFound = false;
                resolve(nextFound);
            });

        },3000);
    });
}

function findCreatedItem(type, done, is_altered) {
	let nextFound = true; //

	setTimeout(function() {
		let loop;
        Promise.resolve(nextFound).then(loop = (nextFound) => {
            // The loop check
            if (nextFound) {              // The post iteration increment
                return findNextButton(nextFound).then(loop);
            }
        }).then(() => {
            //Great now we can delete the item
            if(type === "delete") {
                findCreatedItemRow(deleteCreatedItem, done, is_altered);
            }
            if(type === "edit") {
                findCreatedItemRow(editCreatedItem, done, is_altered);
            }
        }).catch(function(e) {
            console.log("error", e);
        });

		
	}, 2000);	
}
 
test.beforeEach(function() {
   // runs before each test in this block
	setTimeout(() => {
        driver.get("localhost:5000");
        //We want to add an item each time
        setTimeout(() => {
            addItem();
        }, 3000);
    }, 3000);
 }); 
 
test.describe("Add new item", function() {
  test.it("we can create and delete the newly created item", function(done) {
	  findCreatedItem("delete", done, false);
  });
  
  test.it("we can create and edit the newly created item", function(done) {
	  findCreatedItem("edit", done, false);
  });
});

test.after(() => {
    driver.quit(); //Final step to exit
});
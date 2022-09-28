enum EErrors {
	newFoodItemCreation = 'There are some problems with creation of a new food item. Please try again or check the console or network tab',
	getAllFoodItems = 'Cannot get all foodItems. Please try again or check the correctness of the query',
	changeFoodItemAmount = 'There was a problem with changing food amount. Please check whether the code or the types of 2nd & 3rd params correct',
	deleteObjectByCode = 'There was a problem with deleting foodItem. Please doublecheck whether the item you want to delete exists or the code is correct',
}

export { EErrors };

import Parse from 'parse';

import { EParseObjects, EFoodItemFields, EFoodItemCodes, EErrors } from './types';

interface IFoodItem extends IFoodItemEditableProps {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IFoodItemEditableProps {
	foodCode: number;
	amountLasts: number;
	edited?: Array<IEdited>;
	[index: number]: number;
}

type TEditedMethod = 'increment' | 'decrement';

interface IEdited {
	date: Date;
	amount: number;
	method: TEditedMethod;
}

const useParseController = () => {
	/**
	 * @name getObjectQuery
	 * @description A private function which creates Parse Object Query according to the name
	 * @param name A name of the object
	 * @returns Parse.Query instance
	 */
	function getObjectQuery(name: string): Parse.Query {
		const query: Parse.Query = new Parse.Query(name);
		query.find();
		return query;
	}

	/**
	 * @name createNewFoodItem
	 * @async
	 * @description Creates new foodItem (product) in the database
	 * @param name Name of the product
	 * @param properties Object with properties - code, amount, etc.
	 * @returns Boolean value: success / failure
	 */
	async function createNewFoodItem(
		name: string,
		properties: IFoodItemEditableProps
	): Promise<boolean> {
		const objectProperties = {
			name,
			...properties,
		};

		if (objectProperties.edited === undefined) {
			objectProperties.edited = [];
		}

		const newParseObject = new Parse.Object(EParseObjects.Food, objectProperties);

		console.log(newParseObject);

		try {
			await newParseObject.save();
			return true;
		} catch (e) {
			console.warn(EErrors.newFoodItemCreation);
			console.error(e);
			return false;
		}
	}

	async function getFoodItemByCode(code: EFoodItemCodes): Promise<Parse.Object> {
		const query = getObjectQuery(EParseObjects.Food);

		query.equalTo(EFoodItemFields.FoodCode, code);

		const result = await query.find();
		return result[0];
	}

	async function getAllFoodItems(): Promise<Parse.Object[]> {
		const query = getObjectQuery(EParseObjects.Food);

		try {
			const foodItems = query.findAll();
			return foodItems;
		} catch (e) {
			console.warn(EErrors.getAllFoodItems);
			console.error(e);
			return [];
		}
	}

	/**
	 * @name editFoodItemByCode
	 * @async
	 * @description Edit the field of the FoodItem object which is got by code
	 * @param code Food code of the FoodItem (product) from the enum - EFoodItemCodes
	 * @param field Field of the FoodItem (product) - F.E. amountLasts or name
	 * @param value New value the previous value should be exchanged with
	 * @returns Boolean value: success / failure
	 */
	async function editFoodItemByCode(
		code: EFoodItemCodes,
		field: EFoodItemFields,
		value: string | number
	): Promise<boolean> {
		try {
			const targetFoodItem = await getFoodItemByCode(code);
			targetFoodItem.set(field, value);
			const response = await targetFoodItem.save();
			console.log(`updated ${field}, new value: ${response.get(field)}`);
			return true;
		} catch (e) {
			console.warn(EErrors.getAllFoodItems);
			console.error(e);
			return false;
		}
	}

	/**
	 * @name changeFoodItemAmount
	 * @async
	 * @description Add or Remove amount of FoodItem (amountLasts)
	 * @param code Food code of the FoodItem (product) from the enum - EFoodItemCodes
	 * @param method Increment amount or decrement
	 * @param amount Value to use
	 * @returns New object with additional data - see IEdited
	 */
	async function changeFoodItemAmount(
		code: EFoodItemCodes,
		method: TEditedMethod,
		amount: number
	): Promise<IEdited | null> {
		try {
			const targetFoodItem = await getFoodItemByCode(code);
			targetFoodItem[method](EFoodItemFields.AmountLasts, amount);
			const response = await targetFoodItem.save();
			console.log(response);
			return {
				date: new Date(),
				amount,
				method,
			};
		} catch (e) {
			console.error(e);
			console.warn(EErrors.changeFoodItemAmount);
			return null;
		}
	}

	/**
	 * @name deleteObjectByCode
	 * @async
	 * @description Deletes entire FoodItem object by code
	 * @param code Food code of the FoodItem (product) from the enum - EFoodItemCodes
	 * @returns Boolean value: success / failure
	 */
	async function deleteObjectByCode(code: EFoodItemCodes): Promise<boolean> {
		try {
			const targetToDelete = await getFoodItemByCode(code);
			const response = await targetToDelete.destroy();

			console.log(response.get('name'));
			return true;
		} catch (e) {
			console.warn(EErrors.deleteObjectByCode);
			console.error(e);
			return false;
		}
	}

	return {
		createNewFoodItem,
		getObjectQuery,
		getFoodItemByCode,
		getAllFoodItems,
		editFoodItemByCode,
		changeFoodItemAmount,
		deleteObjectByCode,
	};
};

export { useParseController };

// Todo:
// Подумать над тем как реализовать меню на планшете и мобилке
// Перенести основные типы в отдельную папку
// ! Продумать мобильную верстку - начать с нее
// * Продумать методы взаимодействия (Добавить новый, редактировать)
// Продумать новый функционал (погода, статистика)
// Сортировка, фильтрация

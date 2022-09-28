import Parse from 'parse';

/**
 *  @function
 *  @name parseInit
 *  @description initialiazes Parse main settings - back4app app ID and JS key
 *  @return void
 */

export function parseInit(): void {
	Parse.initialize(process.env.REACT_APP_APPLICATION_ID!, process.env.REACT_APP_JS_KEY);
	Parse.serverURL = process.env.REACT_APP_API_URL!;
}

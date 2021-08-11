/** @format */

import MomentTz from 'moment-timezone';
import MOMENT_DEFAULT_FORMAT from '../app/constants/moment-format.constant';
import moment from 'moment';

export default class MomentUtil {
	public validTimezoneNames: string[];
	constructor() {
		this.validTimezoneNames = MomentTz.tz.names();
	}

	public static convertToDefaultTimezoneString(
		dateToConvert: Date,
		timezoneToConvertTo,
		format = MOMENT_DEFAULT_FORMAT
	): string {
		return MomentTz.tz(dateToConvert, timezoneToConvertTo).format(format);
	}

	public static async currentUnixTimeStampDifference(unixTime: number): Promise<number> {
		const receivedTimeMomentInstance = moment.unix(unixTime);
		if (!receivedTimeMomentInstance.isValid()) {
			return undefined;
		}
		const currentTimeMomentInstance = moment().unix();
		return currentTimeMomentInstance - receivedTimeMomentInstance.unix();
	}
	public static async timestampDiffInSeconds(time: Date): Promise<number> {
		const receivedTimeMomentInstance = moment(time);
		console.log({ receivedTimeMomentInstance: receivedTimeMomentInstance.format() });
		if (!receivedTimeMomentInstance.isValid()) {
			return undefined;
		}
		const currentTimeMomentInstance = moment();
		return moment
			.duration(currentTimeMomentInstance.diff(receivedTimeMomentInstance))
			.asSeconds();
	}
}

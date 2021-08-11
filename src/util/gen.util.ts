/** @format */

import Logger from '../lib/Logger';
import MomentUtil from './moment.util';

const logger = new Logger('GenUtil');
class GenUtil {
	public static userToJson(value, timezone, includes = [], skips = []) {
		const d = GenUtil.toJson(value, timezone, includes, skips);
		if (d['lastLogin']) {
			d['lastLogin'] = MomentUtil.convertToDefaultTimezoneString(d['lastLogin'], timezone);
		}
		return d;
	}
	public static eventToJson(value, timezone, includes = [], skips = []) {
		const d = GenUtil.toJson(value, timezone, includes, skips);
		if (d['date']) {
			d['date'] = MomentUtil.convertToDefaultTimezoneString(d['date'], timezone);
		}
		return d;
	}

	public static toJson(value, timezone, includes = [], skips = []) {
		const d: any = {};
		for (const key of includes) {
			d[key] = value[key];
		}

		for (const key of skips) {
			delete d[key];
		}
		d.id = value.id;
		d.createdAt = MomentUtil.convertToDefaultTimezoneString(value.createdAt, timezone);
		d.updatedAt = MomentUtil.convertToDefaultTimezoneString(value.updatedAt, timezone);
		return d;
	}
}

export default GenUtil;

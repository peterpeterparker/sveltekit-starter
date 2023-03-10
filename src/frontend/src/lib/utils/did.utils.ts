export const toNullable = <T>(value?: T): [] | [T] => {
	return value ? [value] : [];
};

export const fromNullable = <T>(value: [] | [T]): T | undefined => {
	return value?.[0];
};

export const toArray = async <T>(data: T): Promise<Array<number>> => {
	const blob: Blob = new Blob([JSON.stringify(data)], {
		type: 'application/json; charset=utf-8'
	});
	return [...new Uint8Array(await blob.arrayBuffer())];
};

export const fromArray = async <T>(data: Array<number>): Promise<T> => {
	const blob: Blob = new Blob([new Uint8Array(data)], {
		type: 'application/json; charset=utf-8'
	});
	return JSON.parse(await blob.text());
};

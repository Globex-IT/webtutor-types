function __decorate(decorators: any[], target: any, key: any, desc: any) {
	for (let i = decorators.length - 1; i >= 0; i--) {
		const decorator = decorators[i];
		if (ObjectType(decorator) === "JsFuncObject") {
			decorator(target, key, desc);
		}
	}
}
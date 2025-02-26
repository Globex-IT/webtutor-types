import id = require("../interfaces/import-details.interface");
import c = require("../config/config");

const imports: id.ImportDetails[] = [
    {method: '.map', path: `${c.Config.packageName}lib/web-soft/core/array/map.ts`},
    {method: '.filter', path: `${c.Config.packageName}lib/web-soft/core/array/filter.ts`},
    {method: '.some', path: `${c.Config.packageName}lib/web-soft/core/array/some.ts`},
    {method: '.any', path: `${c.Config.packageName}lib/web-soft/core/array/any.ts`},
    {method: '.reduce', path: `${c.Config.packageName}lib/web-soft/core/array/reduce.ts`},
    {method: '.includes', path: `${c.Config.packageName}lib/web-soft/core/array/includes.ts`},
    {method: '.find', path: `${c.Config.packageName}lib/web-soft/core/array/find.ts`},
    {method: '.pop', path: `${c.Config.packageName}lib/web-soft/core/array/pop.ts`}
];

export class ImportManager {
    public addFuncImports(content: string) {
        imports.forEach(({ method, path }) => {
            const methodRegex = new RegExp(`\\${method}\\(([^)]*)\\)`, 'g');

            let match;
            while ((match = methodRegex.exec(content)) !== null) {
                const args = match[1];
                if (args.includes('=>')) {
                    content = `//=require ${path} \n` + content;
                    break;
                }
            }
        });

        return content;
    }

    public replaceImports(context: string): string {
        return context.replace(/import\s+.*?\s+from\s+['"]([^'"]+)['"]\s*;?\s*\/\/.*$/gm, (_, path) => {
            return `//=require ${path}.ts`;
        });
    }
}
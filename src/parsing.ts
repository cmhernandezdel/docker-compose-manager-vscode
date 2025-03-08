const yaml = require('js-yaml');
const fs = require('fs');

export const getServiceNames = (file: string) => {
    try {
        const doc = yaml.load(fs.readFileSync(file, 'utf8'));
        if (doc.services) {
            return Object.keys(doc.services);
        }
        return [];
    } catch (err) {
        return [];
    }
}
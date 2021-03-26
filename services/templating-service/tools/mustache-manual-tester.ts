import { createTemplateFromFile } from '../lib/mustache-templating';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

//Template Data
const data = {};
const templateLocation = __dirname + 'rest/of/path';

(async () => {
  try {
    const templateString = await createTemplateFromFile(templateLocation, data);
    return await fs.promises.writeFile(__dirname + '/../test-templates/' + uuid() + '.html', templateString, {
      encoding: 'utf8'
    });
  } catch (err) {
    console.error(err);
  }
})();
